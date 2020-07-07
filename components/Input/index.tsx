import React from 'react'
import { TextInput, StyleSheet, KeyboardTypeOptions } from 'react-native'
import colors from 'utils/colors'

type Props = {
  handleChange: React.Dispatch<React.SetStateAction<string>>;
  keyboardType?: KeyboardTypeOptions;
  placeholder?: string;
  value: string;
}

export default function Input(props: Props): React.ReactElement {
  const {
    handleChange, keyboardType, placeholder, value,
  } = props

  return (
    <TextInput
      onChangeText={handleChange}
      style={styles.input}
      value={value}
      placeholder={placeholder}
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
