import React from 'react'
import {
  Image, View, StyleSheet, ScrollView, TouchableOpacity,
} from 'react-native'
import Text from 'components/Text'
import { StackNavigationProp } from '@react-navigation/stack'
import { Party, Restaurant } from 'types'

type StackParamList = {
  Home: undefined;
  Match: undefined;
  Party: undefined;
  Restaurant: {
    restaurant: Restaurant;
  };
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
  const { navigation, party } = props

  if (!party?.matches) {
    return (
      <View style={styles.container}>
        <Text>No matches yet</Text>
        <Text>Keep swiping!</Text>
      </View>
    )
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      {party?.matches.map((restaurant) => (
        <TouchableOpacity
          key={restaurant.id}
          onPress={(): void => navigation.navigate('Restaurant', {
            restaurant,
          })}
        >
          <View style={styles.card}>
            <View style={styles.overlay}>
              <View>
                <Text style={styles.name}>{restaurant.name}</Text>
              </View>
            </View>
            <Image style={styles.image} source={{ uri: restaurant.image_url }} />
          </View>
        </TouchableOpacity>
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
    position: 'absolute',
  },
  name: {
    color: 'white',
    fontSize: 32,
    textShadowColor: 'black',
    textShadowOffset: { width: -0.5, height: 0 },
    textShadowRadius: 5,
  },
})
