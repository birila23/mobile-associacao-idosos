import { Styles } from '@/constants/formularios-theme';
import { Text, View } from 'react-native';

export function Campo({
  label,
  obrigatorio,
  invalido,
  style,
  children,
}: {
  label: string;
  obrigatorio?: boolean;
  invalido?: boolean | string | null;
  style?: object;
  children: React.ReactNode;
}) {

  const mensagemErro = typeof invalido === 'string' ? invalido : null;

  return (
    <View style={[Styles.field, style]}>
      <Text style={Styles.label}>
        {label}
        {obrigatorio && <Text style={Styles.asterisco}> *</Text>}
      </Text>
      {children}
      {!!mensagemErro && <Text style={Styles.erroTexto}>{mensagemErro}</Text>}
    </View>
  );
}