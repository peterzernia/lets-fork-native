import React from 'react'
import { Alert, TouchableOpacity, StyleSheet } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { MaterialIcons } from '@expo/vector-icons'
import { Party } from 'types'
import HomeScreen from 'screens/HomeScreen'
import PartyScreen from 'screens/PartyScreen'


const ws = new WebSocket('ws://192.168.178.25:8003/api/v1/ws')

const Stack = createStackNavigator()

export default function App(): React.ReactElement {
  const [party, setParty] = React.useState<Party>()

  React.useEffect(() => {
    ws.onopen = (): void => {
      console.log('opened')
    }

    ws.onmessage = (msg): void => {
      console.log(msg.data)
      setParty(JSON.parse(msg.data))
    }

    ws.onclose = (): void => {
      console.log('closed')
    }
  }, [])

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home">
          {(props): React.ReactElement => <HomeScreen {...props} ws={ws} />}
        </Stack.Screen>
        <Stack.Screen
          name="Party"
          options={({ navigation }): any => ({
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
                        navigation.navigate('Home')
                        setParty(undefined)
                      },
                    },
                  ],
                  { cancelable: true },
                )}
              >
                <MaterialIcons name="close" color="black" size={24} />
              </TouchableOpacity>
            ),
          })}
        >
          {(props): React.ReactElement => (
            <PartyScreen {...props} ws={ws} party={party} setParty={setParty} />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  )
}

const styles = StyleSheet.create({
  backButton: {
    marginLeft: 16,
  },
})
