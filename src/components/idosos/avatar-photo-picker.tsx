import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';
import { SymbolView } from 'expo-symbols';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { IdososColors } from '@/constants/idosos-theme';

interface AvatarPhotoPickerProps {
  uri?: string;
  size?: number;
  editable?: boolean;
  onChangeUri?: (uri: string) => void;
}

/**
 * Circular avatar. When `editable` it behaves like a tappable photo picker
 * (used on the Novo/Editar idoso forms) and opens the device's photo
 * library via `expo-image-picker`; otherwise it's a read-only avatar
 * (used on the list and on the perfil screen).
 */
export function AvatarPhotoPicker({ uri, size = 88, editable = false, onChangeUri }: AvatarPhotoPickerProps) {
  const dimensionStyle = { width: size, height: size, borderRadius: size / 2 };
  const iconSize = Math.round(size * 0.5);

  const escolherFoto = async () => {
    const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissao.granted) {
      Alert.alert('Permissão necessária', 'Autorize o acesso às fotos para escolher a foto do idoso.');
      return;
    }

    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!resultado.canceled && resultado.assets[0]) {
      onChangeUri?.(resultado.assets[0].uri);
    }
  };

  const content = (
    <View style={[styles.circle, dimensionStyle]}>
      {uri ? (
        <Image source={{ uri }} style={dimensionStyle} contentFit="cover" />
      ) : (
        <SymbolView
          name={{ ios: 'person.fill', android: 'person', web: 'person' }}
          size={iconSize}
          tintColor={IdososColors.placeholder}
        />
      )}
      {editable && (
        <View style={styles.editBadge}>
          <SymbolView
            name={{ ios: 'camera.fill', android: 'photo_camera', web: 'photo_camera' }}
            size={13}
            tintColor="#FFFFFF"
          />
        </View>
      )}
    </View>
  );

  if (!editable) {
    return content;
  }

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity onPress={escolherFoto} activeOpacity={0.8}>
        {content}
      </TouchableOpacity>
      <Text style={styles.helperText}>Toque para escolher uma foto</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    marginBottom: 8,
  },
  circle: {
    backgroundColor: '#EDEDED',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: IdososColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  helperText: {
    marginTop: 8,
    fontSize: 13,
    color: IdososColors.textSecondary,
  },
});
