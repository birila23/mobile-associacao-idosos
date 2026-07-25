import { StyleSheet } from 'react-native';

export const FormularioColors = {
  background: '#D9D9D9',
  headerBackground: '#FFFFFF',
  card: '#FFFFFF',
  border: '#D8D8D8',
  text: '#000000',
  textSecondary: '#5B5B5B',
  placeholder: '#9A9A9A',

  primary: '#E97BB5', 
  primaryPressed: '#D9639F',

  success: '#3FAE5A', 
  successPressed: '#33903F',

  info: '#3E7BFA',
  infoPressed: '#2E63D6',

  danger: '#E23F3F', 
  dangerPressed: '#C22F2F',

  neutralButton: '#EAEAEA',
  neutralButtonText: '#333333',
} as const;

export const FormularioRadius = {
  header: 18,
  card: 22,
  input: 12,
  button: 14,
  avatar: 999,
};

export const Styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: FormularioColors.card,
    borderRadius: FormularioRadius.card,
    padding: 22,
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.08)',
    elevation: 3, 
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: FormularioColors.text,
    marginBottom: 18,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  flex1: {
    flex: 1,
  },
  field: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: FormularioColors.text,
    marginBottom: 6,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: FormularioColors.border,
    borderRadius: FormularioRadius.input,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 15,
    color: FormularioColors.text,
    backgroundColor: '#FFFFFF',
  },
  inputInvalido: {
    borderColor: FormularioColors.danger,
  },
  erroTexto: {
    color: FormularioColors.danger,
    fontSize: 12,
    marginTop: 4,
  },
  asterisco: {
    color: FormularioColors.danger,
  },
  segmentedControl: {
    flexDirection: 'row',
    gap: 8,
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: FormularioRadius.input,
    borderWidth: 1,
    borderColor: FormularioColors.border,
    alignItems: 'center',
  },
  segmentButtonSelected: {
    backgroundColor: FormularioColors.primary,
    borderColor: FormularioColors.primary,
  },
  segmentButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: FormularioColors.textSecondary,
  },
  segmentButtonTextSelected: {
    color: '#FFFFFF',
  },
  submitButton: {
    backgroundColor: FormularioColors.success,
    borderRadius: FormularioRadius.button,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
