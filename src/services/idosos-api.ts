import { Platform } from 'react-native';

import { apiClient, API_ORIGIN } from './api-client';
import type { Idoso, IdosoFormValues } from '@/types/idoso';

/**
 * Uma foto é "arquivo local" quando ainda não foi enviada ao servidor:
 * uri de dispositivo (file://, content://) ou uri gerada pelo image picker
 * na web (data:, blob:). Qualquer outro valor (caminho relativo do backend
 * como "/uploads/x.jpg", ou já uma URL http completa) é uma foto que já
 * está no servidor e não deve ser reenviada como upload.
 */
function ehArquivoLocal(uri: string): boolean {
  return /^(file|content|data|blob):/i.test(uri);
}

/**
 * Resolve o caminho de foto retornado pelo backend (ex.: "/uploads/x.jpg",
 * relativo à raiz do domínio da API) para uma URL absoluta que o
 * `<Image>`/`<img>` consiga carregar.
 */
function resolverUrlFoto(caminho?: string): string | undefined {
  if (!caminho) return undefined;
  if (/^(https?|file|content|data|blob):/i.test(caminho)) return caminho;
  return `${API_ORIGIN}${caminho.startsWith('/') ? '' : '/'}${caminho}`;
}

/**
 * Monta o corpo da requisição. Quando `foto` é uma uri local (escolhida no
 * dispositivo) envia como multipart/form-data; caso contrário envia os
 * dados como objeto simples (o axios já serializa como JSON).
 *
 * Na web, o FormData do navegador não aceita o objeto `{ uri, name, type }`
 * (isso só funciona no runtime nativo do React Native) — por isso ali a uri
 * local é convertida para um Blob de verdade antes do append.
 */
async function montarCorpo(dados: IdosoFormValues): Promise<FormData | IdosoFormValues> {
  const fotoEhArquivoLocal = !!dados.foto && ehArquivoLocal(dados.foto);

  if (!fotoEhArquivoLocal) {
    return dados;
  }

  const formData = new FormData();
  Object.entries(dados).forEach(([chave, valor]) => {
    if (chave === 'foto' || valor === undefined || valor === null) return;
    formData.append(chave, String(valor));
  });

  if (Platform.OS === 'web') {
    const resposta = await fetch(dados.foto!);
    const blob = await resposta.blob();
    const extensao = blob.type.split('/').pop() || 'jpg';
    formData.append('foto', blob, `foto.${extensao}`);
  } else {
    const nomeArquivo = dados.foto!.split('/').pop() ?? 'foto.jpg';
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
 * retorne o identificador como `_id` (padrão do MongoDB/Mongoose), e que
 * `foto` seja uma URL absoluta pronta para exibir.
 */
function normalizarIdoso(bruto: any): Idoso {
  const objeto = extrairIdosoBruto(bruto);
  return {
    ...objeto,
    id: String(objeto.id ?? objeto._id),
    foto: resolverUrlFoto(objeto.foto),
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
  const { data } = await apiClient.post<any>('/cadastrarIdoso', await montarCorpo(dados));
  return normalizarIdoso(data);
}

export async function atualizarIdosoRequest(id: string, dados: IdosoFormValues): Promise<Idoso> {
  const { data } = await apiClient.put<any>(`/idoso/${id}`, await montarCorpo(dados));
  return normalizarIdoso(data);
}

export async function deletarIdosoRequest(id: string): Promise<void> {
  await apiClient.delete(`/idoso/${id}`);
}
