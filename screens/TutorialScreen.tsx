import React from 'react'
import {
  View, StyleSheet, AsyncStorage, Dimensions,
} from 'react-native'
import Text from 'components/Text'
import AppIntroSlider from 'react-native-app-intro-slider'
import colors from 'utils/colors'

const slides = [
  {
    key: '1',
    title: "Welcome to Let's Fork",
    text: 'swipe right on your next favorite restaurant',
    backgroundColor: colors.purple,
  },
  {
    key: '2',
    title: "Let's Fork",
    text: 'makes deciding on food with friends easy',
    backgroundColor: colors.blue,
  },
  {
    key: '3',
    title: 'Get Started',
    text: 'by creating or joining a party and\nswiping with your friends',
    backgroundColor: colors.persianGreen,
  },
]

type Slide = {
  key: string;
  title: string;
  text: string;
  backgroundColor: string;
}

type Props = {
  setShowApp: React.Dispatch<React.SetStateAction<boolean>>;
}

const { height } = Dimensions.get('screen')

const TutorialScreen = React.memo((props: Props): React.ReactElement => {
  const { setShowApp } = props


  const renderItem = ({ item }: { item: Slide }): React.ReactElement => (
    <View
      style={{
        ...styles.slide,
        backgroundColor: item.backgroundColor,
      }}
    >
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.text}>{item.text}</Text>
    </View>
  )


  const onDone = (): void => {
    setShowApp(true)
    AsyncStorage.setItem('showApp', 'true')
  }

  return (
    <AppIntroSlider
      renderItem={renderItem}
      data={slides}
      onDone={onDone}
    />
  )
})

export default TutorialScreen

const styles = StyleSheet.create({
  slide: {
    height,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 120,
  },
  title: {
    color: colors.white,
    fontSize: 32,
    textAlign: 'center',
    paddingTop: 20,
    paddingBottom: 20,
  },
  text: {
    color: colors.white,
    textAlign: 'center',
  },
})
