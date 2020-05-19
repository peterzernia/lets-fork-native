import React from 'react'
import { Text as RNText, TextProps } from 'react-native'

type Props = TextProps & {
  children: string;
}

export default function Text(props: Props): React.ReactElement {
  const { children, style } = props

  return (
    <RNText
      style={[style, { fontFamily: 'Montserrat_600SemiBold' }]}
    >
      {children}
    </RNText>
  )
}
