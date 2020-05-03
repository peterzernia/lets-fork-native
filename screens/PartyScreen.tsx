import React from 'react'
import {
  ActivityIndicator, View, Text, SafeAreaView, StyleSheet,
} from 'react-native'
import { Feather as FeatherIcons, MaterialIcons } from '@expo/vector-icons'
import { StackNavigationProp } from '@react-navigation/stack'
import { Party } from 'types'
import SwipeWindow from 'components/SwipeWindow'

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
  const { party } = props

  if (!party || !party.current) return <ActivityIndicator size="small" />

  if (party.status === 'waiting') {
    return (
      <View>
        <Text>Waiting for other people to join.</Text>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <FeatherIcons name="user" size={32} color="gray" />
        <FeatherIcons name="message-circle" size={32} color="gray" />
      </View>
      <SwipeWindow restaurants={party.current} />
      <View style={styles.footer}>
        <View style={styles.circle}>
          <MaterialIcons name="keyboard-arrow-down" size={32} color="black" />
        </View>
      </View>
    </SafeAreaView>
  )
})

export default PartyScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fbfaff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    padding: 16,
  },
  circle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    shadowColor: 'gray',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 2,
  },
})
