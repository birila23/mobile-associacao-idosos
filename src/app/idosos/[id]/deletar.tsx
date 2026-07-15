import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ScreenHeader } from '@/components/idosos/screen-header';
import { useIdosos } from '@/contexts/idosos-context';
import { IdososColors, IdososRadius } from '@/constants/idosos-theme';
import { createShadow } from '@/utils/shadow';

export default function DeletarIdosoScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getIdoso, removerIdoso } = useIdosos();
  const idoso = getIdoso(id);
  const [excluindo, setExcluindo] = useState(false);

  const handleCancelar = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/idosos');
    }
  };

  const handleDeletar = async () => {
    setExcluindo(true);
    try {
      await removerIdoso(id);
      router.replace('/idosos');
    } catch (e) {
      Alert.alert('Erro', e instanceof Error ? e.message : 'Não foi possível excluir o idoso.');
      setExcluindo(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScreenHeader title="Deletar idoso" />

      <View style={styles.overlay}>
        <View style={styles.dialog}>
          <Text style={styles.title}>Confirmar exclusão</Text>
          <Text style={styles.message}>
            Tem certeza que deseja excluir {idoso ? idoso.nome : 'este idoso'}?
          </Text>

          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={styles.deleteButton}
              activeOpacity={0.85}
              onPress={handleDeletar}
              disabled={excluindo}
            >
              {excluindo ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.deleteButtonText}>Deletar</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              activeOpacity={0.85}
              onPress={handleCancelar}
              disabled={excluindo}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: IdososColors.background,
  },
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  dialog: {
    width: '100%',
    backgroundColor: IdososColors.card,
    borderRadius: IdososRadius.card,
    padding: 26,
    alignItems: 'center',
    ...createShadow({ offsetY: 6, opacity: 0.15, radius: 14, elevation: 6 }),
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: IdososColors.danger,
    marginBottom: 10,
  },
  message: {
    fontSize: 14,
    color: IdososColors.textSecondary,
    textAlign: 'center',
    marginBottom: 22,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  deleteButton: {
    flex: 1,
    backgroundColor: IdososColors.danger,
    borderRadius: IdososRadius.button,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: IdososColors.neutralButton,
    borderRadius: IdososRadius.button,
    paddingVertical: 13,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: IdososColors.neutralButtonText,
    fontSize: 15,
    fontWeight: '700',
  },
});
