import { z } from 'zod';

export const eventoSchema = z.object({
  nome: z
    .string({ required_error: 'O nome é obrigatório' })
    .min(1, 'O nome é obrigatório')
    .min(3, 'O nome deve ter pelo menos 3 caracteres'),

  descricao: z.string().optional(),

  data: z.coerce.date({
    required_error: 'A data é obrigatória',
    invalid_type_error: 'Selecione uma data válida',
  }),

  imagem: z.string().optional(),

  local: z.object({
    type: z.literal('Point'),
    coordinates: z.tuple([
      z.coerce
        .number({ invalid_type_error: 'Longitude inválida' })
        .min(-180, 'Longitude inválida')
        .max(180, 'Longitude inválida'),
      z.coerce
        .number({ invalid_type_error: 'Latitude inválida' })
        .min(-90, 'Latitude inválida')
        .max(90, 'Latitude inválida'),
    ]),
  }),
});

export type EventoFormValues = z.infer<typeof eventoSchema>;
export type CreateEventoDTO = EventoFormValues;