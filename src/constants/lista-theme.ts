import { FormularioColors, FormularioRadius } from '@/constants/formularios-theme';
import { StyleSheet } from 'react-native';

export const Lista  = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: FormularioColors.background,
  },
  body: {
    flex: 1,
    padding: 20,
  },
  addButton: {
    backgroundColor: FormularioColors.primary,
    borderRadius: FormularioRadius.button,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 20,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  emptyCard: {
    flex: 1,
    backgroundColor: FormularioColors.card,
    borderRadius: FormularioRadius.card,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    color: FormularioColors.textSecondary,
    fontSize: 15,
  },
  errorText: {
    color: FormularioColors.danger,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 14,
    paddingHorizontal: 20,
  },
  retryButton: {
    backgroundColor: FormularioColors.neutralButton,
    borderRadius: FormularioRadius.button,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  retryButtonText: {
    color: FormularioColors.neutralButtonText,
    fontSize: 14,
    fontWeight: '700',
  },
  listCard: {
    backgroundColor: FormularioColors.card,
    borderRadius: FormularioRadius.card,
  },
  listContent: {
    padding: 10,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: FormularioColors.border,
  },
  listItemName: {
    fontSize: 15,
    fontWeight: '600',
    color: FormularioColors.text,
  },
});