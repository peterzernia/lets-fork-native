import * as React from 'react'
import {
  Image, StyleSheet, View, Text, TouchableOpacity,
} from 'react-native'
import { FontAwesome } from '@expo/vector-icons'
import Rating from 'components/Rating'
import { Restaurant } from 'types'
import colors from 'utils/colors'

type Props = {
  loading?: boolean; // When loading, top card's image is not rendered
  restaurant: Restaurant;
  setDetails: React.Dispatch<React.SetStateAction<Restaurant | undefined>>;
};

export default function Card(props: Props): React.ReactElement {
  const {
    loading, restaurant, setDetails,
  } = props

  return (
    <TouchableOpacity
      activeOpacity={1}
      style={styles.container}
      onPress={(): void => setDetails(restaurant)}
    >
      { !loading
        ? <Image style={styles.image} source={{ uri: restaurant.image_url, cache: 'force-cache' }} />
        : null}
      <View style={styles.overlay}>
        <View>
          <Text style={styles.name}>{restaurant.name}</Text>
          <View style={styles.yelp}>
            <Rating rating={restaurant.rating} size="lg" />
            <FontAwesome name="yelp" size={32} color={colors.white} />
          </View>
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
    textShadowColor: 'black',
    textShadowOffset: { width: -0.5, height: 0 },
    textShadowRadius: 5,
  },
  yelp: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
})
