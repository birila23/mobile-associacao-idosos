import { Redirect, Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

import { IdososProvider } from '@/contexts/idosos-context';
import { obterToken } from '@/services/token-storage';
import { IdososColors } from '@/constants/idosos-theme';

export default function IdososLayout() {
  const [status, setStatus] = useState<'carregando' | 'autenticado' | 'sem-token'>('carregando');

  useEffect(() => {
    obterToken().then((token) => setStatus(token ? 'autenticado' : 'sem-token'));
  }, []);

  if (status === 'carregando') {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: IdososColors.background }}>
        <ActivityIndicator color={IdososColors.primary} />
      </View>
    );
  }

  if (status === 'sem-token') {
    return <Redirect href="/" />;
  }

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
