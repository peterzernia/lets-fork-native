import React from 'react'
import { View, Text } from 'react-native'
import { Restaurant } from 'types'

type Props = {
  restaurant: Restaurant;
}

export default function Details(props: Props): React.ReactElement {
  const { restaurant } = props

  return (
    <View>
      <Text>{ restaurant.name }</Text>
      <Text>{ restaurant.display_phone }</Text>
      <Text>{ restaurant.price }</Text>
      <Text>{ restaurant.rating }</Text>
      <Text>{ restaurant.categories[0].title}</Text>
      { restaurant.transactions.length ? <Text>{ restaurant.transactions.join(', ') }</Text> : null }
      <Text>{ restaurant.url }</Text>
    </View>
  )
}
