import React from 'react'
import {
  Text as RNText, TextProps, Platform, StyleSheet,
} from 'react-native'

type Props = TextProps & {
  children: string;
}

// Custom Text component to add fontFamily/styling
export default function Text(props: Props): React.ReactElement {
  const { children, style } = props

  return (
    <RNText
      style={[style, styles.text]}
    >
      {children}
    </RNText>
  )
}

const styles = StyleSheet.create({
  text: {
    ...Platform.select({
      android: { fontFamily: 'Roboto' },
    }),
  },
})
