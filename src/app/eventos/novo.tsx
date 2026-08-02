import { obterToken } from '@/services/token-storage';
import { eventoSchema } from '@/validacao/eventos';
import { Feather, Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { Stack, router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Map from '@/components/eventos/Map';

const MESES = [
  'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
  'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
];
const DIAS_SEMANA = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

const horasArray = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
const minutosArray = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

export default function NovoEventoScreen() {
  const [nome, setNome] = useState('');
  const [dataDisplay, setDataDisplay] = useState('');
  const [descricao, setDescricao] = useState('');
  
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [isMapVisible, setIsMapVisible] = useState(false);
  const [mapRegion, setMapRegion] = useState({
    latitude: -7.2016,
    longitude: -39.3180,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  const [imagemUri, setImagemUri] = useState<string | null>(null);
  const [imagemBase64, setImagemBase64] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [showPicker, setShowPicker] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedHour, setSelectedHour] = useState('16');
  const [selectedMinute, setSelectedMinute] = useState('00');

  const [erros, setErros] = useState<Record<string, string>>({});

  const limparErro = (campo: string) => {
    if (erros[campo]) {
      setErros((prev) => {
        const novos = { ...prev };
        delete novos[campo];
        return novos;
      });
    }
  };

  useEffect(() => {
    if (selectedDay) {
      const diaStr = selectedDay.toString().padStart(2, '0');
      const mesStr = (currentMonth + 1).toString().padStart(2, '0');
      setDataDisplay(`${diaStr}/${mesStr}/${currentYear} ${selectedHour}:${selectedMinute}`);
    } else {
      setDataDisplay('');
    }
  }, [selectedDay, currentMonth, currentYear, selectedHour, selectedMinute]);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão negada', 'Não foi possível acessar sua localização atual.');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setMapRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    })();
  }, []);

  useEffect(() => {
    if (Platform.OS === 'web') {
      const handleMessage = (event: any) => {
        if (event.data && event.data.type === 'MAP_CLICK') {
          setLatitude(event.data.latitude.toString());
          setLongitude(event.data.longitude.toString());
          limparErro('local');
        }
      };
      window.addEventListener('message', handleMessage);
      return () => window.removeEventListener('message', handleMessage);
    }
  }, []);

  const handleEscolherArquivo = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('Permissão necessária', 'É necessário permitir o acesso à galeria de fotos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
      base64: true,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      setImagemUri(asset.uri);
      if (asset.base64) {
        setImagemBase64(`data:image/jpeg;base64,${asset.base64}`);
      }
    }
  };

  const handleCriarEvento = async () => {
    const latNum = latitude ? parseFloat(latitude.replace(',', '.')) : NaN;
    const lngNum = longitude ? parseFloat(longitude.replace(',', '.')) : NaN;

    const dataEvento = selectedDay
      ? new Date(
          currentYear,
          currentMonth,
          selectedDay,
          parseInt(selectedHour, 10),
          parseInt(selectedMinute, 10)
        )
      : undefined;

    const rawData = {
      nome,
      descricao: descricao || undefined,
      data: dataEvento,
      imagem: imagemBase64 || undefined,
      local: {
        type: 'Point',
        coordinates: [lngNum, latNum],
      },
    };

    // Validação pelo Zod
    const result = eventoSchema.safeParse(rawData);

    if (!result.success) {
      const novosErros: Record<string, string> = {};

      result.error.issues.forEach((issue) => {
        const path = issue.path.join('.');

        if (path === 'nome' && !novosErros.nome) {
          novosErros.nome = issue.message;
        }
        if (path === 'data' && !novosErros.data) {
          novosErros.data = issue.message;
        }
        if (path.startsWith('local') && !novosErros.local) {
          novosErros.local = 'Selecione a localização no mapa';
        }
      });
  
      setErros(novosErros);
      return;
    }

    setErros({});
    setIsLoading(true);

    try {
      const token = await obterToken();
      if (!token) {
        Alert.alert('Erro', 'Sessão inválida. Faça login novamente.');
        setIsLoading(false);
        return;
      }

      const payload = {
        nome: result.data.nome,
        descricao: result.data.descricao,
        data: result.data.data.toISOString(),
        imagem: result.data.imagem,
        local: result.data.local,
      };

      const response = await axios.post(
        'https://api-associacao-idosos.onrender.com/api/cadastroEvento',
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        Alert.alert('Sucesso', 'Evento criado com sucesso!');
        router.back();
      }
    } catch (error: any) {
      console.log('Erro ao criar evento:', error.response?.data || error.message);
      const apiMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Verifique os dados preenchidos e tente novamente.';
      Alert.alert('Erro no cadastro', apiMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Funções do Calendário
  const prevMonth = () =>
    currentMonth === 0
      ? (setCurrentMonth(11), setCurrentYear(currentYear - 1))
      : setCurrentMonth(currentMonth - 1);
  const nextMonth = () =>
    currentMonth === 11
      ? (setCurrentMonth(0), setCurrentYear(currentYear + 1))
      : setCurrentMonth(currentMonth + 1);

  const handleHoje = () => {
    const hoje = new Date();
    setCurrentYear(hoje.getFullYear());
    setCurrentMonth(hoje.getMonth());
    setSelectedDay(hoje.getDate());
    setSelectedHour(hoje.getHours().toString().padStart(2, '0'));
    setSelectedMinute(hoje.getMinutes().toString().padStart(2, '0'));
    limparErro('data');
  };

  const handleLimpar = () => {
    setSelectedDay(null);
    setDataDisplay('');
    setShowPicker(false);
  };

  const gerarDias = () => {
    const diasNoMes = new Date(currentYear, currentMonth + 1, 0).getDate();
    const primeiroDia = new Date(currentYear, currentMonth, 1).getDay();
    const diasMesAnterior = new Date(currentYear, currentMonth, 0).getDate();
    let dias = [];
    for (let i = primeiroDia - 1; i >= 0; i--) dias.push({ dia: diasMesAnterior - i, atual: false });
    for (let i = 1; i <= diasNoMes; i++) dias.push({ dia: i, atual: true });
    const restante = 42 - dias.length;
    for (let i = 1; i <= restante; i++) dias.push({ dia: i, atual: false });
    return dias;
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Novo Evento</Text>
        <View style={{ width: 38 }} />
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.formCard}>
            
            {/* Nome do Evento */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Nome do Evento <Text style={styles.asterisco}>*</Text>
              </Text>
              <TextInput
                style={[styles.input, !!erros.nome && styles.inputError]}
                value={nome}
                onChangeText={(texto) => {
                  setNome(texto);
                  limparErro('nome');
                }}
                placeholder="Nome do evento"
              />
              {!!erros.nome && <Text style={styles.errorText}>{erros.nome}</Text>}
            </View>

            {/* Data e Hora */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Data e Hora <Text style={styles.asterisco}>*</Text>
              </Text>
              <TouchableOpacity
                style={[
                  styles.inputWithIcon,
                  showPicker && styles.inputWithIconActive,
                  !!erros.data && styles.inputError,
                ]}
                onPress={() => setShowPicker(!showPicker)}
                activeOpacity={0.8}
              >
                <TextInput
                  style={styles.inputIconText}
                  placeholder="dd/mm/aaaa --:--"
                  placeholderTextColor="#999"
                  value={dataDisplay}
                  editable={false}
                  pointerEvents="none"
                />
                <Feather name="calendar" size={20} color={erros.data ? '#FF3B30' : '#666'} />
              </TouchableOpacity>
              {!!erros.data && <Text style={styles.errorText}>{erros.data}</Text>}
            </View>

            {/* Calendário */}
            {showPicker && (
              <View style={styles.pickerContainer}>
                <View style={styles.calendarSection}>
                  <View style={styles.calendarHeader}>
                    <Text style={styles.calendarMonthText}>
                      {MESES[currentMonth]} de {currentYear}
                    </Text>
                    <View style={styles.calendarArrows}>
                      <TouchableOpacity onPress={prevMonth} style={styles.arrowBtn}>
                        <Feather name="arrow-up" size={18} color="#666" />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={nextMonth} style={styles.arrowBtn}>
                        <Feather name="arrow-down" size={18} color="#666" />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={styles.weekDaysRow}>
                    {DIAS_SEMANA.map((d, i) => (
                      <Text key={i} style={styles.weekDayText}>{d}</Text>
                    ))}
                  </View>
                  <View style={styles.daysGrid}>
                    {gerarDias().map((item, index) => {
                      const isSelected = item.atual && item.dia === selectedDay;
                      return (
                        <TouchableOpacity
                          key={index}
                          style={[styles.dayCell, isSelected && styles.dayCellSelected]}
                          onPress={() => {
                            if (item.atual) {
                              setSelectedDay(item.dia);
                              limparErro('data');
                            }
                          }}
                          disabled={!item.atual}
                        >
                          <Text
                            style={[
                              styles.dayText,
                              !item.atual && styles.dayTextDisabled,
                              isSelected && styles.dayTextSelected,
                            ]}
                          >
                            {item.dia}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                  <View style={styles.calendarFooter}>
                    <TouchableOpacity onPress={handleLimpar}>
                      <Text style={styles.footerActionText}>Limpar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleHoje}>
                      <Text style={styles.footerActionText}>Hoje</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.timeSection}>
                  <View style={styles.timeHeader}>
                    <View style={styles.timeSquare}>
                      <Text style={styles.timeSquareText}>{selectedHour}</Text>
                    </View>
                    <View style={styles.timeSquare}>
                      <Text style={styles.timeSquareText}>{selectedMinute}</Text>
                    </View>
                  </View>
                  <View style={styles.timeListsContainer}>
                    <ScrollView style={styles.timeScroll} showsVerticalScrollIndicator={false}>
                      {horasArray.map((hr) => (
                        <TouchableOpacity
                          key={hr}
                          onPress={() => {
                            setSelectedHour(hr);
                            limparErro('data');
                          }}
                        >
                          <Text
                            style={[
                              styles.timeListItem,
                              selectedHour === hr && styles.timeListItemSelected,
                            ]}
                          >
                            {hr}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                    <ScrollView style={styles.timeScroll} showsVerticalScrollIndicator={false}>
                      {minutosArray.map((min) => (
                        <TouchableOpacity
                          key={min}
                          onPress={() => {
                            setSelectedMinute(min);
                            limparErro('data');
                          }}
                        >
                          <Text
                            style={[
                              styles.timeListItem,
                              selectedMinute === min && styles.timeListItemSelected,
                            ]}
                          >
                            {min}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                </View>
              </View>
            )}

            {!showPicker && (
              <>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Descrição</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    value={descricao}
                    onChangeText={setDescricao}
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                  />
                </View>

                {/* Localização */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>
                    Local do Evento <Text style={styles.asterisco}>*</Text>
                  </Text>
                  <TouchableOpacity
                    style={[styles.mapButton, !!erros.local && styles.inputError]}
                    onPress={() => {
                      setIsMapVisible(true);
                      limparErro('local');
                    }}
                  >
                    <Feather name="map-pin" size={18} color={erros.local ? '#FF3B30' : '#0066CC'} />
                    <Text style={[styles.mapButtonText, !!erros.local && { color: '#FF3B30' }]}>
                      {latitude && longitude ? 'Local Selecionado (Alterar)' : 'Selecionar no Mapa'}
                    </Text>
                  </TouchableOpacity>
                  {!!erros.local && <Text style={styles.errorText}>{erros.local}</Text>}
                </View>
              </>
            )}

            {/* Imagem do Evento */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Imagem do Evento (opcional)</Text>
              <View style={styles.filePickerRow}>
                <TouchableOpacity style={styles.fileButton} onPress={handleEscolherArquivo}>
                  <Text style={styles.fileButtonText}>Escolher arquivo</Text>
                </TouchableOpacity>
                <Text style={styles.fileNameText} numberOfLines={1}>
                  {imagemUri ? 'Imagem selecionada' : 'Nenhum arquivo escolhido'}
                </Text>
              </View>

              {imagemUri && (
                <View style={styles.previewContainer}>
                  <Image source={{ uri: imagemUri }} style={styles.imagePreview} />
                  <TouchableOpacity
                    onPress={() => {
                      setImagemUri(null);
                      setImagemBase64(null);
                    }}
                  >
                    <Text style={styles.removeImageText}>Remover imagem</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            <View style={styles.submitContainer}>
              <TouchableOpacity style={styles.submitButton} onPress={handleCriarEvento} disabled={isLoading}>
                <Text style={styles.submitButtonText}>{isLoading ? 'Criando...' : 'Criar Evento'}</Text>
              </TouchableOpacity>
            </View>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* MODAL DO MAPA */}
      <Modal visible={isMapVisible} animationType="slide" onRequestClose={() => setIsMapVisible(false)}>
        <SafeAreaView style={{ flex: 1, backgroundColor: '#FFF' }}>
          <View style={styles.mapHeader}>
            <TouchableOpacity onPress={() => setIsMapVisible(false)} style={{ padding: 10 }}>
              <Ionicons name="close" size={24} color="#000" />
            </TouchableOpacity>
            <Text style={styles.mapTitle}>Selecione o Local</Text>
            <TouchableOpacity onPress={() => setIsMapVisible(false)} style={{ padding: 10 }}>
              <Text style={styles.confirmMapButton}>Confirmar</Text>
            </TouchableOpacity>
          </View>
          
          <View style={{ flex: 1 }}>
            <Map 
              region={mapRegion}
              latitude={latitude}
              longitude={longitude}
              onPress={(e: any) => {
                if (Platform.OS !== 'web' && e.nativeEvent) {
                  const coords = e.nativeEvent.coordinate;
                  setLatitude(coords.latitude.toString());
                  setLongitude(coords.longitude.toString());
                  limparErro('local');
                }
              }}
            />
          </View>
                    
          <View style={styles.mapInstruction}>
            <Text style={styles.mapInstructionText}>Toque no mapa para marcar o local do evento.</Text>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D9D9D9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    elevation: 4,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 6,
  },
  asterisco: {
    color: '#FF3B30',
  },
  input: {
    backgroundColor: '#F2F2F2',
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: '#333',
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F2',
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  inputWithIconActive: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  inputIconText: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 15,
    color: '#333',
  },
  inputError: {
    borderColor: '#FF3B30',
    borderWidth: 1.5,
  },
  errorText: {
    fontSize: 11,
    color: '#FF3B30',
    marginTop: 4,
    fontWeight: '500',
  },
  pickerContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#CCC',
    borderTopWidth: 0,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    height: 320,
    marginTop: -15,
    marginBottom: 15,
  },
  calendarSection: {
    flex: 1.6,
    borderRightWidth: 1,
    borderColor: '#E5E5E5',
    padding: 10,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  calendarMonthText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#000',
  },
  calendarArrows: {
    flexDirection: 'row',
  },
  arrowBtn: {
    paddingHorizontal: 6,
  },
  weekDaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  weekDayText: {
    fontSize: 12,
    color: '#333',
    fontWeight: 'bold',
    width: '14.2%',
    textAlign: 'center',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.2%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
  },
  dayCellSelected: {
    backgroundColor: '#007BFF',
  },
  dayText: {
    fontSize: 13,
    color: '#333',
  },
  dayTextDisabled: {
    color: '#CCC',
  },
  dayTextSelected: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  calendarFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 'auto',
  },
  footerActionText: {
    color: '#007BFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
  timeSection: {
    flex: 1,
    padding: 10,
  },
  timeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  timeSquare: {
    backgroundColor: '#007BFF',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 2,
  },
  timeSquareText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  timeListsContainer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
  },
  timeScroll: {
    flex: 1,
  },
  timeListItem: {
    textAlign: 'center',
    paddingVertical: 8,
    fontSize: 14,
    color: '#555',
  },
  timeListItemSelected: {
    color: '#000',
    fontWeight: 'bold',
  },
  textArea: {
    minHeight: 100,
  },
  filePickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  fileButton: {
    backgroundColor: '#E0F0FF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#B3D8FF',
  },
  fileButtonText: {
    color: '#0066CC',
    fontSize: 13,
    fontWeight: '600',
  },
  fileNameText: {
    marginLeft: 10,
    fontSize: 13,
    color: '#777',
    flex: 1,
  },
  previewContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  removeImageText: {
    color: '#D9534F',
    fontSize: 12,
    marginTop: 5,
    fontWeight: 'bold',
  },
  submitContainer: {
    alignItems: 'flex-end',
    marginTop: 10,
  },
  submitButton: {
    backgroundColor: '#00A859',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  mapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0F0FF',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#B3D8FF',
  },
  mapButtonText: {
    marginLeft: 10,
    color: '#0066CC',
    fontSize: 15,
    fontWeight: '600',
  },
  mapHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  mapTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  confirmMapButton: {
    color: '#00A859',
    fontSize: 16,
    fontWeight: 'bold',
  },
  mapInstruction: {
    padding: 15,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#EEE',
  },
  mapInstructionText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#555',
  },
});