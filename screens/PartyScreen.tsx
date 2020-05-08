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
} from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import { StackNavigationProp, useHeaderHeight } from '@react-navigation/stack'
import { Party, Restaurant } from 'types'
import SwipeWindow from 'components/SwipeWindow'
import Details from 'components/Details'
import { MaterialIcons } from '@expo/vector-icons'
import { usePrevious } from 'utils/hooks'

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
  const [restaurants, setRestaurants] = React.useState<Restaurant[]>()
  const [details, setDetails] = React.useState(false)
  const [blocked, setBlocked] = React.useState(false)
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
            { text: 'Cancel', onPress: (): void => console.log('cancelled') },
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
          <MaterialIcons name="share" size={32} />
        </TouchableOpacity>
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
            setDetails(false)
          }
        }}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={(): void => {
            console.log(blocked)
            if (!blocked) {
              setDetails(true)
            }
          }}
          style={details ? styles.hidden : swipeStyle(headerHeight).swipe}
        >
          <SwipeWindow
            handleSwipeRight={handleSwipeRight}
            restaurants={restaurants || party.restaurants}
            setBlocked={setBlocked}
            setRestaurants={setRestaurants}
            visible={!details}
          />
        </TouchableOpacity>
        { details
          ? (
            <Details restaurant={restaurants?.[0] || party.restaurants[0]} />
          ) : null}
      </ScrollView>
    </SafeAreaView>
  )
})

export default PartyScreen

const swipeStyle = (hh: number): any => StyleSheet.create({
  swipe: {
    height: height - hh,
  },
})
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
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    padding: 16,
    height: 190,
  },
  circle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    shadowColor: 'gray',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 2,
  },
})
