import React from 'react'
import { TouchableOpacity, Text, StyleSheet } from 'react-native'

type Props = {
  children: string;
  onPress: () => void;
}

export default function Button(props: Props): React.ReactElement {
  const { children, onPress } = props

  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.text}>{children}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    padding: 16,
    borderWidth: 1,
    borderRadius: 8,
    width: 110,
  },
  text: {
    textAlign: 'center',
  },
})
