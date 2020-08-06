import React from 'react'
import {
  AsyncStorage, SafeAreaView, ScrollView, StyleSheet, Platform, Alert,
} from 'react-native'
import { StackNavigationProp } from '@react-navigation/stack'
import { RouteProp } from '@react-navigation/native'
import Details from 'components/Details'
import { Restaurant } from 'types'
import * as StoreReview from 'expo-store-review'

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

  // Request a review from users every 10 times they view a
  // match restaurant. The app will stop asking once they click
  // 'Sure' on Android, or once every 365 days for iOS
  React.useEffect(() => {
    async function requestReview(): Promise<void> {
      const [restaurantsViewed, hasReviewed] = await Promise.all([
        AsyncStorage.getItem('restaurantsViewed'),
        AsyncStorage.getItem('hasReviewed'),
      ])

      if (Number(restaurantsViewed) % 10 === 0) {
        setTimeout(() => {
          if (Platform.OS === 'android') {
            if (!hasReviewed) {
              Alert.alert(
                "Enjoying Let's Fork?",
                'Leave a review on the Play Store',
                [
                  { text: 'Maybe Later' },
                  {
                    text: 'Sure',
                    onPress: async (): Promise<void> => {
                      await AsyncStorage.setItem('hasReviewed', 'true')
                      return StoreReview.requestReview()
                    },
                  },
                ],
                { cancelable: false },
              )
            }
          } else {
            StoreReview.requestReview()
          }
        }, 3000)
      }

      AsyncStorage.setItem('restaurantsViewed', `${Number(restaurantsViewed) + 1}`)
    }

    requestReview()
  }, [])


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
