import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ScreenHeader } from '@/components/screen-header';
import { VisitaForm } from '@/components/visitas/visita-form';
import { Editar } from '@/constants/editar-theme';
import { FormularioColors } from '@/constants/formularios-theme';
import { useVisitas } from '@/contexts/visitas-context';
import { extrairMensagemErro } from '@/services/api-client';
import type { VisitaFormValues } from '@/types/visita';

export default function EditarVisitaScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { listarVisita, buscarVisitaRemoto, atualizarVisita } = useVisitas();
  const [visita, setVisita] = useState(listarVisita(id));
  const [buscando, setBuscando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  

useEffect(() => {
    setBuscando(true);
    buscarVisitaRemoto(id)
      .then(setVisita)
      .finally(() => setBuscando(false));
  }, [id]);

  const handleSubmit = async (dados: VisitaFormValues) => {
    setEnviando(true);
    try {
      await atualizarVisita(id, dados);
      router.replace({ pathname: '/visitas/[id]', params: { id } });
    } catch (e) {
      Alert.alert('Erro', extrairMensagemErro(e, 'Não foi possível atualizar a visita.'));
    } finally {
      setEnviando(false);
    }
  };

  if (buscando) {
    return (
      <SafeAreaView style={Editar.container} edges={['top']}>
        <ScreenHeader title="Editar visita" />
        <View style={Editar.body}>
          <ActivityIndicator color={FormularioColors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!visita) {
    return (
      <SafeAreaView style={Editar.container} edges={['top']}>
        <ScreenHeader title="Editar visita" />
        <View style={Editar.body}>
          <Text style={Editar.notFoundText}>Visita não encontrada.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const valoresIniciais: VisitaFormValues = {
    nome: visita.nome,
    data: visita.data,
  };

  return (
    <SafeAreaView style={Editar.container} edges={['top']}>
      <ScreenHeader title="Editar visita" />
      <VisitaForm
        valoresIniciais={valoresIniciais}
        textoBotao="Enviar atualização"
        onSubmit={handleSubmit}
      />
      {enviando && (
        <View style={Editar.overlay}>
          <ActivityIndicator color={FormularioColors.primary} size="large" />
        </View>
      )}
    </SafeAreaView>
  );
}
