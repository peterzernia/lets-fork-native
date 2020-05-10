import React from 'react'
import {
  Alert, TouchableOpacity, StyleSheet,
} from 'react-native'
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
import env from 'env'

const ws = new WebSocket(env.WS)

const Stack = createStackNavigator()

export default function App(): React.ReactElement {
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
          [
            { text: 'OK', onPress: (): void => console.log('ok') },
          ],
        )
      }
    }

    ws.onclose = (): void => {
      console.log('closed')
    }
  }, [prevState])

  React.useEffect(() => {
    (async (): Promise<void> => {
      const { status } = await Location.requestPermissionsAsync()
      if (status !== 'granted') {
        console.log('Permission to access location was denied')
      }

      const loc = await Location.getCurrentPositionAsync({})
      setLocation(loc)

      await setTestDeviceIDAsync('EMULATOR')
    })()
  }, [])

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
            headerTitle: (): null => null,
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
      <AdMobBanner
        bannerSize="fullBanner"
        adUnitID="ca-app-pub-3940256099942544/6300978111" // Test ID, Replace with your-admob-unit-id
        servePersonalizedAds
        // onDidFailToReceiveAdWithError={this.bannerError}
      />
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
})
