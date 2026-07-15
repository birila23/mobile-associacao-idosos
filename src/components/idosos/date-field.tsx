import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { IdososColors, IdososRadius } from '@/constants/idosos-theme';

interface DateFieldProps {
  value?: string; // yyyy-mm-dd
  onChange: (valor: string) => void;
  placeholder?: string;
  invalido?: boolean;
  maximumDate?: Date;
}

function paraData(valor?: string): Date {
  if (!valor) return new Date();
  const [ano, mes, dia] = valor.split('-').map(Number);
  if (!ano || !mes || !dia) return new Date();
  return new Date(ano, mes - 1, dia);
}

function paraIso(data: Date): string {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const dia = String(data.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
}

function formatarExibicao(valor?: string): string | null {
  if (!valor) return null;
  const [ano, mes, dia] = valor.split('-');
  if (!ano || !mes || !dia) return valor;
  return `${dia}/${mes}/${ano}`;
}

/**
 * Campo de data nativo (iOS/Android). Abre o seletor do sistema; no iOS o
 * "spinner" fica exposto inline (não dispara `dismissed`), por isso mostramos
 * um botão "Concluído" para fechar.
 */
export function DateField({ value, onChange, placeholder = 'Selecionar data', invalido, maximumDate }: DateFieldProps) {
  const [aberto, setAberto] = useState(false);
  const exibicao = formatarExibicao(value);

  const handleChange = (evento: { type: string }, dataSelecionada?: Date) => {
    if (Platform.OS === 'android') setAberto(false);
    if (evento.type === 'dismissed') return;
    if (dataSelecionada) onChange(paraIso(dataSelecionada));
  };

  return (
    <View>
      <TouchableOpacity
        style={[styles.input, invalido && styles.inputInvalido]}
        activeOpacity={0.7}
        onPress={() => setAberto(true)}
      >
        <Text style={exibicao ? styles.valor : styles.placeholder}>{exibicao ?? placeholder}</Text>
      </TouchableOpacity>

      {aberto && (
        <View style={styles.pickerWrapper}>
          <DateTimePicker
            value={paraData(value)}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            maximumDate={maximumDate}
            onChange={handleChange}
          />
          {Platform.OS === 'ios' && (
            <TouchableOpacity style={styles.concluirButton} onPress={() => setAberto(false)} activeOpacity={0.85}>
              <Text style={styles.concluirButtonText}>Concluído</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: IdososColors.border,
    borderRadius: IdososRadius.input,
    paddingHorizontal: 14,
    paddingVertical: 11,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
  },
  inputInvalido: {
    borderColor: IdososColors.danger,
  },
  valor: {
    fontSize: 15,
    color: IdososColors.text,
  },
  placeholder: {
    fontSize: 15,
    color: IdososColors.placeholder,
  },
  pickerWrapper: {
    marginTop: 6,
  },
  concluirButton: {
    alignSelf: 'flex-end',
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  concluirButtonText: {
    color: IdososColors.primary,
    fontWeight: '700',
    fontSize: 14,
  },
});
