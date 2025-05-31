import { Platform } from 'react-native';

export function usePlatform() {
  const isWeb = Platform.OS === 'web';
  const isAndroid = Platform.OS === 'android';
  const isIOS = Platform.OS === 'ios';

  return {
    isWeb,
    isAndroid,
    isIOS,
  };
}
