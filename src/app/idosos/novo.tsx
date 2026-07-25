import { IdosoForm } from '@/components/idosos/idoso-form';
import { ScreenHeader } from '@/components/screen-header';
import { Adicionar } from '@/constants/adicionar-theme';
import { FormularioColors } from '@/constants/formularios-theme';
import { useIdosos } from '@/contexts/idosos-context';
import { extrairMensagemErro } from '@/services/api-client';
import type { IdosoFormValues } from '@/types/idoso';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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
      Alert.alert('Erro', extrairMensagemErro(e, 'Não foi possível cadastrar o idoso.'));
    } finally {
      setEnviando(false);
    }
  };

  return (
    <SafeAreaView style={Adicionar.container} edges={['top']}>
      <ScreenHeader title="Novo Idoso" />
      <IdosoForm textoBotao="Enviar formulário" onSubmit={handleSubmit} />
      {enviando && (
        <View style={Adicionar.overlay}>
          <ActivityIndicator color={FormularioColors.primary} size="large" />
        </View>
      )}
    </SafeAreaView>
  );
}
