import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { IdosoForm } from '@/components/idosos/idoso-form';
import { ScreenHeader } from '@/components/idosos/screen-header';
import { useIdosos } from '@/contexts/idosos-context';
import { IdososColors } from '@/constants/idosos-theme';
import type { IdosoFormValues } from '@/types/idoso';

export default function NovoIdosoScreen() {
  const router = useRouter();
  const { adicionarIdoso } = useIdosos();
  const [enviando, setEnviando] = useState(false);

  const handleSubmit = async (dados: IdosoFormValues) => {
    setEnviando(true);
    try {
      const idoso = await adicionarIdoso(dados);
      router.replace({ pathname: '/idosos/[id]', params: { id: idoso.id } });
    } catch (e) {
      Alert.alert('Erro', e instanceof Error ? e.message : 'Não foi possível cadastrar o idoso.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScreenHeader title="Novo Idoso" />
      <IdosoForm textoBotao="Enviar formulário" onSubmit={handleSubmit} />
      {enviando && (
        <View style={styles.overlay}>
          <ActivityIndicator color={IdososColors.primary} size="large" />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: IdososColors.background,
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
