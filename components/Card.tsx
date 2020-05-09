import * as React from 'react'
import {
  Image, StyleSheet, View, Text, TouchableOpacity,
} from 'react-native'
import Rating from 'components/Rating'
import { Restaurant } from 'types'

type Props = {
  restaurant: Restaurant;
  setDetails: React.Dispatch<React.SetStateAction<Restaurant | undefined>>;
};

export default function Card(props: Props): React.ReactElement {
  const { restaurant, setDetails } = props

  return (
    <TouchableOpacity
      activeOpacity={1}
      style={styles.container}
      onPress={(): void => setDetails(restaurant)}
    >
      <Image style={styles.image} source={{ uri: restaurant.image_url }} />
      <View style={styles.overlay}>
        <View>
          <Text style={styles.name}>{restaurant.name}</Text>
          <Rating rating={restaurant.rating} />
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 9,
  },
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
  name: {
    color: 'white',
    fontSize: 32,
  },
})
