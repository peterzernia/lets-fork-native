import * as React from 'react'
import {
  Image, StyleSheet, View, Text,
} from 'react-native'
import Animated from 'react-native-reanimated'
import { Restaurant } from 'types'

const { Value } = Animated

type Props = {
  restaurant: Restaurant;
  likeOpacity?: Value | number;
  nopeOpacity?: Value | number;
};

export default function Card(props: Props): React.ReactElement {
  const { restaurant, likeOpacity, nopeOpacity } = props

  return (
    <View style={StyleSheet.absoluteFill}>
      <Image style={styles.image} source={{ uri: restaurant.image_url }} />
      <View style={styles.overlay}>
        <View style={styles.header}>
          <Animated.View style={[styles.like, { opacity: likeOpacity }]}>
            <Text style={styles.likeLabel}>LIKE</Text>
          </Animated.View>
          <Animated.View style={[styles.nope, { opacity: nopeOpacity }]}>
            <Text style={styles.nopeLabel}>NOPE</Text>
          </Animated.View>
        </View>
        <View style={styles.footer}>
          <Text style={styles.name}>{restaurant.name}</Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  image: {
    ...StyleSheet.absoluteFillObject,
    width: undefined,
    height: undefined,
    borderRadius: 8,
  },
  overlay: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footer: {
    flexDirection: 'row',
  },
  name: {
    color: 'white',
    fontSize: 32,
  },
  like: {
    borderWidth: 4,
    borderRadius: 5,
    padding: 8,
    borderColor: '#6ee3b4',
  },
  likeLabel: {
    fontSize: 32,
    color: '#6ee3b4',
    fontWeight: 'bold',

  },
  nope: {
    borderWidth: 4,
    borderRadius: 5,
    padding: 8,
    borderColor: '#ec5288',
  },
  nopeLabel: {
    fontSize: 32,
    color: '#ec5288',
    fontWeight: 'bold',
  },
})
