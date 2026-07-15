import { Stack } from 'expo-router';

import { IdososProvider } from '@/contexts/idosos-context';

export default function IdososLayout() {
  return (
    <IdososProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="novo" />
        <Stack.Screen name="[id]/index" />
        <Stack.Screen name="[id]/editar" />
        <Stack.Screen name="[id]/deletar" />
      </Stack>
    </IdososProvider>
  );
}
