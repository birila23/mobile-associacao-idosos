import { Stack, router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import MenuCard from '../../components/home/MenuCard';

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
          
          <MenuCard 
            title="Idosos"
            iconUrl="https://cdn-icons-png.flaticon.com/128/18367/18367257.png"
            onPress={() => router.push('/idosos' as any)}
          />

          <MenuCard 
            title="Eventos"
            iconUrl="https://cdn-icons-png.flaticon.com/512/2666/2666505.png"
            onPress={() => router.push('/eventos' as any)}
          />

          <MenuCard 
            title="Visitas"
            iconUrl="https://cdn-icons-png.flaticon.com/128/15755/15755281.png"
            onPress={() => router.push('/visitas' as any)}
          />

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
});