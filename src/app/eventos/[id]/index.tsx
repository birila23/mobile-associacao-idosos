import { Feather, Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Map from '@/components/eventos/Map';
import { obterToken } from '@/services/token-storage';

interface Evento {
  _id: string;
  nome: string;
  descricao?: string;
  data: string;
  imagem?: string;
  local?: {
    type: string;
    coordinates: [number, number];
  };
}

export default function DetalhesEventoScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [evento, setEvento] = useState<Evento | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      carregarDetalhesEvento();
    }
  }, [id]);

  const carregarDetalhesEvento = async () => {
    try {
      setIsLoading(true);
      const token = await obterToken();
      const response = await axios.get(
        `https://api-associacao-idosos.onrender.com/api/eventos/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const dadosEvento = response.data?.evento || response.data;
      setEvento(dadosEvento);
    } catch (error: any) {
      console.log('Erro ao carregar detalhes do evento:', error.response?.data || error.message);
      Alert.alert('Erro', 'Não foi possível carregar as informações do evento.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatarData = (dataIso?: string) => {
    if (!dataIso) return '';
    const dataObj = new Date(dataIso);
    const dia = String(dataObj.getDate()).padStart(2, '0');
    const mes = String(dataObj.getMonth() + 1).padStart(2, '0');
    const ano = dataObj.getFullYear();
    const horas = String(dataObj.getHours()).padStart(2, '0');
    const minutos = String(dataObj.getMinutes()).padStart(2, '0');
    return `${dia}/${mes}/${ano} às ${horas}:${minutos}`;
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <Stack.Screen options={{ headerShown: false }} />
        <ActivityIndicator size="large" color="#EE73A4" />
      </SafeAreaView>
    );
  }

  if (!evento) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <Stack.Screen options={{ headerShown: false }} />
        <Text style={styles.errorText}>Evento não encontrado.</Text>
        <TouchableOpacity style={styles.backButtonSimple} onPress={() => router.back()}>
          <Text style={styles.backButtonSimpleText}>Voltar</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const temCoordenadas = evento.local?.coordinates && evento.local.coordinates.length === 2;
  const longitude = temCoordenadas ? evento.local!.coordinates[0] : 0;
  const latitude = temCoordenadas ? evento.local!.coordinates[1] : 0;

  const mapRegion = {
    latitude: latitude || -7.2016,
    longitude: longitude || -39.3180,
    latitudeDelta: 0.008,
    longitudeDelta: 0.008,
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* CABEÇALHO */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>Detalhes do Evento</Text>
        <TouchableOpacity 
          style={styles.editButton} 
          onPress={() => router.push(`/eventos/${id}/editar` as any)}
        >
          <Feather name="edit" size={20} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.cardDetalhes}>
          
          {/* IMAGEM DO EVENTO */}
          <View style={styles.imagemContainer}>
            {evento.imagem && evento.imagem.startsWith('data:image') ? (
              <Image source={{ uri: evento.imagem }} style={styles.imagem} resizeMode="cover" />
            ) : (
              <View style={styles.imagemPlaceholder}>
                <Feather name="image" size={48} color="#999" />
              </View>
            )}
          </View>

          {/* TÍTULO E DATA */}
          <View style={styles.section}>
            <Text style={styles.titulo}>{evento.nome}</Text>
            
            <View style={styles.infoRow}>
              <Feather name="calendar" size={18} color="#EE73A4" />
              <Text style={styles.infoText}>{formatarData(evento.data)}</Text>
            </View>
          </View>

          {/* DESCRIÇÃO */}
          {evento.descricao ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Descrição</Text>
              <Text style={styles.descricaoText}>{evento.descricao}</Text>
            </View>
          ) : null}

          {/* LOCALIZAÇÃO E MAPA */}
          {temCoordenadas && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Local do Evento</Text>
              <View style={styles.mapContainer}>
                <Map
                  region={mapRegion}
                  latitude={latitude.toString()}
                  longitude={longitude.toString()}
                />
              </View>
            </View>
          )}

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D9D9D9',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 15,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 10,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  cardDetalhes: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 16,
    elevation: 4,
  },
  imagemContainer: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#EAEAEA',
    marginBottom: 20,
  },
  imagem: {
    width: '100%',
    height: '100%',
  },
  imagemPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    marginBottom: 20,
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  infoText: {
    fontSize: 15,
    color: '#555',
    marginLeft: 8,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  descricaoText: {
    fontSize: 15,
    color: '#444',
    lineHeight: 22,
  },
  mapContainer: {
    height: 220,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginTop: 5,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
  },
  backButtonSimple: {
    backgroundColor: '#EE73A4',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  backButtonSimpleText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});