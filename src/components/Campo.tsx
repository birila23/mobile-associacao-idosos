import { Styles } from '@/constants/formularios-theme';
import { Text, View, } from 'react-native';

export function Campo({
  label,
  obrigatorio,
  invalido,
  style,
  children,
}: {
  label: string;
  obrigatorio?: boolean;
  invalido?: boolean;
  style?: object;
  children: React.ReactNode;
}) {
  return (
    <View style={[Styles.field, style]}>
      <Text style={Styles.label}>
        {label}
        {obrigatorio && <Text style={Styles.asterisco}> *</Text>}
      </Text>
      {children}
      {invalido && <Text style={Styles.erroTexto}>Campo obrigatório</Text>}
    </View>
  );
}