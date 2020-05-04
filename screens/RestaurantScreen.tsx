import React from 'react'
import { StackNavigationProp } from '@react-navigation/stack'
import { RouteProp } from '@react-navigation/native'
import Details from 'components/Details'
import { Restaurant } from 'types'

type StackParamList = {
  Home: undefined;
  Match: undefined;
  Party: undefined;
  Restaurant: {
    restaurant: Restaurant;
  };
}

type HomeScreenRouteProp = RouteProp<StackParamList, 'Restaurant'>

type NavigationProp = StackNavigationProp<
  StackParamList,
  'Restaurant'
>

type Props = {
  navigation: NavigationProp;
  route: HomeScreenRouteProp;
}

const RestaurantScreen = React.memo((props: Props) => {
  const { route } = props
  const { restaurant } = route.params

  return (
    <Details restaurant={restaurant} />
  )
})

export default RestaurantScreen
