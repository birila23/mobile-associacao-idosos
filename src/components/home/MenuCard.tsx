import { Image, StyleSheet, Text, TouchableOpacity } from 'react-native';

interface MenuCardProps {
  title: string;
  iconUrl: string;
  onPress: () => void;
}

export default function MenuCard({ title, iconUrl, onPress }: MenuCardProps) {
  return (
    <TouchableOpacity 
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={styles.cardTitle}>{title}</Text>
      
      <Image 
        source={{ uri: iconUrl }} 
        style={styles.cardIcon}
        resizeMode="contain"
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#F5EFEB', 
    width: 180,
    height: 180,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 35,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 5,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  cardIcon: {
    width: 85,
    height: 85,
  },
});