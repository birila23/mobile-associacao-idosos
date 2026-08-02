import { Campo } from '@/components/Campo';
import { DateField } from '@/components/date-field';
import { AvatarPhotoPicker } from '@/components/idosos/avatar-photo-picker';
import { FormularioColors, Styles } from '@/constants/formularios-theme';
import { idosoSchema, type IdosoFormValues } from '@/validacao/idosos';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

interface IdosoFormProps {
  valoresIniciais?: Partial<IdosoFormValues>;
  textoBotao: string;
  onSubmit: (dados: IdosoFormValues) => void;
}

function formatarCpf(texto: string): string {
  const numeros = texto.replace(/\D/g, '').slice(0, 11);
  if (numeros.length <= 3) return numeros;
  if (numeros.length <= 6) return numeros.replace(/(\d{3})(\d{1,3})/, '$1.$2');
  if (numeros.length <= 9) return numeros.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
  return numeros.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
}

function formatarRg(texto: string): string {
  const numeros = texto.replace(/\D/g, '').slice(0, 9);

  if (numeros.length <= 3) return numeros;
  if (numeros.length <= 6) return numeros.replace(/^(\d{1,3})(\d{1,3})$/, '$1.$2');
  if (numeros.length === 7) return numeros.replace(/^(\d{1})(\d{3})(\d{3})$/, '$1.$2.$3');
  if (numeros.length === 8) return numeros.replace(/^(\d{2})(\d{3})(\d{3})$/, '$1.$2.$3');

  return numeros.replace(/^(\d{2})(\d{3})(\d{3})(\d{1})$/, '$1.$2.$3-$4');
}

function formatarSus(texto: string): string {
  return texto.replace(/\D/g, '').slice(0, 15);
}

export function IdosoForm({ valoresIniciais, textoBotao, onSubmit }: IdosoFormProps) {
  const [form, setForm] = useState<Partial<IdosoFormValues>>(valoresIniciais ?? {});
  const [erros, setErros] = useState<Record<string, string>>({});

  const setCampo = <K extends keyof IdosoFormValues>(campo: K, valor: IdosoFormValues[K]) => {
    setForm((prev) => ({ ...prev, [campo]: valor }));

    if (erros[campo]) {
      setErros((prev) => ({ ...prev, [campo]: '' }));
    }
  };

  const handleSubmit = () => {
    const result = idosoSchema.safeParse(form);

    if (!result.success) {
      const novosErros: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const campo = issue.path[0] as string;
        if (!novosErros[campo]) {
          novosErros[campo] = issue.message;
        }
      });

      setErros(novosErros);
      return;
    }

    setErros({});
    onSubmit(result.data);
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

          <Campo label="Nome completo" obrigatorio invalido={erros.nome}>
            <TextInput
              style={[Styles.input, !!erros.nome && Styles.inputInvalido]}
              placeholder="Nome completo"
              placeholderTextColor={FormularioColors.placeholder}
              value={form.nome ?? ''}
              onChangeText={(texto) => setCampo('nome', texto)}
            />
          </Campo>

          <View style={Styles.row}>
            <Campo label="Data de nascimento" obrigatorio invalido={erros.dataNascimento} style={Styles.flex1}>
              <DateField
                value={form.dataNascimento}
                onChange={(valor) => setCampo('dataNascimento', valor)}
                invalido={!!erros.dataNascimento}
                maximumDate={new Date()}
              />
            </Campo>

            <Campo label="Sexo" obrigatorio invalido={erros.sexo} style={Styles.flex1}>
              <View style={Styles.segmentedControl}>
                <SegmentButton
                  label="Feminino"
                  selected={form.sexo === 'feminino'}
                  onPress={() => setCampo('sexo', 'feminino')}
                />
                <SegmentButton
                  label="Masculino"
                  selected={form.sexo === 'masculino'}
                  onPress={() => setCampo('sexo', 'masculino')}
                />
              </View>
            </Campo>
          </View>

          <View style={Styles.row}>
            <Campo label="CPF" obrigatorio invalido={erros.cpf} style={Styles.flex1}>
              <TextInput
                style={[Styles.input, !!erros.cpf && Styles.inputInvalido]}
                placeholder="xxx.xxx.xxx-xx"
                placeholderTextColor={FormularioColors.placeholder}
                value={form.cpf ?? ''}
                onChangeText={(texto) => setCampo('cpf', formatarCpf(texto))}
                keyboardType="number-pad"
                maxLength={14}
              />
            </Campo>

            <Campo label="SUS" obrigatorio invalido={erros.sus} style={Styles.flex1}>
              <TextInput
                style={[Styles.input, !!erros.sus && Styles.inputInvalido]}
                placeholder="xxxxxxxxxxxxxxx"
                placeholderTextColor={FormularioColors.placeholder}
                value={form.sus ?? ''}
                onChangeText={(texto) => setCampo('sus', formatarSus(texto))}
                keyboardType="number-pad"
                maxLength={15}
              />
            </Campo>
          </View>

          <Campo label="RG" obrigatorio invalido={erros.rg}>
            <TextInput
              style={[Styles.input, !!erros.rg && Styles.inputInvalido]}
              placeholder="x.xxx.xxx"
              placeholderTextColor={FormularioColors.placeholder}
              value={form.rg ?? ''}
              onChangeText={(texto) => setCampo('rg', formatarRg(texto))}
              keyboardType="number-pad"
              maxLength={12}
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
                value={form.orgaoEmissorRg ?? ''}
                onChangeText={(texto) => setCampo('orgaoEmissorRg', texto)}
              />
            </Campo>
          </View>

          <Campo label="Nacionalidade" obrigatorio invalido={erros.nacionalidade}>
            <TextInput
              style={[Styles.input, !!erros.nacionalidade && Styles.inputInvalido]}
              value={form.nacionalidade ?? ''}
              onChangeText={(texto) => setCampo('nacionalidade', texto)}
            />
          </Campo>

          <Campo label="Naturalidade" obrigatorio invalido={erros.naturalidade}>
            <TextInput
              style={[Styles.input, !!erros.naturalidade && Styles.inputInvalido]}
              value={form.naturalidade ?? ''}
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
}