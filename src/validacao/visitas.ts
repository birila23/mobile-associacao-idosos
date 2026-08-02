// @/schemas/visita.ts
import { z } from 'zod';

export const visitaSchema = z.object({
  nome: z
    .string({ required_error: 'Nome é obrigatório' })
    .trim()
    .min(3, 'Nome deve ter ao menos 3 caracteres'),
  data: z.string({
    required_error: 'A data da visita é obrigatória'
  })
});

export type VisitaFormValues = z.infer<typeof visitaSchema>;