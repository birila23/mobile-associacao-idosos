import { Platform } from 'react-native';

interface ShadowOptions {
  color?: string;
  offsetX?: number;
  offsetY: number;
  opacity: number;
  radius: number;
  elevation: number;
}

/**
 * Returns the right shadow style per platform: `boxShadow` on web
 * (React Native Web deprecated the `shadow*` props in favor of it),
 * and the classic `shadow*` + `elevation` props on native.
 */
export function createShadow({
  color = '#000',
  offsetX = 0,
  offsetY,
  opacity,
  radius,
  elevation,
}: ShadowOptions) {
  if (Platform.OS === 'web') {
    const alphaHex = Math.round(opacity * 255)
      .toString(16)
      .padStart(2, '0');
    return {
      boxShadow: `${offsetX}px ${offsetY}px ${radius}px ${color}${alphaHex}`,
    };
  }

  return {
    shadowColor: color,
    shadowOffset: { width: offsetX, height: offsetY },
    shadowOpacity: opacity,
    shadowRadius: radius,
    elevation,
  };
}
