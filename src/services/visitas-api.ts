import type { Visita, VisitaFormValues } from '@/types/visita';
import { apiClient } from './api-client';

function extrairVisitaBruta(corpo: any): any {
  if (!corpo || typeof corpo !== 'object') return corpo;

  if (corpo.visita && typeof corpo.visita === 'object') return corpo.visita;
  if (corpo.newVisita && typeof corpo.newVisita === 'object') return corpo.newVisita;

  if (
    corpo.data &&
    typeof corpo.data === 'object' &&
    !Array.isArray(corpo.data) &&
    !(corpo.data instanceof Date)
  ) {
    if (corpo.data.id || corpo.data._id || corpo.data.nome) {
      return corpo.data;
    }
  }

  return corpo;
}

function extrairLista(corpo: any): any[] {
  if (!corpo) return [];
  if (Array.isArray(corpo)) return corpo;
  if (Array.isArray(corpo.visitas)) return corpo.visitas;
  if (Array.isArray(corpo.data)) return corpo.data;
  return [];
}

function normalizarVisita(bruto: any): Visita {
  const objeto = extrairVisitaBruta(bruto);

  if (!objeto || typeof objeto !== 'object') {
    return objeto;
  }

  return {
    ...objeto,
    id: String(objeto.id ?? objeto._id ?? ''),
  };
}

export async function listarVisitas(): Promise<Visita[]> {
  const { data } = await apiClient.get<any>('/visitas');
  return extrairLista(data).map(normalizarVisita);
}

export async function buscarVisita(id: string): Promise<Visita> {
  const { data } = await apiClient.get<any>(`/visita/${id}`);
  return normalizarVisita(data);
}

export async function criarVisita(dados: VisitaFormValues): Promise<Visita> {
  const { data } = await apiClient.post<any>('/visita', dados);
  return normalizarVisita(data);
}

export async function atualizarVisitaRequest(id: string, dados: VisitaFormValues): Promise<Visita> {
  const { data } = await apiClient.put<any>(`/visita/${id}`, dados);
  return normalizarVisita(data);
}

export async function deletarVisitaRequest(id: string): Promise<void> {
  await apiClient.delete(`/visita/${id}`);
}