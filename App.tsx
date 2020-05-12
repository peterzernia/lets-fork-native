import React from 'react'
import {
  Alert, TouchableOpacity, StyleSheet, Text, Platform, View,
} from 'react-native'
import ReconnectingWebsocket from 'reconnecting-websocket'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { MaterialIcons } from '@expo/vector-icons'
import { Party } from 'types'
import { usePrevious } from 'utils/hooks'
import CreateScreen from 'screens/CreateScreen'
import HomeScreen from 'screens/HomeScreen'
import JoinScreen from 'screens/JoinScreen'
import MatchScreen from 'screens/MatchScreen'
import PartyScreen from 'screens/PartyScreen'
import RestaurantScreen from 'screens/RestaurantScreen'
import * as Location from 'expo-location'
import { AdMobBanner, setTestDeviceIDAsync } from 'expo-ads-admob'
import { AppLoading } from 'expo'
import colors from 'utils/colors'
import env from 'env'

const ws = new ReconnectingWebsocket(env.WS)

const Stack = createStackNavigator()

export default function App(): React.ReactElement {
  const [loading, setLoading] = React.useState<boolean>(true)
  const [location, setLocation] = React.useState<Location.LocationData>()
  const [party, setParty] = React.useState<Party>({} as Party)

  // prevState of the party
  const prevState = usePrevious(party)

  React.useEffect(() => {
    ws.onopen = (): void => {
      console.log('opened')
    }

    ws.onmessage = (msg): void => {
      console.log(msg.data)
      const currentState = JSON.parse(msg.data)
      setParty(currentState)

      // Alert when there are new matches
      if (currentState.matches
        && JSON.stringify(prevState.matches)
        !== JSON.stringify(currentState.matches)
      ) {
        Alert.alert(
          'You have a new match!',
          'Click the list icon in the top right to view your matches',
        )
      }
    }

    ws.onclose = (msg): void => {
      console.log('closed', msg.reason)
      Alert.alert(
        "Oops! Something's gone wrong",
        "It looks like you've disconnected. Hang on while we try to reconnect you.",
      )
    }

    ws.onerror = (err): void => {
      console.log('websocket error:', err)
    }
  }, [prevState])

  const loadApplicationAsync = async (): Promise<void> => {
    const { status } = await Location.requestPermissionsAsync()
    if (status !== 'granted') {
      console.log('Permission to access location was denied')
    }

    const loc = await Location.getCurrentPositionAsync({})
    setLocation(loc)

    if (env.ENV === 'development') {
      await setTestDeviceIDAsync('EMULATOR')
    }
  }

  if (loading) {
    return (
      <AppLoading
        startAsync={loadApplicationAsync}
        onFinish={(): void => setLoading(false)}
        onError={console.warn}
      />
    )
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Create"
          options={(): object => ({
            headerTitle: (): null => null,
          })}
        >
          {(props): React.ReactElement => (
            <CreateScreen
              {...props}
              ws={ws}
              location={location}
            />
          )}
        </Stack.Screen>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={(): object => ({
            headerShown: false,
          })}
        />
        <Stack.Screen
          name="Join"
          options={(): object => ({
            headerTitle: (): null => null,
          })}
        >
          {(props): React.ReactElement => <JoinScreen {...props} ws={ws} />}
        </Stack.Screen>
        <Stack.Screen
          name="Match"
          options={(): object => ({
            headerTitle: (): React.ReactElement => <Text style={styles.matchHeader}>{`Party code: ${party.id}`}</Text>,
          })}
        >
          {(props): React.ReactElement => <MatchScreen {...props} party={party} />}
        </Stack.Screen>
        <Stack.Screen
          name="Party"
          options={({ navigation }): object => ({
            headerTitle: (): null => null,
            headerLeft: (): React.ReactElement => (
              <TouchableOpacity
                style={styles.backButton}
                onPress={(): void => Alert.alert(
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
                )}
              >
                <MaterialIcons name="close" color="black" size={24} />
              </TouchableOpacity>
            ),
            headerRight: (): React.ReactElement => (
              <TouchableOpacity style={styles.matchButton} onPress={(): void => navigation.navigate('Match')}>
                <MaterialIcons name="list" size={32} color="black" />
              </TouchableOpacity>
            ),
          })}
        >
          {(props): React.ReactElement => (
            <PartyScreen
              {...props}
              ws={ws}
              party={party}
              setParty={setParty}
            />
          )}
        </Stack.Screen>
        <Stack.Screen
          name="Restaurant"
          component={RestaurantScreen}
          options={(): object => ({
            headerTitle: (): null => null,
          })}
        />
      </Stack.Navigator>
      {
        env.ADS ? (
          <View style={styles.bannerContainer}>
            <AdMobBanner
              style={styles.banner}
              bannerSize="banner"
              adUnitID={env.ENV === 'development' // eslint-disable-line no-nested-ternary
                ? 'ca-app-pub-3940256099942544/6300978111' // test id
                : (Platform.OS === 'android' ? 'ca-app-pub-7615991652854969/8991339797' : 'ca-app-pub-7615991652854969/8331922298')}
              servePersonalizedAds={false}
              onAdViewDidReceiveAd={(): void => console.log('ad received')}
              onDidFailToReceiveAdWithError={(err): void => console.log('Ad mob error: ', err)}
            />
          </View>
        ) : null
      }
    </NavigationContainer>
  )
}

const styles = StyleSheet.create({
  backButton: {
    marginLeft: 16,
  },
  matchButton: {
    marginRight: 16,
  },
  bannerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: 'black',
  },
  banner: {
    backgroundColor: colors.black,
  },
  matchHeader: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
})
