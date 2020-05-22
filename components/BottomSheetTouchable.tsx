import React from 'react'
import { Platform, TouchableOpacity, TouchableOpacityProps } from 'react-native'
import { TouchableOpacity as RNGHTouchableOpacity } from 'react-native-gesture-handler'

type Props = TouchableOpacityProps & {
  children: React.ReactNode;
}

// Required for react-native-scroll-bottom-sheet
// https://github.com/rgommezz/react-native-scroll-bottom-sheet
export default function BottomSheetTouchable(props: Props): React.ReactElement {
  if (Platform.OS === 'android') {
    return (
      <RNGHTouchableOpacity {...props} />
    )
  }

  return <TouchableOpacity {...props} />
}
