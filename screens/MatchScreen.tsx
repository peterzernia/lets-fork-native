import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { StackNavigationProp } from '@react-navigation/stack'
import { Party } from 'types'

type StackParamList = {
  Home: undefined;
  Party: undefined;
  Match: undefined;
}

type NavigationProp = StackNavigationProp<
  StackParamList,
  'Match'
>

type Props = {
  navigation: NavigationProp;
  party?: Party;
}

const MatchScreen = React.memo((props: Props) => {
  const { party } = props

  if (!party?.matches) {
    return (
      <View style={styles.container}>
        <Text>No matches!</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {party?.matches.map((restaurant) => (
        <Text key={restaurant.id}>{restaurant.name}</Text>
      ))}
    </View>
  )
})

export default MatchScreen

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
})
