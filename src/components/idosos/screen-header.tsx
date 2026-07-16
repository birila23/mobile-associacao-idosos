import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { createShadow } from '@/utils/shadow';
import { IdososColors } from '@/constants/idosos-theme';

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
          tintColor={IdososColors.text}
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
    backgroundColor: IdososColors.headerBackground,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: IdososColors.border,
  },
  backButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: IdososColors.card,
    alignItems: 'center',
    justifyContent: 'center',
    ...createShadow({ offsetY: 1, opacity: 0.15, radius: 2, elevation: 2 }),
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '700',
    color: IdososColors.text,
  },
  spacer: {
    width: 34,
  },
});
