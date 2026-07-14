import { Stack, router } from 'expo-router';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.welcomeText}>
          Bem-vindo! Escolha uma opção abaixo para começar.
        </Text>

        {/* Container dos Menus */}
        <View style={styles.cardsContainer}>
          
          {/* CARD IDOSOS */}
          <TouchableOpacity 
            style={styles.card}
            onPress={() => router.push('/idosos' as any)}
            activeOpacity={0.7}
          >
            <Text style={styles.cardTitle}>Idosos</Text>
            
            <Image 
              source={{ uri: 'https://cdn-icons-png.flaticon.com/128/18367/18367257.png' }} 
              style={styles.cardIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>

          {/* CARD EVENTOS */}
          <TouchableOpacity 
            style={styles.card}
            onPress={() => router.push('/eventos' as any)}
            activeOpacity={0.7}
          >
            <Text style={styles.cardTitle}>Eventos</Text>
            
            <Image 
              source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2666/2666505.png' }} 
              style={styles.cardIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>

          {/* CARD VISITAS */}
          <TouchableOpacity 
            style={styles.card}
            onPress={() => router.push('/visitas' as any)}
            activeOpacity={0.7}
          >
            <Text style={styles.cardTitle}>Visitas</Text>
            
            <Image 
              source={{ uri: 'https://cdn-icons-png.flaticon.com/128/15755/15755281.png' }} 
              style={styles.cardIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>

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
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 30,
  },
  welcomeText: {
    fontSize: 15,
    textAlign: 'center',
    color: '#222',
    paddingHorizontal: 40,
    marginBottom: 40,
    lineHeight: 22,
  },
  cardsContainer: {
    alignItems: 'center',
    width: '100%',
  },
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