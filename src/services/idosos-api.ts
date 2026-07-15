import type { Idoso, IdosoFormValues } from '@/types/idoso';

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'https://api-associacao-idosos.onrender.com/api';

async function tratarResposta<T>(resposta: Response): Promise<T> {
  const texto = await resposta.text();
  const dados = texto ? JSON.parse(texto) : null;

  if (!resposta.ok) {
    const mensagem = (dados && (dados.message || dados.erro)) || 'Erro ao comunicar com o servidor.';
    throw new Error(mensagem);
  }

  return dados as T;
}

/**
 * Monta o corpo da requisição. Quando `foto` é uma uri local (escolhida no
 * dispositivo, ex.: "file:///...") envia como multipart/form-data, igual ao
 * formulário web; caso contrário envia JSON simples.
 */
function montarCorpo(dados: IdosoFormValues): { headers: Record<string, string>; body: BodyInit } {
  const fotoEhArquivoLocal = !!dados.foto && !dados.foto.startsWith('http');

  if (!fotoEhArquivoLocal) {
    return {
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados),
    };
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

  return { headers: {}, body: formData };
}

export async function listarIdosos(): Promise<Idoso[]> {
  const resposta = await fetch(`${API_BASE_URL}/idosos`);
  return tratarResposta<Idoso[]>(resposta);
}

export async function buscarIdoso(id: string): Promise<Idoso> {
  const resposta = await fetch(`${API_BASE_URL}/idosos/${id}`);
  return tratarResposta<Idoso>(resposta);
}

export async function criarIdoso(dados: IdosoFormValues): Promise<Idoso> {
  const { headers, body } = montarCorpo(dados);
  const resposta = await fetch(`${API_BASE_URL}/idosos`, { method: 'POST', headers, body });
  return tratarResposta<Idoso>(resposta);
}

export async function atualizarIdosoRequest(id: string, dados: IdosoFormValues): Promise<Idoso> {
  const { headers, body } = montarCorpo(dados);
  const resposta = await fetch(`${API_BASE_URL}/idosos/${id}`, { method: 'PUT', headers, body });
  return tratarResposta<Idoso>(resposta);
}

export async function deletarIdosoRequest(id: string): Promise<void> {
  const resposta = await fetch(`${API_BASE_URL}/idosos/${id}`, { method: 'DELETE' });
  if (!resposta.ok) {
    const texto = await resposta.text();
    const dados = texto ? JSON.parse(texto) : null;
    throw new Error((dados && dados.message) || 'Erro ao excluir idoso.');
  }
}
