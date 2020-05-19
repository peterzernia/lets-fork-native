import React from 'react'
import { TouchableOpacity, StyleSheet } from 'react-native'
import Text from 'components/Text'
import colors from 'utils/colors'

type Props = {
  children: string;
  color: 'white' | 'purple';
  onPress: () => void;
  size: 'sm' | 'lg';
}

export default function Button(props: Props): React.ReactElement {
  const {
    color, children, onPress, size,
  } = props

  const COLORS = {
    white: colors.white,
    purple: colors.purple,
  }

  const FONTCOLOR = {
    white: colors.black,
    purple: colors.white,
  }

  const SIZES = {
    sm: 150,
    lg: 300,
  }

  return (
    <TouchableOpacity
      style={{
        ...styles.button,
        backgroundColor: COLORS[color],
        width: SIZES[size],
      }}
      onPress={onPress}
    >
      <Text
        style={{
          ...styles.text,
          color: FONTCOLOR[color],
        }}
      >
        {children}
      </Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    margin: 16,
    borderRadius: 30,
    height: 52,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    textAlign: 'center',
    textAlignVertical: 'center',
    fontWeight: 'bold',
  },
})
