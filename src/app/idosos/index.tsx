import { useRouter } from 'expo-router';
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AvatarPhotoPicker } from '@/components/idosos/avatar-photo-picker';
import { ScreenHeader } from '@/components/idosos/screen-header';
import { useIdosos } from '@/contexts/idosos-context';
import { IdososColors, IdososRadius } from '@/constants/idosos-theme';

export default function ListaIdososScreen() {
  const router = useRouter();
  const { idosos, carregando, erro, recarregar } = useIdosos();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScreenHeader title="Gerenciamento idosos" />

      <View style={styles.body}>
        <TouchableOpacity
          style={styles.addButton}
          activeOpacity={0.85}
          onPress={() => router.push('/idosos/novo')}
        >
          <Text style={styles.addButtonText}>+ Adicionar idoso</Text>
        </TouchableOpacity>

        {carregando ? (
          <View style={styles.emptyCard}>
            <ActivityIndicator color={IdososColors.primary} />
          </View>
        ) : erro ? (
          <View style={styles.emptyCard}>
            <Text style={styles.errorText}>{erro}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={recarregar} activeOpacity={0.85}>
              <Text style={styles.retryButtonText}>Tentar novamente</Text>
            </TouchableOpacity>
          </View>
        ) : idosos.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>Nenhum idoso cadastrado</Text>
          </View>
        ) : (
          <ScrollView
            style={styles.listCard}
            contentContainerStyle={styles.listContent}
            refreshControl={<RefreshControl refreshing={false} onRefresh={recarregar} />}
          >
            {idosos.map((idoso) => (
              <TouchableOpacity
                key={idoso.id}
                style={styles.listItem}
                activeOpacity={0.7}
                onPress={() => router.push({ pathname: '/idosos/[id]', params: { id: idoso.id } })}
              >
                <AvatarPhotoPicker uri={idoso.foto} size={36} />
                <Text style={styles.listItemName}>{idoso.nome}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>
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
  addButton: {
    backgroundColor: IdososColors.primary,
    borderRadius: IdososRadius.button,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 20,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  emptyCard: {
    flex: 1,
    backgroundColor: IdososColors.card,
    borderRadius: IdososRadius.card,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    color: IdososColors.textSecondary,
    fontSize: 15,
  },
  errorText: {
    color: IdososColors.danger,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 14,
    paddingHorizontal: 20,
  },
  retryButton: {
    backgroundColor: IdososColors.neutralButton,
    borderRadius: IdososRadius.button,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  retryButtonText: {
    color: IdososColors.neutralButtonText,
    fontSize: 14,
    fontWeight: '700',
  },
  listCard: {
    backgroundColor: IdososColors.card,
    borderRadius: IdososRadius.card,
  },
  listContent: {
    padding: 10,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: IdososColors.border,
  },
  listItemName: {
    fontSize: 15,
    fontWeight: '600',
    color: IdososColors.text,
  },
});
