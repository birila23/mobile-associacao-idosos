import axios from 'axios';
import { Stack, router } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Button from '@/components/Button';
import Input from '@/components/Input';
import Select from '@/components/Select';

export default function RegisterScreen() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');
  const [endereco, setEndereco] = useState('');
  const [telefone, setTelefone] = useState('');
  const [tipoUsuario, setTipoUsuario] = useState('');
  const [sexo, setSexo] = useState('');

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSexoDropdownOpen, setIsSexoDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [nomeError, setNomeError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [cpfError, setCpfError] = useState('');
  const [senhaError, setSenhaError] = useState('');
  const [enderecoError, setEnderecoError] = useState('');
  const [telefoneError, setTelefoneError] = useState('');
  const [tipoUsuarioError, setTipoUsuarioError] = useState('');
  const [sexoError, setSexoError] = useState('');
  const [apiError, setApiError] = useState('');

  const tipos: string[] = ['coordenador', 'voluntario', 'familiar', 'enfermeiro'];
  const opcoesSexo: string[] = ['feminino', 'masculino'];

  const formatCpf = (text: string) => {
    const nums = text.replace(/\D/g, '');
    if (nums.length <= 3) return nums;
    if (nums.length <= 6) return nums.replace(/(\d{3})(\d{1,3})/, '$1.$2');
    if (nums.length <= 9) return nums.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
    return nums.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4').substring(0, 14);
  };

  const formatTelefone = (text: string) => {
    const nums = text.replace(/\D/g, '');
    if (nums.length <= 2) return nums;
    if (nums.length <= 7) return nums.replace(/(\d{2})(\d{1,5})/, '($1) $2');
    return nums.replace(/(\d{2})(\d{5})(\d{1,4})/, '($1) $2-$3').substring(0, 15);
  };

  const validateNome = () => {
    if (nome.trim() === '') {
      setNomeError('Campo obrigatório');
      return false;
    }
    if (nome.trim().length < 3) {
      setNomeError('Nome deve ter ao menos 3 caracteres');
      return false;
    }
    setNomeError('');
    return true;
  };

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

  const validateCpf = () => {
    const apenasNumeros = cpf.replace(/\D/g, '');
    if (apenasNumeros.length !== 11) {
      setCpfError('CPF incompleto');
      return false;
    }
    setCpfError('');
    return true;
  };

  const validateSenha = () => {
    if (senha.trim() === '') {
      setSenhaError('Campo obrigatório');
      return false;
    }
    if (senha.length < 6) {
      setSenhaError('Senha deve ter ao menos 6 caracteres');
      return false;
    }
    setSenhaError('');
    return true;
  };

  const validateEndereco = () => {
    if (endereco.trim() === '') {
      setEnderecoError('Campo obrigatório');
      return false;
    }
    if (endereco.trim().length < 5) {
      setEnderecoError('Endereço deve ter ao menos 5 caracteres');
      return false;
    }
    setEnderecoError('');
    return true;
  };

  const validateTelefone = () => {
    const apenasNumeros = telefone.replace(/\D/g, '');
    if (apenasNumeros.length < 10) {
      setTelefoneError('Telefone inválido');
      return false;
    }
    setTelefoneError('');
    return true;
  };

  const validateTipoUsuario = (value = tipoUsuario) => {
    if (value === '') {
      setTipoUsuarioError('Selecione um tipo');
      return false;
    }
    setTipoUsuarioError('');
    return true;
  };

  const validateSexo = (value = sexo) => {
    if (value === '') {
      setSexoError('Selecione o sexo');
      return false;
    }
    setSexoError('');
    return true;
  };

  const handleRegister = async () => {
    const isNomeValid = validateNome();
    const isEmailValid = validateEmail();
    const isCpfValid = validateCpf();
    const isSenhaValid = validateSenha();
    const isEnderecoValid = validateEndereco();
    const isTelefoneValid = validateTelefone();
    const isTipoValid = validateTipoUsuario();
    const isSexoValid = validateSexo();

    if (
      !isNomeValid ||
      !isEmailValid ||
      !isCpfValid ||
      !isSenhaValid ||
      !isEnderecoValid ||
      !isTelefoneValid ||
      !isTipoValid ||
      !isSexoValid
    ) {
      return;
    }

    setIsLoading(true);
    setApiError('');

    try {
      const response = await axios.post(
        'https://api-associacao-idosos.onrender.com/api/cadastrarUsuario',
        {
          nome: nome.trim(),
          email: email.trim(),
          cpf: cpf,
          senha: senha,
          tipo: tipoUsuario,
          sexo: sexo,
          endereco: endereco.trim(),
          telefone: telefone.replace(/\D/g, ''),
        }
      );

      if (response.status === 200 || response.status === 201) {
        alert('Cadastro realizado com sucesso!');
        router.replace('/' as any);
      }
    } catch (error: any) {
      console.log('Erro no cadastro:', error);
      if (error.response) {
        setApiError(
          error.response.data?.message || 'Erro ao realizar o cadastro. Tente novamente.'
        );
      } else {
        setApiError('Não foi possível conectar ao servidor.');
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
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerContainer}>
            <Text style={styles.mainTitle}>Apoio para Associações de Idosos</Text>
          </View>

          <View style={styles.registerCard}>
            <Text style={styles.titleText}>Crie sua conta</Text>

            {!!apiError && (
              <View style={styles.apiErrorBox}>
                <Text style={styles.apiErrorText}>{apiError}</Text>
              </View>
            )}

            <Input
              label="Nome completo"
              value={nome}
              editable={!isLoading}
              onChangeText={(text) => {
                setNome(text);
                if (nomeError) setNomeError('');
              }}
              errorMessage={nomeError}
              onBlur={validateNome}
            />

            <Input
              label="E-mail"
              value={email}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!isLoading}
              onChangeText={(text) => {
                setEmail(text);
                if (emailError) setEmailError('');
              }}
              errorMessage={emailError}
              onBlur={validateEmail}
            />

            <Input
              label="CPF"
              value={cpf}
              keyboardType="numeric"
              editable={!isLoading}
              onChangeText={(text) => {
                setCpf(formatCpf(text));
                if (cpfError) setCpfError('');
              }}
              errorMessage={cpfError}
              onBlur={validateCpf}
            />

            <Input
              label="Telefone"
              placeholder="(99) 99999-9999"
              value={telefone}
              keyboardType="numeric"
              editable={!isLoading}
              onChangeText={(text) => {
                setTelefone(formatTelefone(text));
                if (telefoneError) setTelefoneError('');
              }}
              errorMessage={telefoneError}
              onBlur={validateTelefone}
            />

            <Input
              label="Endereço Completo"
              value={endereco}
              editable={!isLoading}
              onChangeText={(text) => {
                setEndereco(text);
                if (enderecoError) setEnderecoError('');
              }}
              errorMessage={enderecoError}
              onBlur={validateEndereco}
            />

            <Input
              label="Senha"
              value={senha}
              secureTextEntry
              editable={!isLoading}
              onChangeText={(text) => {
                setSenha(text);
                if (senhaError) setSenhaError('');
              }}
              errorMessage={senhaError}
              onBlur={validateSenha}
            />

            <Select
              label="Tipo de usuário"
              selectedValue={tipoUsuario}
              options={tipos}
              isOpen={isDropdownOpen}
              placeholder="Selecione um tipo..."
              errorMessage={tipoUsuarioError}
              disabled={isLoading}
              onToggle={() => {
                setIsDropdownOpen(!isDropdownOpen);
                setIsSexoDropdownOpen(false);
              }}
              onSelect={(item) => {
                setTipoUsuario(item);
                setIsDropdownOpen(false);
                validateTipoUsuario(item);
              }}
            />

            <Select
              label="Sexo"
              selectedValue={sexo}
              options={opcoesSexo}
              isOpen={isSexoDropdownOpen}
              errorMessage={sexoError}
              disabled={isLoading}
              onToggle={() => {
                setIsSexoDropdownOpen(!isSexoDropdownOpen);
                setIsDropdownOpen(false);
              }}
              onSelect={(item) => {
                setSexo(item);
                setIsSexoDropdownOpen(false);
                validateSexo(item);
              }}
            />

            <View style={styles.loginSection}>
              <Text style={styles.alreadyHasAccountText}>Já possui conta?</Text>
              <Button
                title="Fazer login"
                variant="secondary"
                onPress={() => router.replace('/' as any)}
                disabled={isLoading}
              />
            </View>

            <Button
              title="Cadastrar"
              variant="primary"
              onPress={handleRegister}
              isLoading={isLoading}
            />
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
    paddingVertical: 30,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  mainTitle: {
    fontSize: 26,
    fontWeight: '900',
    textAlign: 'center',
    color: '#000',
    marginBottom: 10,
  },
  registerCard: {
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
  titleText: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 25,
    color: '#000',
  },
  loginSection: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 25,
  },
  alreadyHasAccountText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 10,
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
});