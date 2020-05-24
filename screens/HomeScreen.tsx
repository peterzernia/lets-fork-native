import React from 'react'
import {
  StyleSheet, View, Text, Platform,
} from 'react-native'
import Button from 'components/Button'
import { StackNavigationProp } from '@react-navigation/stack'
import colors from 'utils/colors'
import { MaterialIcons } from '@expo/vector-icons'

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
      <View style={styles.headerContainer}>
        <MaterialIcons style={styles.icon} name="restaurant" color={colors.white} size={40} />
        <Text style={styles.header}>Let&apos;s Fork</Text>
      </View>
      <View>
        <Button
          color="white"
          size="lg"
          onPress={(): void => navigation.navigate('Create')}
        >
          CREATE A PARTY
        </Button>
        <Button
          color="white"
          size="lg"
          onPress={(): void => navigation.navigate('Join')}
        >
          JOIN A PARTY
        </Button>
      </View>
    </View>
  )
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.purple,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 140,
    paddingBottom: 64,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    paddingRight: 8,
  },
  header: {
    color: colors.white,
    fontSize: 48,
    fontFamily: 'VarelaRound_400Regular',
    paddingTop: Platform.OS === 'ios' ? 4 : 0,
  },
})

export default HomeScreen
