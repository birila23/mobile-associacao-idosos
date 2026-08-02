import { Campo } from '@/components/Campo';
import { DateField } from '@/components/date-field';
import { FormularioColors, Styles } from '@/constants/formularios-theme';
import { visitaSchema, type VisitaFormValues } from '@/validacao/visitas';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface VisitaFormProps {
  valoresIniciais?: Partial<VisitaFormValues>;
  textoBotao: string;
  onSubmit: (dados: VisitaFormValues) => void;
}

export function VisitaForm({ valoresIniciais, textoBotao, onSubmit }: VisitaFormProps) {
  const [form, setForm] = useState<Partial<VisitaFormValues>>(valoresIniciais ?? {});
  const [erros, setErros] = useState<Record<string, string>>({});

  const setCampo = <K extends keyof VisitaFormValues>(campo: K, valor: VisitaFormValues[K]) => {
    setForm((prev) => ({ ...prev, [campo]: valor }));

    if (erros[campo]) {
      setErros((prev) => ({ ...prev, [campo]: '' }));
    }
  };

  const handleSubmit = () => {
    const result = visitaSchema.safeParse(form);

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
            <Campo label="Data da Visita" obrigatorio invalido={erros.data} style={Styles.flex1}>
              <DateField
                value={form.data}
                onChange={(valor) => setCampo('data', valor)}
                invalido={!!erros.data}
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