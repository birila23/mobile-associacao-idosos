import { Redirect, Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

import { FormularioColors } from '@/constants/formularios-theme';
import { VisitasProvider } from '@/contexts/visitas-context';
import { obterToken } from '@/services/token-storage';

export default function VisitasLayout() {
  const [status, setStatus] = useState<'carregando' | 'autenticado' | 'sem-token'>('carregando');

  useEffect(() => {
    obterToken().then((token) => setStatus(token ? 'autenticado' : 'sem-token'));
  }, []);

  if (status === 'carregando') {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: FormularioColors.background }}>
        <ActivityIndicator color={FormularioColors.primary} />
      </View>
    );
  }

  if (status === 'sem-token') {
    return <Redirect href="/" />;
  }

  return (
    <VisitasProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="adicionar" />
        <Stack.Screen name="[id]/index" />
        <Stack.Screen name="[id]/editar" />
        <Stack.Screen name="[id]/deletar" />
      </Stack>
    </VisitasProvider>
  );
}
