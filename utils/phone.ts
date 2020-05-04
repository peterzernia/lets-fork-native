import { Alert, Linking, Platform } from 'react-native'

// eslint-disable-next-line import/prefer-default-export
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
