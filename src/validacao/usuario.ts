// @/schemas/usuario.ts
import { z } from 'zod';

const CPF_REGEX = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;

export const createUserSchema = z.object({
  nome: z
    .string({ required_error: 'Nome é obrigatório' })
    .trim()
    .min(3, 'Nome deve ter ao menos 3 caracteres'),

  email: z
    .string({ required_error: 'E-mail é obrigatório' })
    .trim()
    .email('E-mail inválido'),

  cpf: z
    .string({ required_error: 'CPF é obrigatório' })
    .regex(CPF_REGEX, 'CPF incompleto ou inválido (xxx.xxx.xxx-xx)'),

  senha: z
    .string({ required_error: 'Senha é obrigatória' })
    .min(6, 'Senha deve ter ao menos 6 caracteres'),

  tipo: z.enum(['coordenador', 'voluntario', 'familiar', 'enfermeiro'], {
    errorMap: () => ({ message: 'Selecione um tipo de usuário' }),
  }),

  sexo: z.enum(['masculino', 'feminino'], {
    errorMap: () => ({ message: 'Selecione o sexo' }),
  }),

  endereco: z
    .string({ required_error: 'Endereço é obrigatório' })
    .trim()
    .min(5, 'Endereço deve ter ao menos 5 caracteres'),

  telefone: z
    .string({ required_error: 'Telefone é obrigatório' })
    .refine((val) => val.replace(/\D/g, '').length >= 10, {
      message: 'Telefone deve ter ao menos 10 dígitos',
    }),
});

export const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  senha: z.string().min(6, 'Senha deve ter ao menos 6 caracteres'),
});

export const updateUserSchema = createUserSchema.partial();
export type CreateUserDTO = z.infer<typeof createUserSchema>;
export type LoginDTO = z.infer<typeof loginSchema>;