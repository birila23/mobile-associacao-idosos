import { FormularioColors } from '@/constants/formularios-theme';
import { createShadow } from '@/utils/shadow';
import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ScreenHeaderProps {
  title: string;
  titleColor?: string;
  onBackPress?: () => void;
}

export function ScreenHeader({ title, titleColor, onBackPress }: ScreenHeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
      return;
    }
    if (router.canGoBack()) {
      router.back();
    }
  };

  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.backButton} onPress={handleBack} hitSlop={8}>
        <SymbolView
          name={{ ios: 'chevron.left', android: 'chevron_left', web: 'chevron_left' }}
          size={18}
          weight="semibold"
          tintColor={FormularioColors.text}
        />
      </TouchableOpacity>
      <Text style={[styles.title, titleColor ? { color: titleColor } : null]} numberOfLines={1}>
        {title}
      </Text>
      <View style={styles.spacer} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: FormularioColors.headerBackground,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: FormularioColors.border,
  },
  backButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: FormularioColors.card,
    alignItems: 'center',
    justifyContent: 'center',
    ...createShadow({ offsetY: 1, opacity: 0.15, radius: 2, elevation: 2 }),
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '700',
    color: FormularioColors.text,
  },
  spacer: {
    width: 34,
  },
});
