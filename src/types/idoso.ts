export type Sexo = 'feminino' | 'masculino';

/**
 * Dados pessoais do idoso (seção "I - DADOS PESSOAIS" do PIA).
 * Reflete os campos usados no formulário web (FormularioIdoso) que
 * serviu de referência para as telas mobile.
 */
export interface Idoso {
  id: string;
  foto?: string; // uri local ou remota da foto do idoso

  nome: string;
  dataNascimento: string; // yyyy-mm-dd
  sexo: Sexo | '';

  cpf: string;
  rg: string;
  dataEmissaoRg?: string;
  orgaoEmissorRg?: string;
  sus: string;

  nacionalidade: string;
  naturalidade: string;
}

export type IdosoFormValues = Omit<Idoso, 'id'>;

export const idosoFormValuesVazio: IdosoFormValues = {
  foto: undefined,
  nome: '',
  dataNascimento: '',
  sexo: '',
  cpf: '',
  rg: '',
  dataEmissaoRg: '',
  orgaoEmissorRg: '',
  sus: '',
  nacionalidade: '',
  naturalidade: '',
};
