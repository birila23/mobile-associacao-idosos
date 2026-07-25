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
  /** `true`/`false` mostra "Campo obrigatório"; passe uma string para uma mensagem específica. */
  invalido?: boolean | string | null;
  style?: object;
  children: React.ReactNode;
}) {
  const mensagemErro = typeof invalido === 'string' ? invalido : invalido ? 'Campo obrigatório' : null;

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