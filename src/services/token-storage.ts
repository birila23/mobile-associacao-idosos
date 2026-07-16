import { Platform } from 'react-native';

const CHAVE_TOKEN = 'associacao-idosos.token';

export async function salvarToken(token: string): Promise<void> {
  if (Platform.OS === 'web') {
    if (typeof localStorage !== 'undefined') localStorage.setItem(CHAVE_TOKEN, token);
    return;
  }
  const SecureStore = await import('expo-secure-store');
  await SecureStore.setItemAsync(CHAVE_TOKEN, token);
}

export async function obterToken(): Promise<string | null> {
  if (Platform.OS === 'web') {
    return typeof localStorage !== 'undefined' ? localStorage.getItem(CHAVE_TOKEN) : null;
  }
  const SecureStore = await import('expo-secure-store');
  return SecureStore.getItemAsync(CHAVE_TOKEN);
}

export async function removerToken(): Promise<void> {
  if (Platform.OS === 'web') {
    if (typeof localStorage !== 'undefined') localStorage.removeItem(CHAVE_TOKEN);
    return;
  }
  const SecureStore = await import('expo-secure-store');
  await SecureStore.deleteItemAsync(CHAVE_TOKEN);
}
