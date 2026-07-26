import { FormularioColors, FormularioRadius } from '@/constants/formularios-theme';
import { createShadow } from '@/utils/shadow';
import { StyleSheet } from 'react-native';

export const Deletar = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: FormularioColors.background,
  },
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  dialog: {
    width: '100%',
    backgroundColor: FormularioColors.card,
    borderRadius: FormularioRadius.card,
    padding: 26,
    alignItems: 'center',
    ...createShadow({ offsetY: 6, opacity: 0.15, radius: 14, elevation: 6 }),
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: FormularioColors.danger,
    marginBottom: 10,
  },
  message: {
    fontSize: 14,
    color: FormularioColors.textSecondary,
    textAlign: 'center',
    marginBottom: 22,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  deleteButton: {
    flex: 1,
    backgroundColor: FormularioColors.danger,
    borderRadius: FormularioRadius.button,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: FormularioColors.neutralButton,
    borderRadius: FormularioRadius.button,
    paddingVertical: 13,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: FormularioColors.neutralButtonText,
    fontSize: 15,
    fontWeight: '700',
  },
});