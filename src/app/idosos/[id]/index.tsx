import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AvatarPhotoPicker } from '@/components/idosos/avatar-photo-picker';
import { InfoRow } from '@/components/info-row';
import { ScreenHeader } from '@/components/screen-header';
import { FormularioColors } from '@/constants/formularios-theme';
import { Perfil } from '@/constants/perfil-theme';
import { useIdosos } from '@/contexts/idosos-context';
import { extrairMensagemErro } from '@/services/api-client';
import { formatarDataExibicao } from '@/utils/date';

export default function PerfilIdosoScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getIdoso, buscarIdosoRemoto } = useIdosos();
  const idosoDaLista = getIdoso(id);
  const [idoso, setIdoso] = useState(idosoDaLista);
  const [buscando, setBuscando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    setBuscando(true);
    buscarIdosoRemoto(id)
      .then((idosoCompleto) => {
        setIdoso(idosoCompleto);
      })
      .catch((e) => setErro(extrairMensagemErro(e, 'Idoso não encontrado.')))
      .finally(() => setBuscando(false));
  }, [id]);
  
  if (buscando) {
    return (
      <SafeAreaView style={Perfil.container} edges={['top']}>
        <ScreenHeader title="Perfil do idoso" />
        <View style={Perfil.body}>
          <ActivityIndicator color={FormularioColors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!idoso) {
    return (
      <SafeAreaView style={Perfil.container} edges={['top']}>
        <ScreenHeader title="Perfil do idoso" />
        <View style={Perfil.body}>
          <Text style={Perfil.notFoundText}>{erro ?? 'Idoso não encontrado.'}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={Perfil.container} edges={['top']}>
      <ScreenHeader title="Perfil do idoso" />

      <ScrollView contentContainerStyle={Perfil.body}>
        <View style={Perfil.card}>
          <View style={Perfil.avatarSection}>
            <AvatarPhotoPicker uri={idoso.foto} size={88} />
            <Text style={Perfil.nome}>{idoso.nome}</Text>
          </View>

          <InfoRow label="CPF" value={idoso.cpf} />
          <InfoRow label="RG" value={idoso.rg} />
          <InfoRow label="Data de emissão do RG" value={formatarDataExibicao(idoso.dataEmissaoRg) ?? '-'} />
          <InfoRow label="Órgão Emissor de RG" value={idoso.orgaoEmissorRg} />
          <InfoRow label="SUS" value={idoso.sus} />
          <InfoRow label="Data de nascimento" value={formatarDataExibicao(idoso.dataNascimento) ?? '-'} />
          <InfoRow label="Sexo" value={idoso.sexo === 'feminino' ? 'Feminino' : idoso.sexo === 'masculino' ? 'Masculino' : '-'} />
          <InfoRow label="Naturalidade" value={idoso.naturalidade} />
          <InfoRow label="Nacionalidade" value={idoso.nacionalidade} />

          <View style={Perfil.actionsRow}>
            <TouchableOpacity
              style={Perfil.updateButton}
              activeOpacity={0.85}
              onPress={() => router.push({ pathname: '/idosos/[id]/editar', params: { id: idoso.id } })}
            >
              <Text style={Perfil.actionButtonText}>Atualizar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={Perfil.deleteButton}
              activeOpacity={0.85}
              onPress={() => router.push({ pathname: '/idosos/[id]/deletar', params: { id: idoso.id } })}
            >
              <Text style={Perfil.actionButtonText}>Deletar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
