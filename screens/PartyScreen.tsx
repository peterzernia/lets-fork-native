import React from 'react'
import {
  ActivityIndicator,
  Alert,
  BackHandler,
  View,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Share,
  ShareAction,
  Platform,
} from 'react-native'
import Text from 'components/Text'
import ReconnectingWebsocket from 'reconnecting-websocket'
import { useFocusEffect, RouteProp } from '@react-navigation/native'
import { StackNavigationProp, useHeaderHeight } from '@react-navigation/stack'
import ScrollBottomSheet from 'react-native-scroll-bottom-sheet'
import { Party, Restaurant } from 'types'
import SwipeWindow from 'components/SwipeWindow'
import Details from 'components/Details'
import Handle from 'components/Handle'
import { MaterialIcons, Ionicons } from '@expo/vector-icons'
import { usePrevious } from 'utils/hooks'
import Button from 'components/Button'
import env from 'env'
import colors from 'utils/colors'
import { BOTTOM_BAR_HEIGHT } from 'utils/constants'

type StackParamList = {
  Home: undefined;
  Join: undefined;
  Party: undefined | {
    id?: number;
  };
  Match: undefined;
}

type NavigationProp = StackNavigationProp<
  StackParamList,
  'Home'
>

type PartyScreenRouteProp = RouteProp<StackParamList, 'Party'>

type Props = {
  navigation: NavigationProp;
  party?: Party;
  route: PartyScreenRouteProp;
  setParty: React.Dispatch<React.SetStateAction<Party>>;
  ws: ReconnectingWebsocket;
}
const { width, height } = Dimensions.get('window')

const PartyScreen = React.memo((props: Props) => {
  const {
    navigation, party, route, setParty, ws,
  } = props

  const [snapIndex, setSnapIndex] = React.useState(2)
  const [finished, setFinished] = React.useState<boolean>(false)
  const [restaurants, setRestaurants] = React.useState<Restaurant[]>()
  const headerHeight = useHeaderHeight()
  const viewHeight = env.ADS ? height - headerHeight - 50 : height - headerHeight

  if (party?.error) {
    Alert.alert(
      'Yike! Something went wrong',
      party.error,
      [
        {
          text: 'OK',
          onPress: (): void => {
            navigation.goBack()
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
  }, [restaurants, restaurants?.length, ws])

  // Deep linking will open the app to the party screen
  // but the party still needs to be joined
  React.useEffect(() => {
    if (route?.params?.id) {
      ws.send(JSON.stringify({ type: 'join', payload: { party_id: route?.params?.id } }))
    }
  }, [route?.params?.id, ws])

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
          height: viewHeight,
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
          height: viewHeight,
        }}
      >
        <Text style={styles.text}>
          No more restaurants.
          Go through the list again or try expanding your search range.
        </Text>
        <Button
          size="sm"
          color="purple"
          onPress={(): void => {
            setFinished(false)
            setRestaurants(party?.restaurants)
          }}
        >
          START OVER
        </Button>
      </View>
    )
  }

  if (!party || !party.restaurants) {
    return (
      <View
        style={{
          ...styles.waiting,
          height: viewHeight,
        }}
      >
        <ActivityIndicator size="large" />
      </View>
    )
  }

  const current = restaurants?.length
    ? restaurants[0] : party.restaurants[0]

  return (
    <SafeAreaView style={styles.container}>
      <View
        // disable swiping while BottomSheet is open
        pointerEvents={snapIndex !== 2 ? 'none' : 'auto'}
        style={{ height: viewHeight, zIndex: 0 }}
      >
        <SwipeWindow
          handleSwipeRight={handleSwipeRight}
          restaurants={restaurants || party.restaurants}
          setFinished={setFinished}
          setRestaurants={setRestaurants}
        />
      </View>
      <ScrollBottomSheet
        componentType="ScrollView"
        contentContainerStyle={styles.scrollBottomSheet}
        snapPoints={[100, 100, viewHeight - BOTTOM_BAR_HEIGHT]}
        initialSnapIndex={2}
        onSettle={setSnapIndex}
        renderHandle={(): React.ReactElement => <Handle />}
        animationConfig={{
          duration: 100,
        }}
      >
        <Details restaurant={current} />
      </ScrollBottomSheet>
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
  placeholder: {
    position: 'absolute',
    left: 8,
    top: 8,
    width: width - 16,
    borderRadius: 8,
    borderColor: colors.black,
    borderWidth: 1,
  },
  scrollBottomSheet: {
    backgroundColor: colors.white,
    borderColor: 'red',
  },
})
