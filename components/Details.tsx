import React from 'react'
import {
  View, Text, TouchableOpacity, StyleSheet, Linking,
} from 'react-native'
import { MaterialIcons, FontAwesome } from '@expo/vector-icons'
import { Restaurant } from 'types'
import { call } from 'utils/phone'

type Props = {
  restaurant: Restaurant;
}

export default function Details(props: Props): React.ReactElement {
  const { restaurant } = props

  return (
    <View>
      <Text>{`${restaurant.price} - ${restaurant.categories.map((category) => category.title).join(', ')}`}</Text>
      <Text>{ restaurant.rating }</Text>
      <View style={styles.icons}>
        <TouchableOpacity onPress={(): void => call(restaurant.display_phone)}>
          <MaterialIcons name="phone" size={32} />
        </TouchableOpacity>
        <TouchableOpacity onPress={(): Promise<any> => Linking.openURL(restaurant.url)}>
          <FontAwesome name="yelp" size={32} />
        </TouchableOpacity>
      </View>
      { restaurant.transactions.length ? <Text>{ restaurant.transactions.join(', ') }</Text> : null }
    </View>
  )
}

const styles = StyleSheet.create({
  icons: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
})
