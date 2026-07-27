import { Feather } from '@expo/vector-icons';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export interface Evento {
  id: string;
  titulo: string;
  dataHora: string;
  descricao?: string;
  imagemUrl?: string;
}

interface EventCardProps {
  evento: Evento;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function EventCard({ evento, onEdit, onDelete }: EventCardProps) {
  return (
    <View style={styles.card}>
      {/* Imagem / Placeholder */}
      {evento.imagemUrl ? (
        <Image source={{ uri: evento.imagemUrl }} style={styles.thumbnail} />
      ) : (
        <View style={styles.thumbnailPlaceholder} />
      )}

      {/* Informações do Evento */}
      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {evento.titulo}
        </Text>
        <Text style={styles.dateText}>{evento.dataHora}</Text>
        {!!evento.descricao && (
          <Text style={styles.descriptionText} numberOfLines={2}>
            {evento.descricao}
          </Text>
        )}
      </View>

      {/* Ações (Editar e Excluir) */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity 
          onPress={() => onEdit(evento.id)} 
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Feather name="edit-3" size={18} color="#555" />
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => onDelete(evento.id)} 
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Feather name="trash-2" size={18} color="#E53E3E" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 10,
    backgroundColor: '#D9D9D9',
  },
  thumbnailPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 10,
    backgroundColor: '#D9D9D9',
  },
  infoContainer: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  dateText: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  descriptionText: {
    fontSize: 12,
    color: '#777',
    marginTop: 4,
  },
  actionsContainer: {
    justifyContent: 'space-between',
    height: 55,
    alignItems: 'center',
    paddingVertical: 2,
  },
});