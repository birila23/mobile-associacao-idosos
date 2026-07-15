import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { IdosoForm } from '@/components/idosos/idoso-form';
import { ScreenHeader } from '@/components/idosos/screen-header';
import { useIdosos } from '@/contexts/idosos-context';
import { IdososColors } from '@/constants/idosos-theme';
import type { IdosoFormValues } from '@/types/idoso';

export default function EditarIdosoScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getIdoso, buscarIdosoRemoto, atualizarIdoso } = useIdosos();
  const idoso = getIdoso(id);
  const [buscando, setBuscando] = useState(!idoso);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    if (idoso) return;
    setBuscando(true);
    buscarIdosoRemoto(id).finally(() => setBuscando(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleSubmit = async (dados: IdosoFormValues) => {
    setEnviando(true);
    try {
      await atualizarIdoso(id, dados);
      router.replace({ pathname: '/idosos/[id]', params: { id } });
    } catch (e) {
      Alert.alert('Erro', e instanceof Error ? e.message : 'Não foi possível atualizar o idoso.');
    } finally {
      setEnviando(false);
    }
  };

  if (buscando) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScreenHeader title="Editar idoso" />
        <View style={styles.body}>
          <ActivityIndicator color={IdososColors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!idoso) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScreenHeader title="Editar idoso" />
        <View style={styles.body}>
          <Text style={styles.notFoundText}>Idoso não encontrado.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const valoresIniciais: IdosoFormValues = {
    foto: idoso.foto,
    nome: idoso.nome,
    dataNascimento: idoso.dataNascimento,
    sexo: idoso.sexo,
    cpf: idoso.cpf,
    rg: idoso.rg,
    dataEmissaoRg: idoso.dataEmissaoRg,
    orgaoEmissorRg: idoso.orgaoEmissorRg,
    sus: idoso.sus,
    nacionalidade: idoso.nacionalidade,
    naturalidade: idoso.naturalidade,
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScreenHeader title="Editar idoso" />
      <IdosoForm
        valoresIniciais={valoresIniciais}
        textoBotao="Enviar atualização"
        onSubmit={handleSubmit}
      />
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
  body: {
    flex: 1,
    padding: 20,
  },
  notFoundText: {
    color: IdososColors.textSecondary,
    fontSize: 15,
    textAlign: 'center',
    marginTop: 40,
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
