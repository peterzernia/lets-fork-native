import React from 'react'
import { StyleSheet, View } from 'react-native'
import Button from 'components/Button'
import Input from 'components/Input'

const ws = new WebSocket('ws://192.168.178.25:8003/api/v1/ws')

export default function App(): React.ReactElement {
  const [value, setValue] = React.useState('')
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
      <Button onPress={(): void => ws.send(JSON.stringify({ type: 'create', payload: { latitude: 52.492495, longitude: 13.393264, radius: 1000 } }))}>
        Create
      </Button>
      <Input value={value} handleChange={setValue} />
      <Button onPress={(): void => ws.send(JSON.stringify({ type: 'join', payload: { party_id: value } }))}>
        Join
      </Button>
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
