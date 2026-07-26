import { ScreenHeader } from '@/components/screen-header';
import { FormularioColors, FormularioRadius } from '@/constants/formularios-theme';
import { useVisitas } from '@/contexts/visitas-context';
import { extrairMensagemErro } from '@/services/api-client';
import { formatarDataExibicao } from '@/utils/date';
import { createShadow } from '@/utils/shadow';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function InfoRow({ label, value }: { label: string; value?: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value?.trim() ? value : '-'}</Text>
    </View>
  );
}

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
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScreenHeader title="Visita" />
        <View style={styles.body}>
          <ActivityIndicator color={FormularioColors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!visita) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScreenHeader title="Visita" />
        <View style={styles.body}>
          <Text style={styles.notFoundText}>{erro ?? 'Visita não encontrada.'}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScreenHeader title="Visita" />

      <ScrollView contentContainerStyle={styles.body}>
        <View style={styles.card}>
          <InfoRow label="Nome" value={visita.nome} />
          <InfoRow label="Data da visita" value={formatarDataExibicao(visita.data) ?? '-'} />

          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={styles.updateButton}
              activeOpacity={0.85}
              onPress={() => router.push({ pathname: '/visitas/[id]/editar', params: { id: visita.id } })}
            >
              <Text style={styles.actionButtonText}>Atualizar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteButton}
              activeOpacity={0.85}
              onPress={() => router.push({ pathname: '/visitas/[id]/deletar', params: { id: visita.id } })}
            >
              <Text style={styles.actionButtonText}>Deletar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: FormularioColors.background,
  },
  body: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 40,
  },
  notFoundText: {
    color: FormularioColors.textSecondary,
    fontSize: 15,
    textAlign: 'center',
    marginTop: 40,
  },
  card: {
    backgroundColor: FormularioColors.card,
    borderRadius: FormularioRadius.card,
    padding: 22,
    ...createShadow({ offsetY: 4, opacity: 0.08, radius: 10, elevation: 3 }),
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  nome: {
    fontSize: 20,
    fontWeight: '800',
    color: FormularioColors.text,
    marginTop: 12,
  },
  infoRow: {
    borderBottomWidth: 1,
    borderBottomColor: FormularioColors.border,
    paddingVertical: 10,
  },
  infoLabel: {
    fontSize: 12,
    color: FormularioColors.textSecondary,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 15,
    color: FormularioColors.text,
    fontWeight: '600',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 22,
  },
  updateButton: {
    flex: 1,
    backgroundColor: FormularioColors.info,
    borderRadius: FormularioRadius.button,
    paddingVertical: 14,
    alignItems: 'center',
  },
  deleteButton: {
    flex: 1,
    backgroundColor: FormularioColors.danger,
    borderRadius: FormularioRadius.button,
    paddingVertical: 14,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
