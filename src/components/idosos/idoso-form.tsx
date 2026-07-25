import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View, } from 'react-native';

import { Campo } from '@/components/Campo';
import { DateField } from '@/components/date-field';
import { AvatarPhotoPicker } from '@/components/idosos/avatar-photo-picker';
import { FormularioColors, Styles } from '@/constants/formularios-theme';
import { idosoFormValuesVazio, type IdosoFormValues, type Sexo } from '@/types/idoso';


interface IdosoFormProps {
  valoresIniciais?: IdosoFormValues;
  textoBotao: string;
  onSubmit: (dados: IdosoFormValues) => void;
}

const camposObrigatorios: (keyof IdosoFormValues)[] = [
  'nome',
  'dataNascimento',
  'sexo',
  'cpf',
  'sus',
  'rg',
  'nacionalidade',
  'naturalidade',
];

// Formatos exigidos pelo backend (idosoValidations.ts): CPF com 11 dígitos,
// RG com 7 e cartão SUS com 15.
const CPF_REGEX = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
const RG_REGEX = /^\d{1}\.\d{3}\.\d{3}$/;
const SUS_REGEX = /^\d{15}$/;

function formatarCpf(texto: string): string {
  const numeros = texto.replace(/\D/g, '').slice(0, 11);
  if (numeros.length <= 3) return numeros;
  if (numeros.length <= 6) return numeros.replace(/(\d{3})(\d{1,3})/, '$1.$2');
  if (numeros.length <= 9) return numeros.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
  return numeros.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
}

function formatarRg(texto: string): string {
  const numeros = texto.replace(/\D/g, '').slice(0, 7);
  if (numeros.length <= 1) return numeros;
  if (numeros.length <= 4) return numeros.replace(/(\d{1})(\d{1,3})/, '$1.$2');
  return numeros.replace(/(\d{1})(\d{3})(\d{1,3})/, '$1.$2.$3');
}

function formatarSus(texto: string): string {
  return texto.replace(/\D/g, '').slice(0, 15);
}

export function IdosoForm({ valoresIniciais, textoBotao, onSubmit }: IdosoFormProps) {
  const [form, setForm] = useState<IdosoFormValues>(valoresIniciais ?? idosoFormValuesVazio);
  const [enviarVazio, setEnviarVazio] = useState(false);

  const setCampo = <K extends keyof IdosoFormValues>(campo: K, valor: IdosoFormValues[K]) => {
    setForm((prev) => ({ ...prev, [campo]: valor }));
  };

  const ehObrigatorio = (campo: keyof IdosoFormValues) => camposObrigatorios.includes(campo);

  const erroDoCampo = (campo: keyof IdosoFormValues): string | null => {
    const valorBruto = form[campo];
    const valor = typeof valorBruto === 'string' ? valorBruto : '';

    if (ehObrigatorio(campo) && !valor) return 'Campo obrigatório';
    if (!valor) return null;

    switch (campo) {
      case 'nome':
        return valor.trim().length < 3 ? 'Nome deve ter pelo menos 3 caracteres' : null;
      case 'cpf':
        return CPF_REGEX.test(valor) ? null : 'CPF precisa ter 11 dígitos (xxx.xxx.xxx-xx)';
      case 'rg':
        return RG_REGEX.test(valor) ? null : 'RG precisa ter 7 dígitos (x.xxx.xxx)';
      case 'sus':
        return SUS_REGEX.test(valor) ? null : `Cartão SUS precisa ter 15 dígitos (${valor.length}/15)`;
      case 'nacionalidade':
        return valor.trim().length < 3 ? 'Nacionalidade deve ter pelo menos 3 caracteres' : null;
      case 'naturalidade':
        return valor.trim().length < 3 ? 'Naturalidade deve ter pelo menos 3 caracteres' : null;
      default:
        return null;
    }
  };

  const erroExibido = (campo: keyof IdosoFormValues) => (enviarVazio ? erroDoCampo(campo) : null);

  const handleSubmit = () => {
    setEnviarVazio(true);
    const todosCampos = Object.keys(idosoFormValuesVazio) as (keyof IdosoFormValues)[];
    const camposComErro = todosCampos.filter((campo) => !!erroDoCampo(campo));
    if (camposComErro.length > 0) {
      return;
    }
    onSubmit(form);
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={Styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <View style={Styles.card}>
          <Text style={Styles.sectionTitle}>I - DADOS PESSOAIS</Text>

          <AvatarPhotoPicker
            uri={form.foto}
            editable
            onChangeUri={(uri) => setCampo('foto', uri)}
          />

          <Campo label="Nome completo" obrigatorio invalido={erroExibido('nome')}>
            <TextInput
              style={[Styles.input, !!erroExibido('nome') && Styles.inputInvalido]}
              placeholder="Nome completo"
              placeholderTextColor={FormularioColors.placeholder}
              value={form.nome}
              onChangeText={(texto) => setCampo('nome', texto)}
            />
          </Campo>

          <View style={Styles.row}>
            <Campo label="Data de nascimento" obrigatorio invalido={erroExibido('dataNascimento')} style={Styles.flex1}>
              <DateField
                value={form.dataNascimento}
                onChange={(valor) => setCampo('dataNascimento', valor)}
                invalido={!!erroExibido('dataNascimento')}
                maximumDate={new Date()}
              />
            </Campo>

            <Campo label="Sexo" obrigatorio invalido={erroExibido('sexo')} style={Styles.flex1}>
              <View style={Styles.segmentedControl}>
                <SegmentButton
                  label="Feminino"
                  selected={form.sexo === 'feminino'}
                  onPress={() => setCampo('sexo', 'feminino' as Sexo)}
                />
                <SegmentButton
                  label="Masculino"
                  selected={form.sexo === 'masculino'}
                  onPress={() => setCampo('sexo', 'masculino' as Sexo)}
                />
              </View>
            </Campo>
          </View>

          <View style={Styles.row}>
            <Campo label="CPF" obrigatorio invalido={erroExibido('cpf')} style={Styles.flex1}>
              <TextInput
                style={[Styles.input, !!erroExibido('cpf') && Styles.inputInvalido]}
                placeholder="xxx.xxx.xxx-xx"
                placeholderTextColor={FormularioColors.placeholder}
                value={form.cpf}
                onChangeText={(texto) => setCampo('cpf', formatarCpf(texto))}
                keyboardType="number-pad"
                maxLength={14}
              />
            </Campo>

            <Campo label="SUS" obrigatorio invalido={erroExibido('sus')} style={Styles.flex1}>
              <TextInput
                style={[Styles.input, !!erroExibido('sus') && Styles.inputInvalido]}
                placeholder="xxxxxxxxxxxxxxx"
                placeholderTextColor={FormularioColors.placeholder}
                value={form.sus}
                onChangeText={(texto) => setCampo('sus', formatarSus(texto))}
                keyboardType="number-pad"
                maxLength={15}
              />
            </Campo>
          </View>

          <Campo label="RG" obrigatorio invalido={erroExibido('rg')}>
            <TextInput
              style={[Styles.input, !!erroExibido('rg') && Styles.inputInvalido]}
              placeholder="x.xxx.xxx"
              placeholderTextColor={FormularioColors.placeholder}
              value={form.rg}
              onChangeText={(texto) => setCampo('rg', formatarRg(texto))}
              keyboardType="number-pad"
              maxLength={9}
            />
          </Campo>

          <View style={Styles.row}>
            <Campo label="Data de emissão" style={Styles.flex1}>
              <DateField
                value={form.dataEmissaoRg}
                onChange={(valor) => setCampo('dataEmissaoRg', valor)}
                maximumDate={new Date()}
              />
            </Campo>

            <Campo label="Órgão emissor" style={Styles.flex1}>
              <TextInput
                style={Styles.input}
                placeholder="Exemplo: SSP-PB"
                placeholderTextColor={FormularioColors.placeholder}
                value={form.orgaoEmissorRg}
                onChangeText={(texto) => setCampo('orgaoEmissorRg', texto)}
              />
            </Campo>
          </View>

          <Campo label="Nacionalidade" obrigatorio invalido={erroExibido('nacionalidade')}>
            <TextInput
              style={[Styles.input, !!erroExibido('nacionalidade') && Styles.inputInvalido]}
              value={form.nacionalidade}
              onChangeText={(texto) => setCampo('nacionalidade', texto)}
            />
          </Campo>

          <Campo label="Naturalidade" obrigatorio invalido={erroExibido('naturalidade')}>
            <TextInput
              style={[Styles.input, !!erroExibido('naturalidade') && Styles.inputInvalido]}
              value={form.naturalidade}
              onChangeText={(texto) => setCampo('naturalidade', texto)}
            />
          </Campo>

          <TouchableOpacity style={Styles.submitButton} onPress={handleSubmit} activeOpacity={0.85}>
            <Text style={Styles.submitButtonText}>{textoBotao}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function SegmentButton({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[Styles.segmentButton, selected && Styles.segmentButtonSelected]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <Text style={[Styles.segmentButtonText, selected && Styles.segmentButtonTextSelected]}>{label}</Text>
    </TouchableOpacity>
  );
};
