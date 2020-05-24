import { Platform } from 'react-native'

// eslint-disable-next-line import/prefer-default-export
export const BOTTOM_BAR_HEIGHT = Platform.OS === 'ios'
  ? 70
  : 50
