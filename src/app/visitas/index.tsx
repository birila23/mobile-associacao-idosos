import Input from '@/components/Input';
import { ScreenHeader } from '@/components/screen-header';
import { FormularioColors } from '@/constants/formularios-theme';
import { Lista } from '@/constants/lista-theme';
import { useVisitas } from '@/contexts/visitas-context';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ListaVisitasScreen() {
  const router = useRouter();
  const { visitas, carregando, erro, recarregar } = useVisitas();
  const [termoBusca, setTermoBusca] = useState('');
  const [filtroAplicado, setFiltroAplicado] = useState('');

  const handleBuscar = () => {
    setFiltroAplicado(termoBusca);
  };

  const visitasFiltradas = visitas.filter((visita) =>
    visita.nome.toLowerCase().includes(filtroAplicado.trim().toLowerCase())
  );

  return (
    <SafeAreaView style={Lista.container} edges={['top']}>
      <ScreenHeader title="Gerenciamento de visitas" />

      <View style={Lista.body}>
        <TouchableOpacity
          style={Lista.addButton}
          activeOpacity={0.85}
          onPress={() => router.push('/visitas/adicionar')}
        >
          <Text style={Lista.addButtonText}>+ Nova Visita</Text>
        </TouchableOpacity>
        <View style={styles.searchSection}>
          <Input
            label="Busque pelo nome da visita"
            placeholder="Nome"
            placeholderTextColor="#888888"
            value={termoBusca}
            onChangeText={setTermoBusca}
            style={{
              backgroundColor: '#FFFFFF',
            }}
          />
          <TouchableOpacity
            style={styles.searchButton}
            activeOpacity={0.85}
            onPress={handleBuscar}
          >
            <Text style={styles.searchButtonText}>Buscar</Text>
          </TouchableOpacity>
        </View>

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
        ) : visitasFiltradas.length === 0 ? (
          <View style={Lista.emptyCard}>
            <Text style={Lista.emptyText}>
              {filtroAplicado ? 'Nenhuma visita encontrada.' : 'Nenhuma visita cadastrada ainda.'}
            </Text>
          </View>
        ) : (
          <ScrollView
            style={Lista.listCard}
            contentContainerStyle={Lista.listContent}
            refreshControl={<RefreshControl refreshing={false} onRefresh={recarregar} />}
          >
            {visitasFiltradas.map((visita) => (
              <TouchableOpacity
                key={visita.id}
                style={Lista.listItem}
                activeOpacity={0.7}
                onPress={() => router.push({ pathname: '/visitas/[id]', params: { id: visita.id } })}
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

const styles = StyleSheet.create({
  searchSection: {
    marginVertical: 10,
    alignItems: 'center',
  },
  searchButton: {
    backgroundColor: '#00A859',
    paddingVertical: 8,
    paddingHorizontal: 28,
    borderRadius: 8,
    marginTop: -10,
  },
  searchButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
});