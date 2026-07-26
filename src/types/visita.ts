export interface Visita {
  id: string;
  nome: string
  data: string
}

export type VisitaFormValues = Omit<Visita, 'id'>;

export const visitaFormValuesVazio: VisitaFormValues = {
  nome: '',
  data: '',
};