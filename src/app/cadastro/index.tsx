import axios from 'axios';
import { Stack, router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Button from '@/components/Button';
import Input from '@/components/Input';
import Select from '@/components/Select';
import { createUserSchema, type CreateUserDTO } from '@/validacao/usuario';

const TIPOS_USUARIO = ['coordenador', 'voluntario', 'familiar', 'enfermeiro'];
const OPCOES_SEXO = ['feminino', 'masculino'];

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

export default function RegisterScreen() {
  const [form, setForm] = useState<Partial<CreateUserDTO>>({});
  const [erros, setErros] = useState<Record<string, string>>({});

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSexoDropdownOpen, setIsSexoDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const setCampo = <K extends keyof CreateUserDTO>(campo: K, valor: CreateUserDTO[K]) => {
    setForm((prev) => ({ ...prev, [campo]: valor }));

    if (erros[campo]) {
      setErros((prev) => ({ ...prev, [campo]: '' }));
    }
  };

  const handleRegister = async () => {
    setApiError('');

    const result = createUserSchema.safeParse(form);

    if (!result.success) {
      const novosErros: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const campo = issue.path[0] as string;
        if (!novosErros[campo]) {
          novosErros[campo] = issue.message;
        }
      });
      setErros(novosErros);
      return;
    }

    setErros({});
    setIsLoading(true);

    try {
      const dadosEnvio = {
        ...result.data,
        telefone: result.data.telefone.replace(/\D/g, ''),
      };

      const response = await axios.post(
        'https://api-associacao-idosos.onrender.com/api/cadastrarUsuario',
        dadosEnvio
      );

      if (response.status === 200 || response.status === 201) {
        alert('Cadastro realizado com sucesso!');
        router.replace('/' as any);
      }
    } catch (error: any) {
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
              value={form.nome ?? ''}
              editable={!isLoading}
              onChangeText={(text) => setCampo('nome', text)}
              errorMessage={erros.nome}
            />

            <Input
              label="E-mail"
              value={form.email ?? ''}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!isLoading}
              onChangeText={(text) => setCampo('email', text)}
              errorMessage={erros.email}
            />

            <Input
              label="CPF"
              value={form.cpf ?? ''}
              keyboardType="numeric"
              editable={!isLoading}
              onChangeText={(text) => setCampo('cpf', formatCpf(text))}
              errorMessage={erros.cpf}
            />

            <Input
              label="Telefone"
              placeholder="(99) 99999-9999"
              value={form.telefone ?? ''}
              keyboardType="numeric"
              editable={!isLoading}
              onChangeText={(text) => setCampo('telefone', formatTelefone(text))}
              errorMessage={erros.telefone}
            />

            <Input
              label="Endereço Completo"
              value={form.endereco ?? ''}
              editable={!isLoading}
              onChangeText={(text) => setCampo('endereco', text)}
              errorMessage={erros.endereco}
            />

            <Input
              label="Senha"
              value={form.senha ?? ''}
              secureTextEntry
              editable={!isLoading}
              onChangeText={(text) => setCampo('senha', text)}
              errorMessage={erros.senha}
            />

            <Select
              label="Tipo de usuário"
              selectedValue={form.tipo ?? ''}
              options={TIPOS_USUARIO}
              isOpen={isDropdownOpen}
              placeholder="Selecione um tipo..."
              errorMessage={erros.tipo}
              disabled={isLoading}
              onToggle={() => {
                setIsDropdownOpen(!isDropdownOpen);
                setIsSexoDropdownOpen(false);
              }}
              onSelect={(item) => {
                setCampo('tipo', item as CreateUserDTO['tipo']);
                setIsDropdownOpen(false);
              }}
            />

            <Select
              label="Sexo"
              selectedValue={form.sexo ?? ''}
              options={OPCOES_SEXO}
              isOpen={isSexoDropdownOpen}
              errorMessage={erros.sexo}
              disabled={isLoading}
              onToggle={() => {
                setIsSexoDropdownOpen(!isSexoDropdownOpen);
                setIsDropdownOpen(false);
              }}
              onSelect={(item) => {
                setCampo('sexo', item as CreateUserDTO['sexo']);
                setIsSexoDropdownOpen(false);
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