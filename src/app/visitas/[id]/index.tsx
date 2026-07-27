import { InfoRow } from '@/components/info-row';
import { ScreenHeader } from '@/components/screen-header';
import { FormularioColors } from '@/constants/formularios-theme';
import { Perfil } from '@/constants/perfil-theme';
import { useVisitas } from '@/contexts/visitas-context';
import { extrairMensagemErro } from '@/services/api-client';
import { formatarDataExibicao } from '@/utils/date';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PerfilVisitaScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { listarVisita, buscarVisitaRemoto } = useVisitas();
  const visitaDaLista = listarVisita(id);
  const [visita, setVisita] = useState(visitaDaLista);
  const [buscando, setBuscando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    setBuscando(true);
    buscarVisitaRemoto(id)
      .then((visitaCompleta) => {
        setVisita(visitaCompleta);
      })
      .catch((e) => setErro(extrairMensagemErro(e, 'Visita não encontrada.')))
      .finally(() => setBuscando(false));
  }, [id]);
  
  if (buscando) {
    return (
      <SafeAreaView style={Perfil.container} edges={['top']}>
        <ScreenHeader title="Visita" />
        <View style={Perfil.body}>
          <ActivityIndicator color={FormularioColors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!visita) {
    return (
      <SafeAreaView style={Perfil.container} edges={['top']}>
        <ScreenHeader title="Visita" />
        <View style={Perfil.body}>
          <Text style={Perfil.notFoundText}>{erro ?? 'Visita não encontrada.'}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={Perfil.container} edges={['top']}>
      <ScreenHeader title="Visita" />

      <ScrollView contentContainerStyle={Perfil.body}>
        <View style={Perfil.card}>
          <InfoRow label="Nome" value={visita.nome} />
          <InfoRow label="Data da visita" value={formatarDataExibicao(visita.data) ?? '-'} />

          <View style={Perfil.actionsRow}>
            <TouchableOpacity
              style={Perfil.updateButton}
              activeOpacity={0.85}
              onPress={() => router.push({ pathname: '/visitas/[id]/editar', params: { id } })}
            >
              <Text style={Perfil.actionButtonText}>Atualizar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={Perfil.deleteButton}
              activeOpacity={0.85}
              onPress={() => router.push({ pathname: '/visitas/[id]/deletar', params: { id } })}
            >
              <Text style={Perfil.actionButtonText}>Deletar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
