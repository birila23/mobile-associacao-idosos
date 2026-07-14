import axios from 'axios';
import { Stack, router } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
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
  // Estados dos campos
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
  
  // Estados de erro
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

  // Máscaras de formatação
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

  // Validações
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

  // Envio dos dados para a API
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
      !isNomeValid || !isEmailValid || !isCpfValid || !isSenhaValid ||
      !isEnderecoValid || !isTelefoneValid || !isTipoValid || !isSexoValid
    ) {
      return; 
    }

    setIsLoading(true);
    setApiError('');

    try {
      const response = await axios.post('https://api-associacao-idosos.onrender.com/api/cadastrarUsuario', {
        nome: nome.trim(),
        email: email.trim(),
        cpf: cpf, 
        senha: senha,
        tipo: tipoUsuario,
        sexo: sexo,
        endereco: endereco.trim(),
        telefone: telefone.replace(/\D/g, '') 
      });

      if (response.status === 200 || response.status === 201) {
        alert('Cadastro realizado com sucesso!');
        router.replace('/' as any); 
      }
    } catch (error: any) {
      console.log('Erro no cadastro:', error);
      if (error.response) {
        setApiError(error.response.data?.message || 'Erro ao realizar o cadastro. Tente novamente.');
      } else {
        setApiError('Não foi possível conectar ao servidor.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Renderização da Tela
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

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nome completo</Text>
              <TextInput 
                style={[styles.input, !!nomeError && styles.inputError]}
                value={nome}
                editable={!isLoading}
                onChangeText={(text) => {
                  setNome(text);
                  if (nomeError) setNomeError('');
                }}
                onBlur={validateNome}
              />
              {!!nomeError && <Text style={styles.errorText}>{nomeError}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>E-mail</Text>
              <TextInput 
                style={[styles.input, !!emailError && styles.inputError]}
                value={email}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!isLoading}
                onChangeText={(text) => {
                  setEmail(text);
                  if (emailError) setEmailError('');
                }}
                onBlur={validateEmail}
              />
              {!!emailError && <Text style={styles.errorText}>{emailError}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>CPF</Text>
              <TextInput 
                style={[styles.input, !!cpfError && styles.inputError]}
                value={cpf}
                keyboardType="numeric"
                editable={!isLoading}
                onChangeText={(text) => {
                  setCpf(formatCpf(text));
                  if (cpfError) setCpfError('');
                }}
                onBlur={validateCpf}
              />
              {!!cpfError && <Text style={styles.errorText}>{cpfError}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Telefone</Text>
              <TextInput 
                style={[styles.input, !!telefoneError && styles.inputError]}
                value={telefone}
                placeholder="(99) 99999-9999"
                keyboardType="numeric"
                editable={!isLoading}
                onChangeText={(text) => {
                  setTelefone(formatTelefone(text));
                  if (telefoneError) setTelefoneError('');
                }}
                onBlur={validateTelefone}
              />
              {!!telefoneError && <Text style={styles.errorText}>{telefoneError}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Endereço Completo</Text>
              <TextInput 
                style={[styles.input, !!enderecoError && styles.inputError]}
                value={endereco}
                editable={!isLoading}
                onChangeText={(text) => {
                  setEndereco(text);
                  if (enderecoError) setEnderecoError('');
                }}
                onBlur={validateEndereco}
              />
              {!!enderecoError && <Text style={styles.errorText}>{enderecoError}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Senha</Text>
              <TextInput 
                style={[styles.input, !!senhaError && styles.inputError]}
                value={senha}
                secureTextEntry
                editable={!isLoading}
                onChangeText={(text) => {
                  setSenha(text);
                  if (senhaError) setSenhaError('');
                }}
                onBlur={validateSenha}
              />
              {!!senhaError && <Text style={styles.errorText}>{senhaError}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Tipo de usuário</Text>
              <TouchableOpacity 
                style={[styles.dropdownButton, !!tipoUsuarioError && styles.dropdownButtonError]} 
                onPress={() => {
                  if(!isLoading) {
                    setIsDropdownOpen(!isDropdownOpen);
                    setIsSexoDropdownOpen(false); 
                  }
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
                      style={[styles.dropdownItem, tipoUsuario === item && styles.dropdownItemSelected]}
                      onPress={() => {
                        setTipoUsuario(item);
                        setIsDropdownOpen(false); 
                        validateTipoUsuario(item);
                      }}
                    >
                      <Text style={[styles.dropdownItemText, tipoUsuario === item && styles.dropdownItemTextSelected]}>
                        {item}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
              {!!tipoUsuarioError && <Text style={styles.errorText}>{tipoUsuarioError}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Sexo</Text>
              <TouchableOpacity 
                style={[styles.dropdownButton, !!sexoError && styles.dropdownButtonError]} 
                onPress={() => {
                  if(!isLoading) {
                    setIsSexoDropdownOpen(!isSexoDropdownOpen);
                    setIsDropdownOpen(false); 
                  }
                }}
                activeOpacity={0.8}
              >
                <Text style={[styles.dropdownButtonText, !sexo && styles.placeholderText]}>
                  {sexo ? sexo : 'Selecione...'}
                </Text>
                <Text style={styles.arrowIcon}>{isSexoDropdownOpen ? '▲' : '▼'}</Text>
              </TouchableOpacity>

              {isSexoDropdownOpen && (
                <View style={styles.dropdownList}>
                  {opcoesSexo.map((item) => (
                    <TouchableOpacity 
                      key={item} 
                      style={[styles.dropdownItem, sexo === item && styles.dropdownItemSelected]}
                      onPress={() => {
                        setSexo(item);
                        setIsSexoDropdownOpen(false); 
                        validateSexo(item);
                      }}
                    >
                      <Text style={[styles.dropdownItemText, sexo === item && styles.dropdownItemTextSelected]}>
                        {item}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
              {!!sexoError && <Text style={styles.errorText}>{sexoError}</Text>}
            </View>

            <View style={styles.loginSection}>
              <Text style={styles.alreadyHasAccountText}>Já possui conta?</Text>
              <TouchableOpacity 
                style={styles.secondaryButton}
                onPress={() => router.replace('/' as any)}
                disabled={isLoading}
              >
                <Text style={styles.secondaryButtonText}>Fazer login</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={[styles.primaryButton, isLoading && styles.buttonDisabled]} 
              onPress={handleRegister}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.primaryButtonText}>Cadastrar</Text>
              )}
            </TouchableOpacity>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// Definições de estilo
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
  buttonDisabled: {
    backgroundColor: '#D19EB8',
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