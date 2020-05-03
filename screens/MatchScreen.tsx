import React from 'react'
import {
  Image, View, Text, StyleSheet, ScrollView,
} from 'react-native'
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
    <ScrollView contentContainerStyle={styles.scrollView}>
      {party?.matches.map((restaurant) => (
        <View key={restaurant.id} style={styles.card}>
          <View style={styles.overlay}>
            <View>
              <Text style={styles.name}>{restaurant.name}</Text>
            </View>
          </View>
          <Image style={styles.image} source={{ uri: restaurant.image_url }} />
        </View>
      ))}
    </ScrollView>
  )
})

export default MatchScreen

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 8,
  },
  scrollView: {
    margin: 8,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  card: {
    height: 100,
    marginBottom: 16,
  },
  image: {
    height: 100,
    borderRadius: 8,
    padding: 8,
    resizeMode: 'cover',
    zIndex: -1,
  },
  overlay: {
    flex: 1,
    paddingLeft: 8,
  },
  name: {
    color: 'white',
    fontSize: 32,
  },
})
