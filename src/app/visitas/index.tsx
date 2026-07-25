import { ScreenHeader } from '@/components/screen-header';
import { FormularioColors } from '@/constants/formularios-theme';
import { Lista } from '@/constants/lista-theme';
import { useVisitas } from '@/contexts/visitas-context';
import { useRouter } from 'expo-router';
import { ActivityIndicator, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ListaVisitasScreen() {
  const router = useRouter();
  const { visitas, carregando, erro, recarregar } = useVisitas();

  return (
    <SafeAreaView style={Lista.container} edges={['top']}>
      <ScreenHeader title="Gerenciamento de visitas" />

      <View style={Lista.body}>
        <TouchableOpacity
          style={Lista.addButton}
          activeOpacity={0.85}
          onPress={() => router.push('/visitas/adicionar')}
        >
          <Text style={Lista.addButtonText}>+ Adicionar visita</Text>
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
        ) : visitas.length === 0 ? (
          <View style={Lista.emptyCard}>
            <Text style={Lista.emptyText}>Nenhuma visita cadastrada</Text>
          </View>
        ) : (
          <ScrollView
            style={Lista.listCard}
            contentContainerStyle={Lista.listContent}
            refreshControl={<RefreshControl refreshing={false} onRefresh={recarregar} />}
          >
            {visitas.map((visita) => (
              <TouchableOpacity
                key={visita.id}
                style={Lista.listItem}
                activeOpacity={0.7}
              >
                <Text style={Lista.listItemName}>{visita.nome}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}
