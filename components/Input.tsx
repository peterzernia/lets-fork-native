import React from 'react'
import { TextInput, StyleSheet, KeyboardTypeOptions } from 'react-native'
import colors from 'utils/colors'

type Props = {
  handleChange: React.Dispatch<React.SetStateAction<string>>;
  keyboardType?: KeyboardTypeOptions;
  value: string;
}

export default function Input(props: Props): React.ReactElement {
  const { handleChange, keyboardType, value } = props

  return (
    <TextInput
      onChangeText={handleChange}
      style={styles.input}
      value={value}
      keyboardType={keyboardType}
    />
  )
}

const styles = StyleSheet.create({
  input: {
    borderColor: colors.black,
    backgroundColor: colors.white,
    borderWidth: 1,
    height: 40,
    width: 300,
    borderRadius: 4,
    padding: 4,
  },
})
