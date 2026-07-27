import { ScreenHeader } from '@/components/screen-header';
import { VisitaForm } from '@/components/visitas/visita-form';
import { Adicionar } from '@/constants/adicionar-theme';
import { FormularioColors } from '@/constants/formularios-theme';
import { useVisitas } from '@/contexts/visitas-context';
import { extrairMensagemErro } from '@/services/api-client';
import type { VisitaFormValues } from '@/types/visita';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AdicionarVisitaScreen() {
  const router = useRouter();
  const { adicionarVisita } = useVisitas();
  const [enviando, setEnviando] = useState(false);

  const handleSubmit = async (dados: VisitaFormValues) => {
    setEnviando(true);
    try {
      const visita = await adicionarVisita(dados);
      router.replace({ pathname: '/visitas/[id]', params: { id: visita.id } });
    } catch (e) { 
      Alert.alert('Erro', extrairMensagemErro(e, 'Não foi possível cadastrar a visita.'));
    } finally {
      setEnviando(false);
    }
  };

  return (
    <SafeAreaView style={Adicionar.container} edges={['top']}>
      <ScreenHeader title="Nova Visita" />
      <VisitaForm textoBotao="Registrar" onSubmit={handleSubmit} />
      {enviando && (
        <View style={Adicionar.overlay}>
          <ActivityIndicator color={FormularioColors.primary} size="large" />
        </View>
      )}
    </SafeAreaView>
  );
}
