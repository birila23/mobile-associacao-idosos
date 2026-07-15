import type { ChangeEvent } from 'react';

import { IdososColors, IdososRadius } from '@/constants/idosos-theme';

interface DateFieldProps {
  value?: string; // yyyy-mm-dd
  onChange: (valor: string) => void;
  invalido?: boolean;
  maximumDate?: Date;
}

function paraIso(data: Date): string {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const dia = String(data.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
}

/**
 * Na web usamos o `<input type="date">` nativo do navegador em vez do
 * DateTimePicker (que é iOS/Android apenas) — mesmo comportamento de
 * calendário, sem dependência extra.
 */
export function DateField({ value, onChange, invalido, maximumDate }: DateFieldProps) {
  return (
    <input
      type="date"
      value={value ?? ''}
      max={maximumDate ? paraIso(maximumDate) : undefined}
      onChange={(evento: ChangeEvent<HTMLInputElement>) => onChange(evento.target.value)}
      style={{
        width: '100%',
        boxSizing: 'border-box',
        border: `1px solid ${invalido ? IdososColors.danger : IdososColors.border}`,
        borderRadius: IdososRadius.input,
        padding: '11px 14px',
        fontSize: 15,
        color: IdososColors.text,
        backgroundColor: '#FFFFFF',
        fontFamily: 'inherit',
      }}
    />
  );
}
