
import React from 'react'
import {
  View,
  StyleSheet,
  Dimensions,
  Slider,
  Text,
  ScrollView,
} from 'react-native'
import { StackNavigationProp } from '@react-navigation/stack'
import MapView, { Circle } from 'react-native-maps'
import Button from 'components/Button'
import Price from 'components/Price'
import { LocationData } from 'expo-location'
import colors from 'utils/colors'

type StackParamList = {
  Party: undefined;
  Join: undefined;
}

type NavigationProp = StackNavigationProp<
  StackParamList,
  'Join'
>

type Props = {
  location?: LocationData;
  navigation: NavigationProp;
  ws: WebSocket;
}

const { width } = Dimensions.get('window')

const JoinScreen = React.memo((props: Props): React.ReactElement => {
  const { location, navigation, ws } = props
  const [price, setPrice] = React.useState([false, false, false, false])
  const [radius, setRadius] = React.useState(2000)
  const [region, setRegion] = React.useState({
    latitude: location?.coords?.latitude || 52.520008,
    longitude: location?.coords?.longitude || 13.404954,
    latitudeDelta: 0.01,
    longitudeDelta: 0.1,
  })

  // creates a new party
  const handleCreate = (): void => {
    const pr: number[] = []
    price.forEach((p, i) => {
      if (p) pr.push(i + 1)
    })

    ws.send(JSON.stringify({
      type: 'create',
      payload: {
        latitude: `${region.latitude}`,
        longitude: `${region.longitude}`,
        radius: `${radius}`,
        price: pr.length ? pr : null,
      },
    }))
    navigation.navigate('Party')
  }

  const symbol = '$'

  return (
    <ScrollView>
      <MapView
        initialRegion={region}
        style={styles.map}
        onRegionChange={setRegion}
        rotateEnabled={false}
        scrollEnabled
        zoomEnabled
      >
        <Circle
          center={region}
          radius={radius}
        />
      </MapView>
      <Text style={styles.radius}>{`Find restaurants within: ${(radius / 1000).toFixed(1)}km`}</Text>
      <Slider
        style={styles.slider}
        minimumValue={500}
        maximumValue={10000}
        minimumTrackTintColor={colors.green}
        maximumTrackTintColor={colors.green}
        value={radius}
        onValueChange={setRadius}
        step={500}
      />
      <View style={styles.price}>
        <Price selected={price} setSelected={setPrice} n={1}>{symbol}</Price>
        <Price selected={price} setSelected={setPrice} n={2}>{symbol}</Price>
        <Price selected={price} setSelected={setPrice} n={3}>{symbol}</Price>
        <Price selected={price} setSelected={setPrice} n={4}>{symbol}</Price>
      </View>
      <View style={styles.button}>
        <Button onPress={(): void => handleCreate()}>
          Create
        </Button>
      </View>
    </ScrollView>
  )
})

export default JoinScreen

const styles = StyleSheet.create({
  mapContainer: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    height: 300,
    width,
  },
  radius: {
    padding: 16,
    fontWeight: 'bold',
  },
  slider: {
    padding: 16,
  },
  price: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
})
