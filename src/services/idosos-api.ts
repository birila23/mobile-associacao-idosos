import { apiClient } from './api-client';
import type { Idoso, IdosoFormValues } from '@/types/idoso';

/**
 * Monta o corpo da requisição. Quando `foto` é uma uri local (escolhida no
 * dispositivo, ex.: "file:///...") envia como multipart/form-data, igual ao
 * formulário web; caso contrário envia os dados como objeto simples (o
 * axios já serializa como JSON).
 */
function montarCorpo(dados: IdosoFormValues): FormData | IdosoFormValues {
  const fotoEhArquivoLocal = !!dados.foto && !dados.foto.startsWith('http');

  if (!fotoEhArquivoLocal) {
    return dados;
  }

  const formData = new FormData();
  Object.entries(dados).forEach(([chave, valor]) => {
    if (chave === 'foto' || valor === undefined || valor === null) return;
    formData.append(chave, String(valor));
  });

  if (dados.foto) {
    const nomeArquivo = dados.foto.split('/').pop() ?? 'foto.jpg';
    const extensao = nomeArquivo.split('.').pop()?.toLowerCase();
    formData.append('foto', {
      uri: dados.foto,
      name: nomeArquivo,
      type: extensao === 'png' ? 'image/png' : 'image/jpeg',
    } as unknown as Blob);
  }

  return formData;
}

/**
 * Alguns backends embrulham a resposta (ex.: { message, idoso: {...} } em
 * vez do idoso "cru"). Essa função desembrulha antes de normalizar.
 */
function extrairIdosoBruto(corpo: any): any {
  if (!corpo) return corpo;
  if (corpo.id || corpo._id) return corpo;
  if (corpo.idoso) return corpo.idoso;
  if (corpo.newIdoso) return corpo.newIdoso;
  if (corpo.data) return corpo.data;
  return corpo;
}

function extrairLista(corpo: any): any[] {
  if (Array.isArray(corpo)) return corpo;
  if (Array.isArray(corpo?.idosos)) return corpo.idosos;
  if (Array.isArray(corpo?.data)) return corpo.data;
  return [];
}

/**
 * Garante que todo idoso tenha `id` preenchido, mesmo que o backend
 * retorne o identificador como `_id` (padrão do MongoDB/Mongoose).
 */
function normalizarIdoso(bruto: any): Idoso {
  const objeto = extrairIdosoBruto(bruto);
  console.log('Idoso bruto recebido da API:', objeto);
  return {
    ...objeto,
    id: String(objeto.id ?? objeto._id),
  };
}

export async function listarIdosos(): Promise<Idoso[]> {
  const { data } = await apiClient.get<any>('/idosos');
  return extrairLista(data).map(normalizarIdoso);
}

export async function buscarIdoso(id: string): Promise<Idoso> {
  const { data } = await apiClient.get<any>(`/idoso/${id}`);
  return normalizarIdoso(data);
}

export async function criarIdoso(dados: IdosoFormValues): Promise<Idoso> {
  const { data } = await apiClient.post<any>('/cadastrarIdoso', montarCorpo(dados));
  return normalizarIdoso(data);
}

export async function atualizarIdosoRequest(id: string, dados: IdosoFormValues): Promise<Idoso> {
  const { data } = await apiClient.put<any>(`/idoso/${id}`, montarCorpo(dados));
  return normalizarIdoso(data);
}

export async function deletarIdosoRequest(id: string): Promise<void> {
  await apiClient.delete(`/idoso/${id}`);
}