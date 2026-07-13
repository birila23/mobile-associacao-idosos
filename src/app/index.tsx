import { Stack, router } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {
 const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState(false);

  const validateEmail = () => {
    if (email.trim() === '') {
      setEmailError('Campo obrigatório');
      return false;
    }
    if (!email.includes('@')) {
      setEmailError('O e-mail deve conter @');
      return false;
    }
    setEmailError('');
    return true;
  };

  const validatePassword = () => {
    if (password.trim() === '') {
      setPasswordError(true);
      return false;
    }
    setPasswordError(false);
    return true;
  };

  const handleLogin = () => {
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();

    if (isEmailValid && isPasswordValid) {
      router.replace('/home');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} /> 

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          
          {/* Cabeçalho */}
          <View style={styles.headerContainer}>
            <Text style={styles.mainTitle}>Apoio para Associações de Idosos</Text>
            <Text style={styles.subTitle}>
              Conecte-se e continue fazendo a diferença na vida dos idosos.
            </Text>
          </View>

          {/* Card de Login */}
          <View style={styles.loginCard}>
            <Text style={styles.welcomeText}>Bem-vindo de volta</Text>

            {/* Campo E-mail */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Digite seu e-mail</Text>
              <TextInput 
                style={[styles.input, !!emailError && styles.inputError]}
                placeholder="exemplo@email.com"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (emailError) setEmailError(''); 
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                onFocus={() => setIsTyping(true)}
                onBlur={() => {
                  setIsTyping(false);
                  validateEmail();
                }}
              />
              {!!emailError && <Text style={styles.errorText}>{emailError}</Text>}
            </View>

            {/* Campo Senha */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Digite sua senha</Text>
              <TextInput 
                style={[styles.input, passwordError && styles.inputError]}
                placeholder="********"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (passwordError) setPasswordError(false); 
                }}
                secureTextEntry
                onFocus={() => setIsTyping(true)}
                onBlur={() => {
                  setIsTyping(false);
                  validatePassword();
                }}
              />
              {passwordError && <Text style={styles.errorText}>Campo obrigatório</Text>}
            </View>

            {/* Seção Criar Conta */}
            <View style={styles.createAccountSection}>
              <Text style={styles.noAccountText}>Não possui conta?</Text>
              <TouchableOpacity 
                style={styles.secondaryButton}
                onPress={() => router.push('/cadastro')} 
              >
                <Text style={styles.secondaryButtonText}>Criar conta</Text>
              </TouchableOpacity>
            </View>

            {/* Botão Entrar */}
            <TouchableOpacity style={styles.primaryButton} onPress={handleLogin}>
              <Text style={styles.primaryButtonText}>Entrar</Text>
            </TouchableOpacity>

            {/* MOSTRA o "Verificando" apenas se estiver digitando */}
            {isTyping && (
              <Text style={styles.verifyingText}>Verificando....</Text>
            )}

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  mainTitle: {
    fontSize: 26,
    fontWeight: '900',
    textAlign: 'center',
    color: '#000',
    marginBottom: 20,
  },
  subTitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#333',
    paddingHorizontal: 10,
    lineHeight: 22,
  },
  loginCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    padding: 25,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 25,
    color: '#000',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    marginBottom: 8,
    color: '#000',
  },
  input: {
    borderWidth: 1,
    borderColor: '#777',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
  },
  inputError: {
    borderColor: '#FF0000',
  },
  errorText: {
    color: '#FF0000',
    fontSize: 12,
    marginTop: 5,
    marginLeft: 5,
  },
  createAccountSection: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  noAccountText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 10,
  },
  secondaryButton: {
    backgroundColor: '#E6E6E6',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#BBB',
  },
  secondaryButtonText: {
    fontSize: 14,
    color: '#000',
  },
  primaryButton: {
    backgroundColor: '#E97BB5',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  verifyingText: {
    textAlign: 'center',
    marginTop: 15,
    color: '#555',
    fontSize: 14,
  }
});