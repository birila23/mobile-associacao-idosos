import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { obterToken } from '@/services/token-storage';

export default function DeletarEventoScreen() {
  const { id, nome, data } = useLocalSearchParams();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirmarExclusao = async () => {
    setIsDeleting(true);
    try {
      const token = await obterToken();
      await axios.delete(
        `https://api-associacao-idosos.onrender.com/api/eventos/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      Alert.alert('Sucesso', 'Evento excluído com sucesso!');
      router.replace('/eventos' as any); 
    } catch (error: any) {
      console.log('Erro ao excluir:', error.response?.data || error.message);
      Alert.alert('Erro', 'Não foi possível excluir o evento.');
      setIsDeleting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* CABEÇALHO */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Deletar Evento</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* CONTEÚDO */}
      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.title}>Excluir Evento</Text>
          
          <Text style={styles.description}>
            Tem certeza que deseja excluir o evento {nome}? Esta ação não pode ser desfeita.
          </Text>

          {/* DADOS DO EVENTO */}
          <View style={styles.eventInfoBox}>
            <Text style={styles.eventName}>{nome}</Text>
            <Text style={styles.eventDate}>{data}</Text>
          </View>

          {/* BOTÕES DE AÇÃO */}
          <View style={styles.buttonsRow}>
            <TouchableOpacity 
              style={styles.cancelButton} 
              onPress={() => router.back()}
              disabled={isDeleting}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.deleteButton} 
              onPress={handleConfirmarExclusao}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.deleteButtonText}>Excluir</Text>
              )}
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
    backgroundColor: '#D9D9D9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 40,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 15,
  },
  description: {
    fontSize: 15,
    color: '#444',
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 22,
  },
  eventInfoBox: {
    backgroundColor: '#D9D9D9',
    borderRadius: 10,
    padding: 15,
    marginBottom: 30,
  },
  eventName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 5,
  },
  eventDate: {
    fontSize: 14,
    color: '#555',
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#C4C4C4', 
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginRight: 10,
  },
  cancelButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#F03E3E',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginLeft: 10,
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});