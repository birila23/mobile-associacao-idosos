import { obterToken } from '@/services/token-storage';
import { Feather, Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const MESES = [
  'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
  'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
];
const DIAS_SEMANA = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

const horasArray = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
const minutosArray = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

export default function EditarEventoScreen() {
  const { id } = useLocalSearchParams(); // Pega o ID da URL

  // Estados do Formulário
  const [nome, setNome] = useState('');
  const [dataDisplay, setDataDisplay] = useState('');
  const [descricao, setDescricao] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [imagemUri, setImagemUri] = useState<string | null>(null);
  
  // Estados de Carregamento
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Estados do DatePicker
  const [showPicker, setShowPicker] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedHour, setSelectedHour] = useState('16');
  const [selectedMinute, setSelectedMinute] = useState('00');

  useEffect(() => {
    if (selectedDay) {
      const diaStr = selectedDay.toString().padStart(2, '0');
      const mesStr = (currentMonth + 1).toString().padStart(2, '0');
      setDataDisplay(`${diaStr}/${mesStr}/${currentYear} ${selectedHour}:${selectedMinute}`);
    }
  }, [selectedDay, currentMonth, currentYear, selectedHour, selectedMinute]);

  useEffect(() => {
    const carregarEvento = async () => {
      try {
        const token = await obterToken();
        const response = await axios.get(
          `https://api-associacao-idosos.onrender.com/api/eventos/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const eventoEncontrado = response.data.evento || response.data;

        if (eventoEncontrado) {
          setNome(eventoEncontrado.nome);
          setDescricao(eventoEncontrado.descricao || '');
          
          if (eventoEncontrado.imagem) {
            setImagemUri(eventoEncontrado.imagem);
          }

          if (eventoEncontrado.local && eventoEncontrado.local.coordinates) {
            setLongitude(eventoEncontrado.local.coordinates[0].toString());
            setLatitude(eventoEncontrado.local.coordinates[1].toString());
          }

          if (eventoEncontrado.data) {
            const dateObj = new Date(eventoEncontrado.data);
            setCurrentYear(dateObj.getFullYear());
            setCurrentMonth(dateObj.getMonth());
            setSelectedDay(dateObj.getDate());
            setSelectedHour(dateObj.getHours().toString().padStart(2, '0'));
            setSelectedMinute(dateObj.getMinutes().toString().padStart(2, '0'));
          }
        }
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível carregar os dados do evento.');
        router.back();
      } finally {
        setIsLoadingData(false);
      }
    };

    if (id) {
      carregarEvento();
    }
  }, [id]);

  const handleEscolherArquivo = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permissão necessária', 'Permita o acesso à galeria.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });
    
    if (!result.canceled && result.assets[0]) {
      setImagemUri(result.assets[0].uri);
    }
  };

  const handleSalvarAlteracoes = async () => {
    if (!nome || nome.length < 3) {
      Alert.alert('Erro', 'O nome deve ter pelo menos 3 caracteres.');
      return;
    }
    if (!selectedDay || !latitude || !longitude) {
      Alert.alert('Erro', 'Preencha Data, Hora, Latitude e Longitude.');
      return;
    }

    const latNum = parseFloat(latitude.replace(',', '.'));
    const lngNum = parseFloat(longitude.replace(',', '.'));

    if (isNaN(latNum) || latNum < -90 || latNum > 90 || isNaN(lngNum) || lngNum < -180 || lngNum > 180) {
      Alert.alert('Erro', 'Coordenadas inválidas.');
      return;
    }

    setIsSaving(true);

    try {
      const token = await obterToken();
      const dataEvento = new Date(currentYear, currentMonth, selectedDay, parseInt(selectedHour), parseInt(selectedMinute));

      const formData = new FormData();
      formData.append('nome', nome);
      if (descricao) formData.append('descricao', descricao);
      formData.append('data', dataEvento.toISOString());
      
      formData.append('local', JSON.stringify({
        type: 'Point',
        coordinates: [lngNum, latNum]
      }));

      if (imagemUri && !imagemUri.startsWith('http')) {
        const filename = imagemUri.split('/').pop();
        const match = /\.(\w+)$/.exec(filename || '');
        const type = match ? `image/${match[1]}` : `image/jpeg`;
        
        formData.append('imagem', { 
          uri: imagemUri, 
          name: filename || 'imagem.jpg', 
          type 
        } as any);
      }

      await axios.put(
        `https://api-associacao-idosos.onrender.com/api/eventos/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      Alert.alert('Sucesso', 'Evento atualizado com sucesso!');
      router.back();
    } catch (error: any) {
      console.log('Erro ao atualizar evento:', error.response?.data || error.message);
      Alert.alert('Erro', error.response?.data?.message || 'Não foi possível salvar as alterações.');
    } finally {
      setIsSaving(false);
    }
  };

  // Funções do Calendário
  const prevMonth = () => { currentMonth === 0 ? (setCurrentMonth(11), setCurrentYear(currentYear - 1)) : setCurrentMonth(currentMonth - 1); };
  const nextMonth = () => { currentMonth === 11 ? (setCurrentMonth(0), setCurrentYear(currentYear + 1)) : setCurrentMonth(currentMonth + 1); };
  const handleHoje = () => { const hoje = new Date(); setCurrentYear(hoje.getFullYear()); setCurrentMonth(hoje.getMonth()); setSelectedDay(hoje.getDate()); setSelectedHour(hoje.getHours().toString().padStart(2, '0')); setSelectedMinute(hoje.getMinutes().toString().padStart(2, '0')); };
  const handleLimpar = () => { setSelectedDay(null); setDataDisplay(''); setShowPicker(false); };

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
        <Text style={styles.headerTitle}>Editar Evento</Text>
        <View style={{ width: 38 }} />
      </View>

      {isLoadingData ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#00A859" />
          <Text style={{ marginTop: 10 }}>Carregando evento...</Text>
        </View>
      ) : (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
            <View style={styles.formCard}>
              
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Nome do Evento</Text>
                <TextInput style={styles.input} value={nome} onChangeText={setNome} placeholder="Nome do evento" />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Data e Hora</Text>
                <TouchableOpacity 
                  style={[styles.inputWithIcon, showPicker && styles.inputWithIconActive]} 
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
                  <Feather name="calendar" size={20} color="#666" />
                </TouchableOpacity>
              </View>

              {showPicker && (
                <View style={styles.pickerContainer}>
                  <View style={styles.calendarSection}>
                    <View style={styles.calendarHeader}>
                      <Text style={styles.calendarMonthText}>{MESES[currentMonth]} de {currentYear}</Text>
                      <View style={styles.calendarArrows}>
                        <TouchableOpacity onPress={prevMonth} style={styles.arrowBtn}><Feather name="arrow-up" size={18} color="#666" /></TouchableOpacity>
                        <TouchableOpacity onPress={nextMonth} style={styles.arrowBtn}><Feather name="arrow-down" size={18} color="#666" /></TouchableOpacity>
                      </View>
                    </View>
                    <View style={styles.weekDaysRow}>
                      {DIAS_SEMANA.map((d, i) => <Text key={i} style={styles.weekDayText}>{d}</Text>)}
                    </View>
                    <View style={styles.daysGrid}>
                      {gerarDias().map((item, index) => {
                        const isSelected = item.atual && item.dia === selectedDay;
                        return (
                          <TouchableOpacity
                            key={index}
                            style={[styles.dayCell, isSelected && styles.dayCellSelected]}
                            onPress={() => item.atual && setSelectedDay(item.dia)}
                            disabled={!item.atual}
                          >
                            <Text style={[styles.dayText, !item.atual && styles.dayTextDisabled, isSelected && styles.dayTextSelected]}>
                              {item.dia}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                    <View style={styles.calendarFooter}>
                      <TouchableOpacity onPress={handleLimpar}><Text style={styles.footerActionText}>Limpar</Text></TouchableOpacity>
                      <TouchableOpacity onPress={handleHoje}><Text style={styles.footerActionText}>Hoje</Text></TouchableOpacity>
                    </View>
                  </View>
                  <View style={styles.timeSection}>
                    <View style={styles.timeHeader}>
                      <View style={styles.timeSquare}><Text style={styles.timeSquareText}>{selectedHour}</Text></View>
                      <View style={styles.timeSquare}><Text style={styles.timeSquareText}>{selectedMinute}</Text></View>
                    </View>
                    <View style={styles.timeListsContainer}>
                      <ScrollView style={styles.timeScroll} showsVerticalScrollIndicator={false}>
                        {horasArray.map((hr) => (
                          <TouchableOpacity key={hr} onPress={() => setSelectedHour(hr)}>
                            <Text style={[styles.timeListItem, selectedHour === hr && styles.timeListItemSelected]}>{hr}</Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                      <ScrollView style={styles.timeScroll} showsVerticalScrollIndicator={false}>
                        {minutosArray.map((min) => (
                          <TouchableOpacity key={min} onPress={() => setSelectedMinute(min)}>
                            <Text style={[styles.timeListItem, selectedMinute === min && styles.timeListItemSelected]}>{min}</Text>
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
                    <TextInput style={[styles.input, styles.textArea]} value={descricao} onChangeText={setDescricao} multiline numberOfLines={4} textAlignVertical="top" />
                  </View>

                  <View style={styles.row}>
                    <View style={[styles.inputGroup, styles.halfInput]}>
                      <Text style={styles.label}>Latitude</Text>
                      <TextInput style={styles.input} placeholder="-7.1189" keyboardType="numeric" value={latitude} onChangeText={setLatitude} />
                    </View>
                    <View style={[styles.inputGroup, styles.halfInput]}>
                      <Text style={styles.label}>Longitude</Text>
                      <TextInput style={styles.input} placeholder="-24.983" keyboardType="numeric" value={longitude} onChangeText={setLongitude} />
                    </View>
                  </View>
                </>
              )}

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Imagem do Evento (opcional)</Text>
                <View style={styles.filePickerRow}>
                  <TouchableOpacity style={styles.fileButton} onPress={handleEscolherArquivo}>
                    <Text style={styles.fileButtonText}>Escolher arquivo</Text>
                  </TouchableOpacity>
                  <Text style={styles.fileNameText} numberOfLines={1}>
                    {imagemUri ? 'Imagem anexada' : 'Nenhum arquivo escolhido'}
                  </Text>
                </View>
                {imagemUri && (
                  <View style={styles.previewContainer}>
                    <Image source={{ uri: imagemUri }} style={styles.imagePreview} />
                    <TouchableOpacity onPress={() => setImagemUri(null)}>
                      <Text style={styles.removeImageText}>Remover imagem</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>

              <View style={styles.submitContainer}>
                <TouchableOpacity style={styles.submitButton} onPress={handleSalvarAlteracoes} disabled={isSaving}>
                  <Text style={styles.submitButtonText}>{isSaving ? 'Salvando...' : 'Salvar Alterações'}</Text>
                </TouchableOpacity>
              </View>

            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D9D9D9',
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  halfInput: {
    width: '48%',
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
});