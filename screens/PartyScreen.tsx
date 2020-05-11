import React from 'react'
import {
  ActivityIndicator,
  Alert,
  BackHandler,
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Share,
  ShareAction,
  Platform,
} from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import { StackNavigationProp, useHeaderHeight } from '@react-navigation/stack'
import { Party, Restaurant } from 'types'
import SwipeWindow from 'components/SwipeWindow'
import Details from 'components/Details'
import { MaterialIcons, Ionicons } from '@expo/vector-icons'
import { usePrevious } from 'utils/hooks'
import Button from 'components/Button'
import env from 'env'

type StackParamList = {
  Home: undefined;
  Join: undefined;
  Party: undefined;
  Match: undefined;
}

type NavigationProp = StackNavigationProp<
  StackParamList,
  'Home'
>

type Props = {
  navigation: NavigationProp;
  party?: Party;
  setParty: React.Dispatch<React.SetStateAction<Party>>;
  ws: WebSocket;
}
const { height } = Dimensions.get('window')

const PartyScreen = React.memo((props: Props) => {
  const {
    navigation, party, setParty, ws,
  } = props
  const [finished, setFinished] = React.useState<boolean>(false)
  const [restaurants, setRestaurants] = React.useState<Restaurant[]>()
  const [details, setDetails] = React.useState<Restaurant | undefined>()
  const headerHeight = useHeaderHeight()

  if (party?.error) {
    Alert.alert(
      'Yike! Something went wrong',
      party.error,
      [
        {
          text: 'OK',
          onPress: (): void => {
            navigation.navigate('Join')
            setParty({} as Party)
          },
        },
      ],
      { cancelable: false },
    )
  }

  // Request more cards with 3 remaining to prevent
  // having to show loader
  React.useEffect(() => {
    if (restaurants && restaurants?.length === 3) {
      ws.send(JSON.stringify({ type: 'request-more' }))
    }
  }, [restaurants, ws])

  // When anyone requests more cards, they are set in current
  // and this useEffect loads the new cards into the restaurants array
  const prevState = usePrevious(party || {} as Party)
  React.useEffect(() => {
    if (JSON.stringify(prevState.current) !== JSON.stringify(party?.current)) {
      if (party?.current?.length && restaurants) {
        const res = [...restaurants, ...party?.current]
        setRestaurants(res)
      }
    }
  }, [party, prevState, restaurants])

  // Custom android back button
  useFocusEffect( // eslint-disable-line
    React.useCallback(() => {
      const onBackPress = (): boolean => {
        Alert.alert(
          'Are you sure you want to exit?',
          'Exiting will make you lose all data in this party',
          [
            { text: 'Cancel' },
            {
              text: 'OK',
              onPress: (): void => {
                ws.send(JSON.stringify({ type: 'quit' }))
                navigation.navigate('Home')
                setParty({} as Party)
              },
            },
          ],
          { cancelable: true },
        )
        return true
      }

      BackHandler.addEventListener('hardwareBackPress', onBackPress)

      return (): void => BackHandler.removeEventListener('hardwareBackPress', onBackPress)
    }, [navigation, setParty, ws]),
  )

  const handleSwipeRight = (id: string): void => {
    ws.send(JSON.stringify({ type: 'swipe-right', payload: { restaurant_id: id } }))
  }

  if (party?.status === 'waiting') {
    return (
      <View
        style={{
          ...styles.waiting,
          height: height - headerHeight,
        }}
      >
        <Text style={styles.text}>Share this code with friends to have them join your party.</Text>
        <Text style={styles.code}>{party.id}</Text>
        <TouchableOpacity onPress={(): Promise<ShareAction> => Share.share({ message: `Join my party on Let's Fork with this code: ${party.id}` })}>
          {Platform.OS === 'ios' ? (
            <Ionicons name="ios-share-alt" size={32} />
          ) : (
            <MaterialIcons name="share" size={32} />
          )}
        </TouchableOpacity>
      </View>
    )
  }

  if (finished || party?.total === 0) {
    return (
      <View
        style={{
          ...styles.waiting,
          height: height - headerHeight,
        }}
      >
        <Text style={styles.text}>
          No more restaurants.
          Go through the list again or try expanding your search range.
        </Text>
        <Button onPress={(): void => {
          setFinished(false)
          setRestaurants(party?.restaurants)
        }}
        >
          Start Over
        </Button>
      </View>
    )
  }

  if (!party || !party.restaurants) {
    return (
      <View
        style={{
          ...styles.waiting,
          height: height - headerHeight,
        }}
      >
        <ActivityIndicator size="large" />
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        onScroll={(e): void => {
          if (e.nativeEvent.contentOffset.y === 0) {
            setDetails(undefined)
          }
        }}
      >
        <View
          style={
            details
              ? styles.hidden
              : { height: env.ADS ? height - headerHeight - 50 : height - headerHeight }
          }
        >
          <SwipeWindow
            handleSwipeRight={handleSwipeRight}
            restaurants={restaurants || party.restaurants}
            setDetails={setDetails}
            setFinished={setFinished}
            setRestaurants={setRestaurants}
            visible={!details}
          />
        </View>
        { details
          ? (
            <Details restaurant={details} setDetails={setDetails} />
          ) : null}
      </ScrollView>
    </SafeAreaView>
  )
})

export default PartyScreen

const styles = StyleSheet.create({
  waiting: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  text: {
    paddingLeft: 32,
    paddingRight: 32,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  code: {
    fontWeight: 'bold',
    fontSize: 36,
  },
  container: {
    flex: 1,
    backgroundColor: '#fbfaff',
  },
  hidden: {
    height: 0,
  },
})
