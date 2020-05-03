import * as React from 'react'
import {
  Image, StyleSheet, View, Text,
} from 'react-native'
import { Restaurant } from 'types'

type Props = {
  restaurant: Restaurant;
};

export default function Card(props: Props): React.ReactElement {
  const { restaurant } = props

  return (
    <View style={StyleSheet.absoluteFill}>
      <Image style={styles.image} source={{ uri: restaurant.image_url }} />
      <View style={styles.overlay}>
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
    justifyContent: 'flex-end',
    padding: 16,
  },
  footer: {
    flexDirection: 'row',
  },
  name: {
    color: 'white',
    fontSize: 32,
  },
})
