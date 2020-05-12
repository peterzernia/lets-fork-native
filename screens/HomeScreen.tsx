import React from 'react'
import {
  StyleSheet, View, Text, ImageBackground, TouchableOpacity, Platform,
} from 'react-native'
import { StackNavigationProp } from '@react-navigation/stack'
import homeImage from 'assets/home.jpg'
import colors from 'utils/colors'

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
    <ImageBackground style={styles.container} source={homeImage}>
      <Text style={styles.header}>Let&apos;s Fork</Text>
      <View style={styles.buttons}>
        <TouchableOpacity
          onPress={(): void => navigation.navigate('Create')}
        >
          <Text style={styles.button}>
            Create
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={(): void => navigation.navigate('Join')}
        >
          <Text style={styles.button}>
            Join
          </Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  )
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 32,
    paddingBottom: 32,
  },
  header: {
    marginTop: 96,
    color: colors.white,
    fontSize: 48,
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'android' ? 'serif' : 'Georgia',
  },
  buttons: {
    paddingTop: 32,
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  button: {
    color: colors.white,
    fontSize: 28,
    fontFamily: 'serif',
  },
})

export default HomeScreen
