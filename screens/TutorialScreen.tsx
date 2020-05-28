import React from 'react'
import {
  View, StyleSheet, AsyncStorage, Text as RNText, Platform,
} from 'react-native'
import Text from 'components/Text'
import AppIntroSlider from 'react-native-app-intro-slider'
import { MaterialIcons } from '@expo/vector-icons'
import colors from 'utils/colors'

const slides = [
  {
    key: '1',
    text: 'Swipe right on your\nnext favorite restaurant',
  },
  {
    key: '2',
    text: "Deciding on food doesn't have to be hard",
  },
  {
    key: '3',
    text: 'Get started by creating a party,\nchoosing your location, and inviting\nfriends to start swiping',
  },
]

type Slide = {
  key: string;
  text: string;
}

type Props = {
  setShowApp: React.Dispatch<React.SetStateAction<boolean>>;
}

const TutorialScreen = React.memo((props: Props): React.ReactElement => {
  const { setShowApp } = props


  const renderItem = ({ item }: { item: Slide }): React.ReactElement => (
    <View style={styles.slide}>
      <Text style={styles.text}>{item.text}</Text>
    </View>
  )


  const onDone = (): void => {
    setShowApp(true)
    AsyncStorage.setItem('showApp', 'true')
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <MaterialIcons style={styles.icon} name="restaurant" color={colors.white} size={26} />
        <RNText style={styles.header}>Let&apos;s Fork</RNText>
      </View>
      <AppIntroSlider
        renderItem={renderItem}
        data={slides}
        onDone={onDone}
      />
    </View>
  )
})

export default TutorialScreen

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.purple,
    flex: 1,
    paddingTop: 40,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    fontFamily: 'VarelaRound_400Regular',
    color: colors.white,
    fontSize: 32,
    textAlign: 'center',
    paddingTop: Platform.OS === 'ios' ? 3 : 0,
  },
  icon: {
    paddingRight: 8,
  },
  slide: {
    flexGrow: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 40,
  },
  text: {
    fontSize: 16,
    color: colors.white,
    textAlign: 'center',
  },
})
