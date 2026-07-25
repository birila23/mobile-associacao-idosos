import { useRouter } from 'expo-router';
import { ActivityIndicator, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AvatarPhotoPicker } from '@/components/idosos/avatar-photo-picker';
import { ScreenHeader } from '@/components/screen-header';
import { FormularioColors } from '@/constants/formularios-theme';
import { Lista } from '@/constants/lista-theme';
import { useIdosos } from '@/contexts/idosos-context';

export default function ListaIdososScreen() {
  const router = useRouter();
  const { idosos, carregando, erro, recarregar } = useIdosos();

  return (
    <SafeAreaView style={Lista.container} edges={['top']}>
      <ScreenHeader title="Gerenciamento idosos" />

      <View style={Lista.body}>
        <TouchableOpacity
          style={Lista.addButton}
          activeOpacity={0.85}
          onPress={() => router.push('/idosos/novo')}
        >
          <Text style={Lista.addButtonText}>+ Adicionar idoso</Text>
        </TouchableOpacity>

        {carregando ? (
          <View style={Lista.emptyCard}>
            <ActivityIndicator color={FormularioColors.primary} />
          </View>
        ) : erro ? (
          <View style={Lista.emptyCard}>
            <Text style={Lista.errorText}>{erro}</Text>
            <TouchableOpacity style={Lista.retryButton} onPress={recarregar} activeOpacity={0.85}>
              <Text style={Lista.retryButtonText}>Tentar novamente</Text>
            </TouchableOpacity>
          </View>
        ) : idosos.length === 0 ? (
          <View style={Lista.emptyCard}>
            <Text style={Lista.emptyText}>Nenhum idoso cadastrado</Text>
          </View>
        ) : (
          <ScrollView
            style={Lista.listCard}
            contentContainerStyle={Lista.listContent}
            refreshControl={<RefreshControl refreshing={false} onRefresh={recarregar} />}
          >
            {idosos.map((idoso) => (
              <TouchableOpacity
                key={idoso.id}
                style={Lista.listItem}
                activeOpacity={0.7}
                onPress={() => router.push({ pathname: '/idosos/[id]', params: { id: idoso.id } })}
              >
                <AvatarPhotoPicker uri={idoso.foto} size={36} />
                <Text style={Lista.listItemName}>{idoso.nome}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}
