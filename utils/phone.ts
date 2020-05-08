import {
  Alert, Linking, Platform, NativeModules,
} from 'react-native'

export const call = (phone: string): void => {
  let phoneNumber: string
  if (Platform.OS !== 'android') {
    phoneNumber = `telprompt:${phone}`
  } else {
    phoneNumber = `tel:${phone}`
  }
  Linking.canOpenURL(phoneNumber)
    .then((supported) => {
      if (!supported) {
        Alert.alert('Phone number is not available')
      } else {
        return Linking.openURL(phoneNumber)
      }
      return null
    })
    .catch((err) => console.log(err))
}

export const getLocale = () => (Platform.OS === 'ios'
  ? NativeModules.SettingsManager.settings.AppleLocale
    || NativeModules.SettingsManager.settings.AppleLanguages[0] // iOS 13
  : NativeModules.I18nManager.localeIdentifier)
