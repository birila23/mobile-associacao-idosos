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

export default function RegisterScreen() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');
  
  const [tipoUsuario, setTipoUsuario] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [isTyping, setIsTyping] = useState(false);
  
  const [nomeError, setNomeError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [cpfError, setCpfError] = useState('');
  const [senhaError, setSenhaError] = useState('');
  const [tipoUsuarioError, setTipoUsuarioError] = useState('');

  const tipos: string[] = ['coordenador', 'voluntario', 'familiar', 'enfermeiro'];

  // CORRIGIDO: Máscara progressiva à prova de falhas para o CPF
  const formatCpf = (text: string) => {
    const nums = text.replace(/\D/g, ''); 
    
    if (nums.length <= 3) return nums;
    if (nums.length <= 6) return nums.replace(/(\d{3})(\d{1,3})/, '$1.$2');
    if (nums.length <= 9) return nums.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
    return nums.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4').substring(0, 14);
  };

  const validateNome = () => {
    if (nome.trim() === '') {
      setNomeError('Campo obrigatório');
      return false;
    }
    const apenasLetras = /^[A-Za-zÀ-ÿ\s]+$/.test(nome);
    if (!apenasLetras) {
      setNomeError('O nome deve conter apenas letras');
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
    if (apenasNumeros === '') {
      setCpfError('Campo obrigatório');
      return false;
    }
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
    setSenhaError('');
    return true;
  };

  const validateTipoUsuario = (value = tipoUsuario) => {
    if (value === '') {
      setTipoUsuarioError('Campo obrigatório');
      return false;
    }
    setTipoUsuarioError('');
    return true;
  };

  const handleRegister = () => {
    const isNomeValid = validateNome();
    const isEmailValid = validateEmail();
    const isCpfValid = validateCpf();
    const isSenhaValid = validateSenha();
    const isTipoValid = validateTipoUsuario();

    if (isNomeValid && isEmailValid && isCpfValid && isSenhaValid && isTipoValid) {
      alert(`Cadastrado com sucesso como ${tipoUsuario}!`);
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

          {/* Card de Cadastro */}
          <View style={styles.registerCard}>
            <Text style={styles.titleText}>Crie sua conta</Text>

            {/* Campo Nome Completo */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nome completo</Text>
              <TextInput 
                style={[styles.input, !!nomeError && styles.inputError]}
                value={nome}
                onChangeText={(text) => {
                  setNome(text);
                  if (nomeError) setNomeError('');
                }}
                onFocus={() => setIsTyping(true)}
                onBlur={() => {
                  setIsTyping(false);
                  validateNome();
                }}
              />
              {!!nomeError && <Text style={styles.errorText}>{nomeError}</Text>}
            </View>

            {/* Campo E-mail */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Digite seu e-mail</Text>
              <TextInput 
                style={[styles.input, !!emailError && styles.inputError]}
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

            {/* Campo CPF */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>CPF (Somente números)</Text>
              <TextInput 
                style={[styles.input, !!cpfError && styles.inputError]}
                value={cpf}
                onChangeText={(text) => {
                  setCpf(formatCpf(text));
                  if (cpfError) setCpfError('');
                }}
                keyboardType="numeric"
                onFocus={() => setIsTyping(true)}
                onBlur={() => {
                  setIsTyping(false);
                  validateCpf();
                }}
              />
              {!!cpfError && <Text style={styles.errorText}>{cpfError}</Text>}
            </View>

            {/* Campo Senha */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Senha</Text>
              <TextInput 
                style={[styles.input, !!senhaError && styles.inputError]}
                value={senha}
                onChangeText={(text) => {
                  setSenha(text);
                  if (senhaError) setSenhaError('');
                }}
                secureTextEntry
                onFocus={() => setIsTyping(true)}
                onBlur={() => {
                  setIsTyping(false);
                  validateSenha();
                }}
              />
              {!!senhaError && <Text style={styles.errorText}>{senhaError}</Text>}
            </View>

            {/* Campo Tipo de Usuário */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Tipo de usuário</Text>
              
              <TouchableOpacity 
                style={[styles.dropdownButton, !!tipoUsuarioError && styles.dropdownButtonError]} 
                onPress={() => {
                  setIsDropdownOpen(!isDropdownOpen);
                  setIsTyping(!isDropdownOpen);
                }}
                activeOpacity={0.8}
              >
                <Text style={[styles.dropdownButtonText, !tipoUsuario && styles.placeholderText]}>
                  {tipoUsuario ? tipoUsuario : 'Selecione um tipo...'}
                </Text>
                <Text style={styles.arrowIcon}>{isDropdownOpen ? '▲' : '▼'}</Text>
              </TouchableOpacity>

              {isDropdownOpen && (
                <View style={styles.dropdownList}>
                  {tipos.map((item) => (
                    <TouchableOpacity 
                      key={item} 
                      style={[
                        styles.dropdownItem, 
                        tipoUsuario === item && styles.dropdownItemSelected
                      ]}
                      onPress={() => {
                        setTipoUsuario(item);
                        setIsDropdownOpen(false); 
                        setIsTyping(false);
                        validateTipoUsuario(item);
                      }}
                    >
                      <Text style={[
                        styles.dropdownItemText,
                        tipoUsuario === item && styles.dropdownItemTextSelected
                      ]}>
                        {item}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
              {!!tipoUsuarioError && <Text style={styles.errorText}>{tipoUsuarioError}</Text>}
            </View>

            {/* Seção Voltar para o Login */}
            <View style={styles.loginSection}>
              <Text style={styles.alreadyHasAccountText}>Já possui conta?</Text>
              <TouchableOpacity 
                style={styles.secondaryButton}
                onPress={() => router.replace('/')}
              >
                <Text style={styles.secondaryButtonText}>Fazer login</Text>
              </TouchableOpacity>
            </View>

            {/* Botão Cadastrar */}
            <TouchableOpacity style={styles.primaryButton} onPress={handleRegister}>
              <Text style={styles.primaryButtonText}>Cadastrar</Text>
            </TouchableOpacity>

            {/* Texto informativo */}
            {isTyping && (
              <Text style={styles.registeringText}>Cadastrando....</Text>
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
    marginBottom: 20,
  },
  subTitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#333',
    paddingHorizontal: 10,
    lineHeight: 22,
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
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 15,
    marginBottom: 6,
    color: '#000',
  },
  input: {
    borderWidth: 1,
    borderColor: '#777',
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    color: '#000',
  },
  dropdownButton: {
    borderWidth: 1,
    borderColor: '#777',
    borderRadius: 10,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  dropdownButtonText: {
    fontSize: 16,
    color: '#000',
    textTransform: 'lowercase', 
  },
  placeholderText: {
    color: '#A9A9A9', 
  },
  arrowIcon: {
    fontSize: 12,
    color: '#555',
  },
  dropdownList: {
    borderWidth: 1,
    borderColor: '#BBB',
    borderRadius: 10,
    marginTop: 5,
    backgroundColor: '#FFF',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden', 
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  dropdownItemSelected: {
    backgroundColor: '#E97BB522', 
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#333',
    textTransform: 'lowercase',
  },
  dropdownItemTextSelected: {
    color: '#E97BB5',
    fontWeight: 'bold',
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
  inputError: {
    borderColor: '#FF0000',
  },
  dropdownButtonError: {
    borderColor: '#FF0000',
  },
  errorText: {
    color: '#FF0000',
    fontSize: 12,
    marginTop: 5,
    marginLeft: 5,
  },
  registeringText: {
    textAlign: 'center',
    marginTop: 15,
    color: '#555',
    fontSize: 14,
  },
});