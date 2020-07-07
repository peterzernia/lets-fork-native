import React from 'react'
import { View, StyleSheet } from 'react-native'
import colors from 'utils/colors'
import { BOTTOM_BAR_HEIGHT } from 'utils/constants'

export default function Handle(): React.ReactElement {
  return (
    <View style={styles.handle}>
      <View style={styles.tab} />
    </View>
  )
}

const styles = StyleSheet.create({
  handle: {
    backgroundColor: colors.white,
    borderBottomWidth: 0.1,
    height: BOTTOM_BAR_HEIGHT,
    flexDirection: 'row',
    justifyContent: 'center',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -10,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5.0,
    elevation: 16,
  },
  tab: {
    width: 22,
    height: 4,
    backgroundColor: colors.lightgrey,
    borderRadius: 4,
    marginTop: 17,
  },
})
