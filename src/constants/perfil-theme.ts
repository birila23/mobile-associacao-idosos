import { FormularioColors, FormularioRadius } from '@/constants/formularios-theme';
import { createShadow } from '@/utils/shadow';
import { StyleSheet } from 'react-native';

export const Perfil = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: FormularioColors.background,
  },
  body: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 40,
  },
  notFoundText: {
    color: FormularioColors.textSecondary,
    fontSize: 15,
    textAlign: 'center',
    marginTop: 40,
  },
  card: {
    backgroundColor: FormularioColors.card,
    borderRadius: FormularioRadius.card,
    padding: 22,
    ...createShadow({ offsetY: 4, opacity: 0.08, radius: 10, elevation: 3 }),
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  nome: {
    fontSize: 20,
    fontWeight: '800',
    color: FormularioColors.text,
    marginTop: 12,
  },
  infoRow: {
    borderBottomWidth: 1,
    borderBottomColor: FormularioColors.border,
    paddingVertical: 10,
  },
  infoLabel: {
    fontSize: 12,
    color: FormularioColors.textSecondary,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 15,
    color: FormularioColors.text,
    fontWeight: '600',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 22,
  },
  updateButton: {
    flex: 1,
    backgroundColor: FormularioColors.info,
    borderRadius: FormularioRadius.button,
    paddingVertical: 14,
    alignItems: 'center',
  },
  deleteButton: {
    flex: 1,
    backgroundColor: FormularioColors.danger,
    borderRadius: FormularioRadius.button,
    paddingVertical: 14,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});