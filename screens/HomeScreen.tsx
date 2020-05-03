import React from 'react'
import { StyleSheet, View } from 'react-native'
// import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import Button from 'components/Button'
import Input from 'components/Input'

type StackParamList = {
  Home: undefined;
  Party: undefined;
}

// type HomeScreenRouteProp = RouteProp<StackParamList, 'Home'>

type NavigationProp = StackNavigationProp<
  StackParamList,
  'Home'
>

type Props = {
  // route: HomeScreenRouteProp;
  navigation: NavigationProp;
  ws: WebSocket;
}

const HomeScreen = React.memo((props: Props): React.ReactElement => {
  const { navigation, ws } = props
  const [value, setValue] = React.useState('')

  // creates a new party
  const handleCreate = (): void => {
    ws.send(JSON.stringify({ type: 'create', payload: { latitude: 52.492495, longitude: 13.393264, radius: 1000 } }))
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
