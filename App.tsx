import React from 'react'
import {
  Alert, TouchableOpacity, StyleSheet, AsyncStorage,
} from 'react-native'
import Text from 'components/Text'
import ReconnectingWebSocket from 'reconnecting-websocket'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { MaterialIcons } from '@expo/vector-icons'
import { Party, Restaurant } from 'types'
import Menu from 'components/Menu'
import CreateScreen from 'screens/CreateScreen'
import HomeScreen from 'screens/HomeScreen'
import JoinScreen from 'screens/JoinScreen'
import MatchScreen from 'screens/MatchScreen'
import PartyScreen from 'screens/PartyScreen'
import RestaurantScreen from 'screens/RestaurantScreen'
import TutorialScreen from 'screens/TutorialScreen'
import * as Location from 'expo-location'
import Constants from 'expo-constants'
import AppLoading from 'expo-app-loading'
import colors from 'utils/colors'
import env from 'env'
import { useFonts, VarelaRound_400Regular } from '@expo-google-fonts/varela-round'
import ShareScreen from 'screens/ShareScreen'

const ws = new ReconnectingWebSocket(`${env.WS}?id=${Constants.deviceId}`)

const Stack = createStackNavigator()

export default function App(): React.ReactElement {
  const [showApp, setShowApp] = React.useState(false)
  const [fontsLoaded] = useFonts({ VarelaRound_400Regular })
  const [loading, setLoading] = React.useState<boolean>(true)
  const [location, setLocation] = React.useState<Location.LocationObject>()
  const [party, setParty] = React.useState<Party>({} as Party)

  const linking = {
    prefixes: ['https://letsfork.app', 'letsfork://', 'exp://192.168.178.76:19000/+'],
    config: {
      screens: {
        Party: 'party/:id',
      },
    },
  }

  React.useEffect(() => {
    // Keep track of current matches
    let matches: Restaurant[] = []

    ws.onopen = (): void => {
      console.log('opened')
    }

    ws.onmessage = (msg): void => {
      console.log(msg.data)
      const data: Party = JSON.parse(msg.data)

      const newMatches = JSON.stringify(data.matches?.map((r) => r.id).sort())
      const oldMatches = JSON.stringify(matches?.map((r) => r.id).sort())

      // Alert when there are new matches
      if (data.matches?.length
        && oldMatches !== newMatches) {
        matches = data.matches
        Alert.alert(
          'You have a new match!',
          'Click the icon in the top right to view your matches',
        )
      }

      setParty(data)
    }

    ws.onclose = (msg): void => {
      console.log('closed', msg.reason)
    }

    ws.onerror = (err): void => {
      console.log('websocket error:', err)
    }
  }, [])

  const loadApplicationAsync = async (): Promise<void> => {
    const { status } = await Location.requestPermissionsAsync()
    if (status !== 'granted') {
      console.log('Permission to access location was denied')
    }

    const [loc, val] = await Promise.all([
      Location.getCurrentPositionAsync({}),
      AsyncStorage.getItem('showApp'),
    ])

    if (loc) setLocation(loc)

    // User has seen intro
    if (val) setShowApp(true)
  }

  if (loading || !fontsLoaded) {
    return (
      <AppLoading
        startAsync={loadApplicationAsync}
        onFinish={(): void => setLoading(false)}
        onError={console.warn}
      />
    )
  }

  if (!showApp) {
    return <TutorialScreen setShowApp={setShowApp} />
  }

  return (
    <NavigationContainer linking={linking} fallback={<Text>Loading...</Text>}>
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
            headerTitle: (): null => null,
          })}
        >
          {(props): React.ReactElement => <MatchScreen {...props} party={party} />}
        </Stack.Screen>
        <Stack.Screen
          name="Party"
          options={({ navigation }): object => ({
            gestureEnabled: false,
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
            headerRight: (): React.ReactElement | null => (
              party.status === 'active'
                ? <Menu navigation={navigation} />
                : null
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
        <Stack.Screen
          name="Share"
          options={(): object => ({
            headerTitle: (): null => null,
          })}
        >
          {(props): React.ReactElement => (
            <ShareScreen {...props} party={party} />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  )
}

const styles = StyleSheet.create({
  backButton: {
    marginLeft: 8,
    padding: 8,
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
