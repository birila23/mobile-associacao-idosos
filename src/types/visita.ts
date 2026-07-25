export interface Visita {
  id: string;
  nome: string
  dataVisita: string
}

export type VisitaFormValues = Omit<Visita, 'id'>;

export const visitaFormValuesVazio: VisitaFormValues = {
  nome: '',
  dataVisita: '',
};