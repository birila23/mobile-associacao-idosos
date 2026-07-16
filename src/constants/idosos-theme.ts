/**
 * Design tokens for the "Idosos" (elderly registry) feature screens.
 * Values are taken directly from the Figma reference so every screen
 * in this flow (list, perfil, novo, editar, deletar) stays consistent.
 */
export const IdososColors = {
  background: '#D9D9D9',
  headerBackground: '#FFFFFF',
  card: '#FFFFFF',
  border: '#D8D8D8',
  text: '#000000',
  textSecondary: '#5B5B5B',
  placeholder: '#9A9A9A',

  primary: '#E97BB5', // pink - "Adicionar idoso" / primary actions
  primaryPressed: '#D9639F',

  success: '#3FAE5A', // green - "Enviar formulário" / "Enviar atualização"
  successPressed: '#33903F',

  info: '#3E7BFA', // blue - "Atualizar"
  infoPressed: '#2E63D6',

  danger: '#E23F3F', // red - "Deletar" / "Excluir"
  dangerPressed: '#C22F2F',

  neutralButton: '#EAEAEA',
  neutralButtonText: '#333333',
} as const;

export const IdososRadius = {
  header: 18,
  card: 22,
  input: 12,
  button: 14,
  avatar: 999,
};
