import axios from 'axios';
import { Stack, router } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Button from '@/components/Button';
import Input from '@/components/Input';
import { salvarToken } from '@/services/token-storage';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [emailError, setEmailError] = useState('');
  const [senhaError, setSenhaError] = useState(false);
  const [apiError, setApiError] = useState('');

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

  const validateSenha = () => {
    if (senha.trim() === '') {
      setSenhaError(true);
      return false;
    }
    setSenhaError(false);
    return true;
  };

  const handleLogin = async () => {
    const isEmailValid = validateEmail();
    const isSenhaValid = validateSenha();

    if (!isEmailValid || !isSenhaValid) return;

    setIsLoading(true);
    setApiError(''); 

    try {
      const response = await axios.post('https://api-associacao-idosos.onrender.com/api/login', {
        email: email.trim(),
        senha: senha,
      });

      const token =
        response.data?.token ?? response.data?.accessToken ?? response.data?.access_token;

      if (!token) {
        setApiError('Login deu certo, mas o servidor não retornou um token.');
        return;
      }

      await salvarToken(token);

      if (response.status === 200 || response.status === 201) {
        router.replace('/home' as any);
      }
    } catch (error: any) {
      console.log('Erro ao fazer login:', error);

      if (error.response) {
        const errorMessage = error.response.data?.message || 'E-mail ou senha incorretos.';
        setApiError(errorMessage);
      } else if (error.request) {
        setApiError('O servidor está demorando para responder. Tente novamente em breve.');
      } else {
        setApiError('Ocorreu um erro ao tentar entrar. Verifique sua conexão.');
      }
    } finally {
      setIsLoading(false);
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
          
          <View style={styles.headerContainer}>
            <Text style={styles.mainTitle}>Apoio para Associações de Idosos</Text>
            <Text style={styles.subTitle}>
              Conecte-se e continue fazendo a diferença na vida dos idosos.
            </Text>
          </View>

          <View style={styles.loginCard}>
            <Text style={styles.welcomeText}>Bem-vindo de volta</Text>

            {!!apiError && (
              <View style={styles.apiErrorBox}>
                <Text style={styles.apiErrorText}>{apiError}</Text>
              </View>
            )}

            <Input
              label="Digite seu e-mail"
              placeholder="exemplo@email.com"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (emailError) setEmailError('');
                if (apiError) setApiError('');
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!isLoading}
              errorMessage={emailError}
              onFocus={() => setIsTyping(true)}
              onBlur={() => {
                setIsTyping(false);
                validateEmail();
              }}
            />

            <Input
              label="Digite sua senha"
              placeholder="********"
              value={senha}
              onChangeText={(text) => {
                setSenha(text);
                if (senhaError) setSenhaError(false);
                if (apiError) setApiError('');
              }}
              secureTextEntry
              editable={!isLoading}
              errorMessage={senhaError ? 'Campo obrigatório' : undefined}
              onFocus={() => setIsTyping(true)}
              onBlur={() => {
                setIsTyping(false);
                validateSenha();
              }}
            />

            <View style={styles.createAccountSection}>
              <Text style={styles.noAccountText}>Não possui conta?</Text>
              <Button
                title="Criar conta"
                variant="secondary"
                onPress={() => router.push('/cadastro')}
                disabled={isLoading}
              />
            </View>

            <Button
              title="Entrar"
              variant="primary"
              onPress={handleLogin}
              isLoading={isLoading}
            />

            {isTyping && !isLoading && (
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
  apiErrorBox: {
    backgroundColor: '#FFEEEE',
    borderWidth: 1,
    borderColor: '#FFBBBB',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
  apiErrorText: {
    color: '#CC0000',
    textAlign: 'center',
    fontSize: 14,
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
  verifyingText: {
    textAlign: 'center',
    marginTop: 15,
    color: '#555',
    fontSize: 14,
  },
});