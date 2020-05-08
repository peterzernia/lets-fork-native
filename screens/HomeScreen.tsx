import React from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { StackNavigationProp } from '@react-navigation/stack'
import Button from 'components/Button'

type StackParamList = {
  Create: undefined;
  Home: undefined;
  Join: undefined;
  Party: undefined;
}

type NavigationProp = StackNavigationProp<
  StackParamList,
  'Home'
>

type Props = {
  navigation: NavigationProp;
}

const HomeScreen = React.memo((props: Props): React.ReactElement => {
  const { navigation } = props

  return (
    <View style={styles.container}>
      <Text>Welcome to Let&apos;s Fork!</Text>
      <View style={styles.buttons}>
        <Button onPress={(): void => navigation.navigate('Create')}>
          Create
        </Button>
        <Button onPress={(): void => navigation.navigate('Join')}>
          Join A Party
        </Button>
      </View>
    </View>
  )
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
})

export default HomeScreen
