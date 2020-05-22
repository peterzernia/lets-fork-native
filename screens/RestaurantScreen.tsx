import React from 'react'
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native'
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
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Details
          photos
          restaurant={restaurant}
        />
      </ScrollView>
    </SafeAreaView>
  )
})

export default RestaurantScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fbfaff',
  },
})
