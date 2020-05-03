import React from 'react'
import {
  Image, View, Text, StyleSheet,
} from 'react-native'
import { StackNavigationProp } from '@react-navigation/stack'
import { Party } from 'types'

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
    <View>
      <Image
        style={styles.image}
        source={{
          uri: party.current[0].image_url,
        }}
      />
      <Text>{party.current[0].name}</Text>
    </View>
  )
})

export default PartyScreen

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
})
