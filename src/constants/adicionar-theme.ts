import { FormularioColors } from '@/constants/formularios-theme';
import { StyleSheet } from 'react-native';

export const Adicionar = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: FormularioColors.background,
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});