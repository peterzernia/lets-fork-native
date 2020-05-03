import 'react-native-gesture-handler'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import HomeScreen from 'screens/HomeScreen'

const ws = new WebSocket('ws://192.168.178.25:8003/api/v1/ws')

const Stack = createStackNavigator()

export default function App(): React.ReactElement {
  React.useEffect(() => {
    ws.onopen = (): void => {
      console.log('opened')
    }

    ws.onmessage = (msg): void => {
      console.log(msg.data)
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
      </Stack.Navigator>
    </NavigationContainer>
  )
}
