
import React from 'react'
import { View } from 'react-native'
import { StackNavigationProp } from '@react-navigation/stack'
import Button from 'components/Button'
import Input from 'components/Input'

type StackParamList = {
  Party: undefined;
  Join: undefined;
}

type NavigationProp = StackNavigationProp<
  StackParamList,
  'Join'
>

type Props = {
  navigation: NavigationProp;
  ws: WebSocket;
}

const JoinScreen = React.memo((props: Props): React.ReactElement => {
  const { navigation, ws } = props

  // creates a new party
  const handleCreate = (): void => {
    ws.send(JSON.stringify({ type: 'create', payload: { latitude: '52.492495', longitude: '13.393264', radius: '1000' } }))
    navigation.navigate('Party')
  }

  return (
    <View>
      <Button onPress={(): void => handleCreate()}>
        Create
      </Button>
    </View>
  )
})

export default JoinScreen
