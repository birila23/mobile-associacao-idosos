import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ScreenHeader } from '@/components/screen-header';
import { Deletar } from '@/constants/deletar-theme';
import { useVisitas } from '@/contexts/visitas-context';
import { extrairMensagemErro } from '@/services/api-client';

export default function DeletarIdosoScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { listarVisita, removerVisita } = useVisitas();
  const visita = listarVisita(id);
  const [excluindo, setExcluindo] = useState(false);

  const handleCancelar = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/visitas');
    }
  };

  const handleDeletar = async () => {
    setExcluindo(true);
    try {
      await removerVisita(id);
      router.replace('/visitas');
    } catch (e) {
      Alert.alert('Erro', extrairMensagemErro(e, 'Não foi possível excluir a visita.'));
      setExcluindo(false);
    }
  };

  return (
    <SafeAreaView style={Deletar.container} edges={['top']}>
      <ScreenHeader title="Deletar visita" />

      <View style={Deletar.overlay}>
        <View style={Deletar.dialog}>
          <Text style={Deletar.title}>Confirmar exclusão</Text>
          <Text style={Deletar.message}>
            Tem certeza que deseja excluir a visita de {visita ? visita.nome : 'esta visita'}?
          </Text>

          <View style={Deletar.actionsRow}>
            <TouchableOpacity
              style={Deletar.deleteButton}
              activeOpacity={0.85}
              onPress={handleDeletar}
              disabled={excluindo}
            >
              {excluindo ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={Deletar.deleteButtonText}>Deletar</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={Deletar.cancelButton}
              activeOpacity={0.85}
              onPress={handleCancelar}
              disabled={excluindo}
            >
              <Text style={Deletar.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
