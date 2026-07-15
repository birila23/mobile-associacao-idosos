import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { AvatarPhotoPicker } from '@/components/idosos/avatar-photo-picker';
import { createShadow } from '@/utils/shadow';
import { idosoFormValuesVazio, type IdosoFormValues, type Sexo } from '@/types/idoso';
import { IdososColors, IdososRadius } from '@/constants/idosos-theme';

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

  const campoInvalido = (campo: keyof IdosoFormValues) =>
    enviarVazio && camposObrigatorios.includes(campo) && !form[campo];

  const handleSubmit = () => {
    setEnviarVazio(true);
    const faltaCampo = camposObrigatorios.some((campo) => !form[campo]);
    if (faltaCampo) {
      return;
    }
    onSubmit(form);
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>I - DADOS PESSOAIS</Text>

          <AvatarPhotoPicker
            uri={form.foto}
            editable
            onChangeUri={(uri) => setCampo('foto', uri)}
          />

          <Campo label="Nome completo" invalido={campoInvalido('nome')}>
            <TextInput
              style={[styles.input, campoInvalido('nome') && styles.inputInvalido]}
              placeholder="Nome completo"
              placeholderTextColor={IdososColors.placeholder}
              value={form.nome}
              onChangeText={(texto) => setCampo('nome', texto)}
            />
          </Campo>

          <View style={styles.row}>
            <Campo label="Data de nascimento" invalido={campoInvalido('dataNascimento')} style={styles.flex1}>
              <TextInput
                style={[styles.input, campoInvalido('dataNascimento') && styles.inputInvalido]}
                placeholder="AAAA-MM-DD"
                placeholderTextColor={IdososColors.placeholder}
                value={form.dataNascimento}
                onChangeText={(texto) => setCampo('dataNascimento', texto)}
                keyboardType="numbers-and-punctuation"
              />
            </Campo>

            <Campo label="Sexo" invalido={campoInvalido('sexo')} style={styles.flex1}>
              <View style={styles.segmentedControl}>
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

          <View style={styles.row}>
            <Campo label="CPF" invalido={campoInvalido('cpf')} style={styles.flex1}>
              <TextInput
                style={[styles.input, campoInvalido('cpf') && styles.inputInvalido]}
                placeholder="xxx.xxx.xxx-xx"
                placeholderTextColor={IdososColors.placeholder}
                value={form.cpf}
                onChangeText={(texto) => setCampo('cpf', texto)}
                keyboardType="numbers-and-punctuation"
              />
            </Campo>

            <Campo label="SUS" invalido={campoInvalido('sus')} style={styles.flex1}>
              <TextInput
                style={[styles.input, campoInvalido('sus') && styles.inputInvalido]}
                placeholder="xxxxxxxxxxxxxxx"
                placeholderTextColor={IdososColors.placeholder}
                value={form.sus}
                onChangeText={(texto) => setCampo('sus', texto)}
                keyboardType="number-pad"
              />
            </Campo>
          </View>

          <Campo label="RG" invalido={campoInvalido('rg')}>
            <TextInput
              style={[styles.input, campoInvalido('rg') && styles.inputInvalido]}
              placeholder="x.xxx.xxx"
              placeholderTextColor={IdososColors.placeholder}
              value={form.rg}
              onChangeText={(texto) => setCampo('rg', texto)}
            />
          </Campo>

          <View style={styles.row}>
            <Campo label="Data de emissão" style={styles.flex1}>
              <TextInput
                style={styles.input}
                placeholder="AAAA-MM-DD"
                placeholderTextColor={IdososColors.placeholder}
                value={form.dataEmissaoRg}
                onChangeText={(texto) => setCampo('dataEmissaoRg', texto)}
              />
            </Campo>

            <Campo label="Órgão emissor" style={styles.flex1}>
              <TextInput
                style={styles.input}
                placeholder="Exemplo: SSP-PB"
                placeholderTextColor={IdososColors.placeholder}
                value={form.orgaoEmissorRg}
                onChangeText={(texto) => setCampo('orgaoEmissorRg', texto)}
              />
            </Campo>
          </View>

          <Campo label="Nacionalidade" invalido={campoInvalido('nacionalidade')}>
            <TextInput
              style={[styles.input, campoInvalido('nacionalidade') && styles.inputInvalido]}
              value={form.nacionalidade}
              onChangeText={(texto) => setCampo('nacionalidade', texto)}
            />
          </Campo>

          <Campo label="Naturalidade" invalido={campoInvalido('naturalidade')}>
            <TextInput
              style={[styles.input, campoInvalido('naturalidade') && styles.inputInvalido]}
              value={form.naturalidade}
              onChangeText={(texto) => setCampo('naturalidade', texto)}
            />
          </Campo>

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} activeOpacity={0.85}>
            <Text style={styles.submitButtonText}>{textoBotao}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Campo({
  label,
  invalido,
  style,
  children,
}: {
  label: string;
  invalido?: boolean;
  style?: object;
  children: React.ReactNode;
}) {
  return (
    <View style={[styles.field, style]}>
      <Text style={styles.label}>{label}</Text>
      {children}
      {invalido && <Text style={styles.erroTexto}>Campo obrigatório</Text>}
    </View>
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
      style={[styles.segmentButton, selected && styles.segmentButtonSelected]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <Text style={[styles.segmentButtonText, selected && styles.segmentButtonTextSelected]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: IdososColors.card,
    borderRadius: IdososRadius.card,
    padding: 22,
    ...createShadow({ offsetY: 4, opacity: 0.08, radius: 10, elevation: 3 }),
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: IdososColors.text,
    marginBottom: 18,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  flex1: {
    flex: 1,
  },
  field: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: IdososColors.text,
    marginBottom: 6,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: IdososColors.border,
    borderRadius: IdososRadius.input,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 15,
    color: IdososColors.text,
    backgroundColor: '#FFFFFF',
  },
  inputInvalido: {
    borderColor: IdososColors.danger,
  },
  erroTexto: {
    color: IdososColors.danger,
    fontSize: 12,
    marginTop: 4,
  },
  segmentedControl: {
    flexDirection: 'row',
    gap: 8,
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: IdososRadius.input,
    borderWidth: 1,
    borderColor: IdososColors.border,
    alignItems: 'center',
  },
  segmentButtonSelected: {
    backgroundColor: IdososColors.primary,
    borderColor: IdososColors.primary,
  },
  segmentButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: IdososColors.textSecondary,
  },
  segmentButtonTextSelected: {
    color: '#FFFFFF',
  },
  submitButton: {
    backgroundColor: IdososColors.success,
    borderRadius: IdososRadius.button,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
