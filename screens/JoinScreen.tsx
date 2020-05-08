
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
  const [value, setValue] = React.useState('')

  // joins an existing party
  const handleJoin = (): void => {
    ws.send(JSON.stringify({ type: 'join', payload: { party_id: value } }))
    navigation.navigate('Party')
  }

  return (
    <View>
      <Input value={value} handleChange={setValue} />
      <Button onPress={(): void => handleJoin()}>
        Join
      </Button>
    </View>
  )
})

export default JoinScreen
