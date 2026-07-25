import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View, } from 'react-native';

import { Campo } from '@/components/Campo';
import { DateField } from '@/components/date-field';
import { FormularioColors, Styles } from '@/constants/formularios-theme';
import { visitaFormValuesVazio, type VisitaFormValues } from '@/types/visita';

interface VisitaFormProps {
  valoresIniciais?: VisitaFormValues;
  textoBotao: string;
  onSubmit: (dados: VisitaFormValues) => void;
}

const camposObrigatorios: (keyof VisitaFormValues)[] = [
  'nome', 
  'dataVisita',
];

export function VisitaForm({ valoresIniciais, textoBotao, onSubmit }: VisitaFormProps) {
  const [form, setForm] = useState<VisitaFormValues>(valoresIniciais ?? visitaFormValuesVazio);
  const [enviarVazio, setEnviarVazio] = useState(false);

  const setCampo = <K extends keyof VisitaFormValues>(campo: K, valor: VisitaFormValues[K]) => {
    setForm((prev) => ({ ...prev, [campo]: valor }));
  };

  const ehObrigatorio = (campo: keyof VisitaFormValues) => camposObrigatorios.includes(campo);

  const campoInvalido = (campo: keyof VisitaFormValues) =>
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
            <Campo label="Data da Visita" obrigatorio invalido={campoInvalido('dataVisita')} style={Styles.flex1}>
              <DateField
                value={form.dataVisita}
                onChange={(valor) => setCampo('dataVisita', valor)}
                invalido={campoInvalido('dataVisita')}
              />
            </Campo>
          </View>

          <TouchableOpacity style={Styles.submitButton} onPress={handleSubmit} activeOpacity={0.85}>
            <Text style={Styles.submitButtonText}>{textoBotao}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}