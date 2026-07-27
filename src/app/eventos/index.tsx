import { Feather, Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { Stack, router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Image,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { SafeAreaView } from 'react-native-safe-area-context';

import { obterToken } from '@/services/token-storage';

LocaleConfig.locales['pt-br'] = {
  monthNames: [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ],
  monthNamesShort: [
    'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
    'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
  ],
  dayNames: [
    'Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'
  ],
  dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
  today: 'Hoje'
};
LocaleConfig.defaultLocale = 'pt-br';

interface Evento {
  _id: string;
  nome: string;
  descricao?: string;
  data: string;
  imagem?: string;
  local?: {
    type: string;
    coordinates: [number, number];
  };
}

export default function GerenciamentoEventosScreen() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [abaAtiva, setAbaAtiva] = useState<'lista' | 'calendario'>('lista');
  const [dataSelecionada, setDataSelecionada] = useState<string>('');

  const carregarEventos = async () => {
    try {
      const token = await obterToken();
      const response = await axios.get(
        'https://api-associacao-idosos.onrender.com/api/eventos', 
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (Array.isArray(response.data)) {
        setEventos(response.data);
      } else if (response.data?.eventos && Array.isArray(response.data.eventos)) {
        setEventos(response.data.eventos);
      } else {
        setEventos([]);
      }
    } catch (error: any) {
      console.log('Erro ao buscar eventos:', error.response?.data || error.message);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      carregarEventos();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    carregarEventos();
  };

  const formatarData = (dataIso: string) => {
    if (!dataIso) return '';
    const dataObj = new Date(dataIso);
    const dia = String(dataObj.getDate()).padStart(2, '0');
    const mes = String(dataObj.getMonth() + 1).padStart(2, '0');
    const ano = dataObj.getFullYear();
    const horas = String(dataObj.getHours()).padStart(2, '0');
    const minutos = String(dataObj.getMinutes()).padStart(2, '0');
    return `${dia}/${mes}/${ano} às ${horas}:${minutos}`;
  };

  const formatarDataBr = (dataString: string) => {
    if (!dataString) return '';
    const [ano, mes, dia] = dataString.split('-');
    return `${dia}/${mes}/${ano}`;
  };

  const handleVerDetalhes = (id: string) => {
    router.push(`/eventos/${id}` as any);
  };

  const handleExcluir = (id: string, nome: string, dataIso: string) => {
    const dataFormatada = formatarData(dataIso);
    router.push({
      pathname: `/eventos/${id}/deletar`,
      params: { nome, data: dataFormatada }
    } as any);
  };

  const handleEditar = (id: string) => {
    router.push(`/eventos/${id}/editar` as any);
  };

  const renderItemEvento = ({ item }: { item: Evento }) => {
    return (
      <TouchableOpacity 
        style={styles.cardEvento} 
        onPress={() => handleVerDetalhes(item._id)}
        activeOpacity={0.7}
      >
        <View style={styles.imagemContainer}>
          {item.imagem && item.imagem.startsWith('data:image') ? (
            <Image source={{ uri: item.imagem }} style={styles.imagemItem} />
          ) : (
            <View style={styles.imagemPlaceholder} />
          )}
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.tituloEvento} numberOfLines={1}>{item.nome}</Text>
          <Text style={styles.dataEvento}>{formatarData(item.data)}</Text>
          {item.descricao ? (
            <Text style={styles.descricaoEvento} numberOfLines={1}>{item.descricao}</Text>
          ) : null}
        </View>

        <View style={styles.acoesContainer}>
          <TouchableOpacity 
            onPress={(e) => {
              e.stopPropagation(); 
              handleEditar(item._id);
            }} 
            style={styles.btnAcao}
          >
            <Feather name="edit" size={18} color="#333" />
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={(e) => {
              e.stopPropagation();
              handleExcluir(item._id, item.nome, item.data);
            }} 
            style={[styles.btnAcao, { marginTop: 15 }]}
          >
            <Feather name="trash-2" size={18} color="#FF3B30" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const getMarkedDates = () => {
    const marks: Record<string, any> = {};

    eventos.forEach((evento) => {
      if (evento.data) {
        const dateStr = evento.data.split('T')[0];
            marks[dateStr] = {
            customStyles: {
                container: {
                borderBottomWidth: 5,       
                borderBottomColor: '#EE73A4',
                borderRadius: 1,            
                paddingBottom: 2,
                },
                text: {
                color: '#333',
                }
            }};
      }
    });

    if (dataSelecionada) {
      marks[dataSelecionada] = {
        ...marks[dataSelecionada],
        selected: true,
        selectedColor: '#EE73A4',
      };
    }

    return marks;
  };

  const eventosDoDia = eventos.filter((evento) =>
    evento.data && evento.data.startsWith(dataSelecionada)
  );

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* CABEÇALHO */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Gerenciamento de Eventos</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        {/* BOTÃO NOVO EVENTO */}
        <TouchableOpacity
          style={styles.novoEventoButton}
          onPress={() => router.push('/eventos/novo' as any)}
          activeOpacity={0.8}
        >
          <Text style={styles.novoEventoButtonText}>+ Novo Evento</Text>
        </TouchableOpacity>

        {/* ABAS: LISTA | CALENDÁRIO */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tabButton, abaAtiva === 'lista' ? styles.tabActive : styles.tabInactive]}
            onPress={() => setAbaAtiva('lista')}
          >
            <Feather name="list" size={18} color={abaAtiva === 'lista' ? '#000' : '#555'} />
            <Text style={[styles.tabText, abaAtiva === 'lista' ? styles.tabTextActive : styles.tabTextInactive]}>
              Lista
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, abaAtiva === 'calendario' ? styles.tabActive : styles.tabInactive]}
            onPress={() => setAbaAtiva('calendario')}
          >
            <Feather name="calendar" size={18} color={abaAtiva === 'calendario' ? '#000' : '#555'} />
            <Text style={[styles.tabText, abaAtiva === 'calendario' ? styles.tabTextActive : styles.tabTextInactive]}>
              Calendário
            </Text>
          </TouchableOpacity>
        </View>

        {/* ÁREA PRINCIPAL */}
        <View style={styles.mainWhiteCard}>
          {isLoading ? (
            <View style={styles.centeredView}>
              <ActivityIndicator size="large" color="#EE73A4" />
            </View>
          ) : abaAtiva === 'lista' ? (
            /* --- VISUALIZAÇÃO EM LISTA --- */
            eventos.length === 0 ? (
              <View style={styles.centeredView}>
                <Text style={styles.emptyText}>Nenhum evento cadastrado ainda.</Text>
              </View>
            ) : (
              <FlatList
                data={eventos}
                keyExtractor={(item) => item._id}
                renderItem={renderItemEvento}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContainer}
                refreshControl={
                  <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#EE73A4']} />
                }
              />
            )
          ) : (
            /* --- VISUALIZAÇÃO EM CALENDÁRIO --- */
            <View style={{ flex: 1 }}>
              <View style={styles.calendarWrapper}>
                <Calendar
                  markingType={'custom'}
                  onDayPress={(day: any) => setDataSelecionada(day.dateString)}
                  markedDates={getMarkedDates()}
                  theme={{
                    backgroundColor: '#F2F2F2',
                    calendarBackground: '#F2F2F2',
                    textSectionTitleColor: '#666',
                    selectedDayBackgroundColor: '#EE73A4',
                    selectedDayTextColor: '#ffffff',
                    todayTextColor: '#EE73A4',
                    dayTextColor: '#333',
                    textDisabledColor: '#ccc',
                    dotColor: '#EE73A4',
                    selectedDotColor: '#ffffff',
                    arrowColor: '#333',
                    monthTextColor: '#000',
                    textMonthFontWeight: 'bold',
                    textDayFontSize: 14,
                    textMonthFontSize: 16,
                  }}
                  style={{
                    borderRadius: 10,
                    padding: 5,
                  }}
                />
              </View>

              {/* Lista de Eventos do Dia Selecionado */}
              {dataSelecionada ? (
                <View style={styles.eventosDiaContainer}>
                  <Text style={styles.tituloEventosDia}>
                    Eventos em {formatarDataBr(dataSelecionada)}:
                  </Text>
                  {eventosDoDia.length > 0 ? (
                    <FlatList
                      data={eventosDoDia}
                      keyExtractor={(item) => item._id}
                      renderItem={renderItemEvento}
                      showsVerticalScrollIndicator={false}
                      contentContainerStyle={styles.listContainer}
                    />
                  ) : (
                    <Text style={styles.emptyText}>Nenhum evento nesta data.</Text>
                  )}
                </View>
              ) : (
                <View style={styles.centeredView}>
                  <Text style={styles.emptyText}>
                    Selecione um dia no calendário para ver os eventos.
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>
      </View>
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
    paddingBottom: 15,
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },

  content: {
    flex: 1,
    paddingHorizontal: 20,
  },

  novoEventoButton: {
    backgroundColor: '#EE73A4',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },

  novoEventoButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },

  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '47%',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },

  tabActive: {
    backgroundColor: '#FDECF2',
    borderColor: '#EE73A4',
  },

  tabInactive: {
    backgroundColor: '#F2F2F2',
    borderColor: '#CCC',
  },

  tabText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
  },

  tabTextActive: {
    color: '#333',
  },

  tabTextInactive: {
    color: '#666',
  },

  mainWhiteCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },

  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },

  emptyText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },

  listContainer: {
    paddingBottom: 20,
  },

  cardEvento: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },

  imagemContainer: {
    width: 60,
    height: 60,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#D9D9D9',
  },

  imagemItem: {
    width: '100%',
    height: '100%',
  },

  imagemPlaceholder: {
    flex: 1,
    backgroundColor: '#D9D9D9',
  },

  infoContainer: {
    flex: 1,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },

  tituloEvento: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },

  dataEvento: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },

  descricaoEvento: {
    fontSize: 12,
    color: '#666',
  },

  acoesContainer: {
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 5,
  },

  btnAcao: {
    padding: 5,
  },

  calendarWrapper: {
    backgroundColor: '#F2F2F2',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 15,
  },

  eventosDiaContainer: {
    flex: 1,
    marginTop: 10,
  },

  tituloEventosDia: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
});