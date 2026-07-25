import type { Visita, VisitaFormValues } from '@/types/visita';
import { apiClient } from './api-client';

function extrairVisitaBruta(corpo: any): any {
  if (!corpo) return corpo;
  if (corpo.id || corpo._id) return corpo;
  if (corpo.visita) return corpo.visita;
  if (corpo.newVisita) return corpo.newVisita;
  if (corpo.data) return corpo.data;
  return corpo;
}

function extrairLista(corpo: any): any[] {
  if (Array.isArray(corpo)) return corpo;
  if (Array.isArray(corpo?.visitas)) return corpo.visitas;
  if (Array.isArray(corpo?.data)) return corpo.data;
  return [];
}

function normalizarVisita(bruto: any): Visita {
  const objeto = extrairVisitaBruta(bruto);
  return {
    ...objeto,
    id: String(objeto.id ?? objeto._id),
  };
}

export async function listarVisitas(): Promise<Visita[]> {
  const { data } = await apiClient.get<any>('/visitas');
  return extrairLista(data).map(normalizarVisita);
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