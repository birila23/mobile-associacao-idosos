
import { z } from 'zod';

const CPF_REGEX = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
const RG_REGEX = /^\d{1,3}(\.\d{3}){2}(-X)?$/;
const SUS_REGEX = /^\d{15}$/;

export const idosoSchema = z.object({
  nome: z
    .string({ required_error: 'Nome é obrigatório' })
    .trim()
    .min(3, 'O nome deve ter pelo menos 3 caracteres'),

  dataNascimento: z
    .string({ required_error: 'Data de nascimento é obrigatória' })
    .min(1, 'Data de nascimento é obrigatória'),

  sexo: z.enum(['masculino', 'feminino'], {
    errorMap: () => ({ message: 'Selecione o sexo' }),
  }),

  cpf: z
    .string({ required_error: 'CPF é obrigatório' })
    .regex(CPF_REGEX, 'Formato CPF inválido (xxx.xxx.xxx-xx)'),

  sus: z
    .string({ required_error: 'SUS é obrigatório' })
    .regex(SUS_REGEX, 'Cartão SUS deve conter 15 dígitos'),

  rg: z
    .string({ required_error: 'RG é obrigatório' })
    .regex(RG_REGEX, 'Formato RG inválido (ex: x.xxx.xxx ou xx.xxx.xxx)'),

  nacionalidade: z
    .string({ required_error: 'Nacionalidade é obrigatória' })
    .trim()
    .min(3, 'A nacionalidade deve ter pelo menos 3 caracteres'),

  naturalidade: z
    .string({ required_error: 'Naturalidade é obrigatória' })
    .trim()
    .min(3, 'A naturalidade deve ter pelo menos 3 caracteres'),

  foto: z.string().optional(),
  dataEmissaoRg: z.string().optional(),
  orgaoEmissorRg: z.string().optional(),
});

export type IdosoFormValues = z.infer<typeof idosoSchema>;