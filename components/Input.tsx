import React from 'react'
import { TextInput, StyleSheet } from 'react-native'

type Props = {
  handleChange: React.Dispatch<React.SetStateAction<string>>;
  value: string;
}

export default function Input(props: Props): React.ReactElement {
  const { handleChange, value } = props

  return (
    <TextInput
      onChangeText={handleChange}
      style={styles.input}
      value={value}
    />
  )
}

const styles = StyleSheet.create({
  input: {
    borderColor: 'gray',
    borderWidth: 1,
    height: 40,
    width: 300,
  },
})
