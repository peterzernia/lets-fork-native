import React from 'react'
import { StyleSheet, View } from 'react-native'
import Button from 'components/Button'
import Input from 'components/Input'

type Props = {
  ws: WebSocket;
}

const HomeScreen = React.memo((props: Props): React.ReactElement => {
  const { ws } = props
  const [value, setValue] = React.useState('')

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
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export default HomeScreen
