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

export function IdosoForm({ valoresIniciais, textoBotao, onSubmit }: IdosoFormProps) {
  const [form, setForm] = useState<IdosoFormValues>(valoresIniciais ?? idosoFormValuesVazio);
  const [enviarVazio, setEnviarVazio] = useState(false);

  const setCampo = <K extends keyof IdosoFormValues>(campo: K, valor: IdosoFormValues[K]) => {
    setForm((prev) => ({ ...prev, [campo]: valor }));
  };

  const ehObrigatorio = (campo: keyof IdosoFormValues) => camposObrigatorios.includes(campo);

  const campoInvalido = (campo: keyof IdosoFormValues) =>
    enviarVazio && ehObrigatorio(campo) && !form[campo];

  const handleSubmit = () => {
    setEnviarVazio(true);
    const camposFaltando = camposObrigatorios.filter((campo) => !form[campo]);
    if (camposFaltando.length > 0) {
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

          <Campo label="Nome completo" obrigatorio invalido={campoInvalido('nome')}>
            <TextInput
              style={[Styles.input, campoInvalido('nome') && Styles.inputInvalido]}
              placeholder="Nome completo"
              placeholderTextColor={FormularioColors.placeholder}
              value={form.nome}
              onChangeText={(texto) => setCampo('nome', texto)}
            />
          </Campo>

          <View style={Styles.row}>
            <Campo label="Data de nascimento" obrigatorio invalido={campoInvalido('dataNascimento')} style={Styles.flex1}>
              <DateField
                value={form.dataNascimento}
                onChange={(valor) => setCampo('dataNascimento', valor)}
                invalido={campoInvalido('dataNascimento')}
                maximumDate={new Date()}
              />
            </Campo>

            <Campo label="Sexo" obrigatorio invalido={campoInvalido('sexo')} style={Styles.flex1}>
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
            <Campo label="CPF" obrigatorio invalido={campoInvalido('cpf')} style={Styles.flex1}>
              <TextInput
                style={[Styles.input, campoInvalido('cpf') && Styles.inputInvalido]}
                placeholder="xxx.xxx.xxx-xx"
                placeholderTextColor={FormularioColors.placeholder}
                value={form.cpf}
                onChangeText={(texto) => setCampo('cpf', texto)}
                keyboardType="numbers-and-punctuation"
              />
            </Campo>

            <Campo label="SUS" obrigatorio invalido={campoInvalido('sus')} style={Styles.flex1}>
              <TextInput
                style={[Styles.input, campoInvalido('sus') && Styles.inputInvalido]}
                placeholder="xxxxxxxxxxxxxxx"
                placeholderTextColor={FormularioColors.placeholder}
                value={form.sus}
                onChangeText={(texto) => setCampo('sus', texto)}
                keyboardType="number-pad"
              />
            </Campo>
          </View>

          <Campo label="RG" obrigatorio invalido={campoInvalido('rg')}>
            <TextInput
              style={[Styles.input, campoInvalido('rg') && Styles.inputInvalido]}
              placeholder="x.xxx.xxx"
              placeholderTextColor={FormularioColors.placeholder}
              value={form.rg}
              onChangeText={(texto) => setCampo('rg', texto)}
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

          <Campo label="Nacionalidade" obrigatorio invalido={campoInvalido('nacionalidade')}>
            <TextInput
              style={[Styles.input, campoInvalido('nacionalidade') && Styles.inputInvalido]}
              value={form.nacionalidade}
              onChangeText={(texto) => setCampo('nacionalidade', texto)}
            />
          </Campo>

          <Campo label="Naturalidade" obrigatorio invalido={campoInvalido('naturalidade')}>
            <TextInput
              style={[Styles.input, campoInvalido('naturalidade') && Styles.inputInvalido]}
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

