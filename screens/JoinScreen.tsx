
import React from 'react'
import {
  View, StyleSheet, Dimensions, Text,
} from 'react-native'
import ReconnectingWebsocket from 'reconnecting-websocket'
import { StackNavigationProp, useHeaderHeight } from '@react-navigation/stack'
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
  ws: ReconnectingWebsocket;
}

const { height } = Dimensions.get('window')

const JoinScreen = React.memo((props: Props): React.ReactElement => {
  const { navigation, ws } = props
  const [value, setValue] = React.useState('')
  const headerHeight = useHeaderHeight()

  // joins an existing party
  const handleJoin = (): void => {
    ws.send(JSON.stringify({ type: 'join', payload: { party_id: value } }))
    navigation.navigate('Party')
  }

  return (
    <View
      style={{
        ...styles.container,
        height: height - headerHeight,
      }}
    >
      <Text style={styles.text}>Please enter the code</Text>
      <Input value={value} handleChange={setValue} keyboardType="phone-pad" />
      <Button onPress={(): void => handleJoin()}>
        Join
      </Button>
    </View>
  )
})

export default JoinScreen

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontWeight: 'bold',
    padding: 16,
  },
})
