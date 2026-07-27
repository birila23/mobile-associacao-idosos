import { Perfil } from '@/constants/perfil-theme';
import { Text, View } from 'react-native';

export function InfoRow({ label, value }: { label: string; value?: string }) {
  return (
    <View style={Perfil.infoRow}>
      <Text style={Perfil.infoLabel}>{label}</Text>
      <Text style={Perfil.infoValue}>{value?.trim() ? value : '-'}</Text>
    </View>
  );
}