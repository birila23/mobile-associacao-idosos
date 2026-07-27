import { FormularioColors } from '@/constants/formularios-theme';
import { StyleSheet } from 'react-native';

export const Editar = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: FormularioColors.background,
  },
  body: {
    flex: 1,
    padding: 20,
  },
  notFoundText: {
    color: FormularioColors.textSecondary,
    fontSize: 15,
    textAlign: 'center',
    marginTop: 40,
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});