import React from 'react'
import {
  StyleSheet, Text, View, TouchableHighlight,
} from 'react-native'

const ws = new WebSocket('ws://192.168.178.25:8003/api/v1/ws')

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
    <View style={styles.container}>
      <Text>Open up App.tsx to start working on your app!</Text>
      <TouchableHighlight onPress={(): void => ws.send('{ "type": "create", "payload": { "latitude": "52.492495", "longitude": "13.393264", "radius": "1000" } }')}>
        <Text>Press</Text>
      </TouchableHighlight>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
