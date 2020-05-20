import React from 'react'
import { Text as RNText, TextProps } from 'react-native'

type Props = TextProps & {
  children: string;
}

// Custom Text component to add fontFamily/styling
export default function Text(props: Props): React.ReactElement {
  const { children, style } = props

  return (
    <RNText
      style={style}
    >
      {children}
    </RNText>
  )
}
