import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AvatarPhotoPicker } from '@/components/idosos/avatar-photo-picker';
import { ScreenHeader } from '@/components/idosos/screen-header';
import { useIdosos } from '@/contexts/idosos-context';
import { IdososColors, IdososRadius } from '@/constants/idosos-theme';
import { createShadow } from '@/utils/shadow';

function formatarData(data?: string) {
  if (!data) return '-';
  const [ano, mes, dia] = data.split('-');
  if (!ano || !mes || !dia) return data;
  return `${dia}/${mes}/${ano}`;
}

function InfoRow({ label, value }: { label: string; value?: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value?.trim() ? value : '-'}</Text>
    </View>
  );
}

export default function PerfilIdosoScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getIdoso, buscarIdosoRemoto } = useIdosos();
  const idoso = getIdoso(id);
  const [buscando, setBuscando] = useState(!idoso);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    if (idoso) return;
    setBuscando(true);
    buscarIdosoRemoto(id)
      .catch((e) => setErro(e instanceof Error ? e.message : 'Idoso não encontrado.'))
      .finally(() => setBuscando(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (buscando) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScreenHeader title="Perfil do idoso" />
        <View style={styles.body}>
          <ActivityIndicator color={IdososColors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!idoso) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScreenHeader title="Perfil do idoso" />
        <View style={styles.body}>
          <Text style={styles.notFoundText}>{erro ?? 'Idoso não encontrado.'}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScreenHeader title="Perfil do idoso" />

      <ScrollView contentContainerStyle={styles.body}>
        <View style={styles.card}>
          <View style={styles.avatarSection}>
            <AvatarPhotoPicker uri={idoso.foto} size={88} />
            <Text style={styles.nome}>{idoso.nome}</Text>
          </View>

          <InfoRow label="CPF" value={idoso.cpf} />
          <InfoRow label="RG" value={idoso.rg} />
          <InfoRow label="Data de emissão do RG" value={formatarData(idoso.dataEmissaoRg)} />
          <InfoRow label="Órgão Emissor de RG" value={idoso.orgaoEmissorRg} />
          <InfoRow label="SUS" value={idoso.sus} />
          <InfoRow label="Data de nascimento" value={formatarData(idoso.dataNascimento)} />
          <InfoRow label="Sexo" value={idoso.sexo === 'feminino' ? 'Feminino' : idoso.sexo === 'masculino' ? 'Masculino' : '-'} />
          <InfoRow label="Naturalidade" value={idoso.naturalidade} />
          <InfoRow label="Nacionalidade" value={idoso.nacionalidade} />

          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={styles.updateButton}
              activeOpacity={0.85}
              onPress={() => router.push({ pathname: '/idosos/[id]/editar', params: { id: idoso.id } })}
            >
              <Text style={styles.actionButtonText}>Atualizar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteButton}
              activeOpacity={0.85}
              onPress={() => router.push({ pathname: '/idosos/[id]/deletar', params: { id: idoso.id } })}
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
    backgroundColor: IdososColors.background,
  },
  body: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 40,
  },
  notFoundText: {
    color: IdososColors.textSecondary,
    fontSize: 15,
    textAlign: 'center',
    marginTop: 40,
  },
  card: {
    backgroundColor: IdososColors.card,
    borderRadius: IdososRadius.card,
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
    color: IdososColors.text,
    marginTop: 12,
  },
  infoRow: {
    borderBottomWidth: 1,
    borderBottomColor: IdososColors.border,
    paddingVertical: 10,
  },
  infoLabel: {
    fontSize: 12,
    color: IdososColors.textSecondary,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 15,
    color: IdososColors.text,
    fontWeight: '600',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 22,
  },
  updateButton: {
    flex: 1,
    backgroundColor: IdososColors.info,
    borderRadius: IdososRadius.button,
    paddingVertical: 14,
    alignItems: 'center',
  },
  deleteButton: {
    flex: 1,
    backgroundColor: IdososColors.danger,
    borderRadius: IdososRadius.button,
    paddingVertical: 14,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
