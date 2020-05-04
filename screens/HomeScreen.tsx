import React from 'react'
import { StyleSheet, View } from 'react-native'
import { StackNavigationProp } from '@react-navigation/stack'
import Button from 'components/Button'
import Input from 'components/Input'

type StackParamList = {
  Home: undefined;
  Party: undefined;
}

type NavigationProp = StackNavigationProp<
  StackParamList,
  'Home'
>

type Props = {
  navigation: NavigationProp;
  ws: WebSocket;
}

const HomeScreen = React.memo((props: Props): React.ReactElement => {
  const { navigation, ws } = props
  const [value, setValue] = React.useState('')

  // creates a new party
  const handleCreate = (): void => {
    ws.send(JSON.stringify({ type: 'create', payload: { latitude: '43.801357', longitude: '-91.239578', radius: '1000' } }))
    navigation.navigate('Party')
  }

  // joins an existing party
  const handleJoin = (): void => {
    ws.send(JSON.stringify({ type: 'join', payload: { party_id: value } }))
    navigation.navigate('Party')
  }

  return (
    <View style={styles.container}>
      <Button onPress={(): void => handleCreate()}>
        Create
      </Button>
      <Input value={value} handleChange={setValue} />
      <Button onPress={(): void => handleJoin()}>
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
