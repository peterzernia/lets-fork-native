import React from 'react'
import { TouchableHighlight, Text } from 'react-native'

type Props = {
  children: string;
  onPress: () => void;
}

export default function Button(props: Props): React.ReactElement {
  const { children, onPress } = props

  return (
    <TouchableHighlight onPress={onPress}>
      <Text>{children}</Text>
    </TouchableHighlight>
  )
}
