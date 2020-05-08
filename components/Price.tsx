import React from 'react'
import { TouchableOpacity, StyleSheet, Text } from 'react-native'
import colors from 'utils/colors'

type Props = {
  children: string;
  n: number;
  selected: boolean[];
  setSelected: React.Dispatch<React.SetStateAction<boolean[]>>;
}

export default function Price(props: Props): React.ReactElement {
  const {
    children, n, selected, setSelected,
  } = props

  return (
    <TouchableOpacity
      onPress={(): void => {
        const s = [...selected]
        s[n - 1] = !s[n - 1]
        setSelected(s)
      }}
      style={{
        ...styles.price,
        backgroundColor: selected[n - 1] ? colors.green : colors.white,
      }}
    >
      <Text
        style={{
          ...styles.text,
          color: selected[n - 1] ? colors.white : colors.black,
        }}
      >
        {children.repeat(n)}
      </Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  price: {
    margin: 4,
    height: 50,
    width: 60,
    borderWidth: 1,
    borderRadius: 4,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  text: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 14,
  },
})
