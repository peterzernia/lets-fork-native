import React from 'react'
import {
  Image, View, Text, StyleSheet,
} from 'react-native'
import { StackNavigationProp } from '@react-navigation/stack'
import { Party } from 'types'
import Restaurants from 'components/Restaurants'

type StackParamList = {
  Home: undefined;
  Party: undefined;
}

type NavigationProp = StackNavigationProp<
  StackParamList,
  'Home'
>

type Props = {
  navigation: NavigationProp;
  party?: Party;
  ws: WebSocket;
}

const PartyScreen = React.memo((props: Props) => {
  const { party, ws } = props

  if (!party || !party.current) return null

  if (party.status === 'waiting') {
    return (
      <View>
        <Text>Waiting for other people to join.</Text>
      </View>
    )
  }

  return (
    <Restaurants {...{ restaurants: party.current }} />
  )
})

export default PartyScreen

const styles = StyleSheet.create({
  container: {
    margin: 4,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    borderRadius: 4,
  },
})
