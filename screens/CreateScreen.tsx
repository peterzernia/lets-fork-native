
import React from 'react'
import {
  View,
  StyleSheet,
  Dimensions,
  Slider,
  ScrollView,
  Switch,
} from 'react-native'
import Text from 'components/Text'
import ReconnectingWebSocket from 'reconnecting-websocket'
import { StackNavigationProp } from '@react-navigation/stack'
import MapView, { Circle } from 'react-native-maps'
import Button from 'components/Button'
import MultiSelect from 'components/MultiSelect'
import Price from 'components/Price'
import { LocationData } from 'expo-location'
import colors from 'utils/colors'
import { getLocale } from 'utils/phone'
import currencies from 'utils/currencies'
import { CATEGORIES } from 'utils/constants'

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
  ws: ReconnectingWebSocket;
}

const { width } = Dimensions.get('window')

const UNITS = {
  minimumValue: {
    metric: 500,
    imperial: 804,
  },
  maximumValue: {
    metric: 10000,
    imperial: 9648,
  },
  step: {
    metric: 500,
    imperial: 804,
  },
  // conversion from meters to km or mi
  conversion: {
    metric: 1000,
    imperial: 1609.344,
  },
  initialRadius: {
    metric: 2000,
    imperial: 2412,
  },
  units: {
    metric: 'km',
    imperial: 'mi',
  },
}

const CreateScreen = React.memo((props: Props): React.ReactElement => {
  const locale = getLocale()
  const countries = ['LR', 'MM', 'US']
  const system = countries.includes(locale.substring(3)) ? 'imperial' : 'metric'

  const units = UNITS.units[system]
  const conversion = UNITS.conversion[system]
  const symbol = currencies[locale.substring(3)] || '$'

  const { location, navigation, ws } = props
  const [categories, setCategories] = React.useState<string[]>([])
  const [price, setPrice] = React.useState([false, false, false, false])
  const [openNow, setOpenNow] = React.useState(true)
  const [radius, setRadius] = React.useState(UNITS.initialRadius[system])
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
        categories: categories.length ? categories.join(',') : 'restaurants',
        latitude: `${region.latitude}`,
        longitude: `${region.longitude}`,
        radius: `${radius}`,
        open_now: openNow,
        price: pr.length ? pr : null,
      },
    }))
    navigation.navigate('Party')
  }

  return (
    <ScrollView>
      <MapView
        style={styles.map}
        region={region}
        onRegionChangeComplete={setRegion}
        rotateEnabled={false}
        scrollEnabled
        zoomEnabled
      >
        <Circle
          center={region}
          radius={radius}
        />
      </MapView>
      <Text style={styles.radius}>
        {`Find restaurants within: ${(radius / conversion).toFixed(1)}${units}`}
      </Text>
      <Slider
        style={styles.slider}
        minimumValue={UNITS.minimumValue[system]}
        maximumValue={UNITS.maximumValue[system]}
        minimumTrackTintColor={colors.green}
        maximumTrackTintColor={colors.green}
        value={radius}
        onValueChange={setRadius}
        step={UNITS.step[system]}
      />
      <View style={styles.openNow}>
        <Switch
          style={styles.switch}
          value={openNow}
          onValueChange={setOpenNow}
        />
        <Text style={styles.openNowText}>{openNow ? 'Currently open' : 'All restaurants'}</Text>
      </View>
      <View style={styles.price}>
        <Price selected={price} setSelected={setPrice} n={1}>{symbol}</Price>
        <Price selected={price} setSelected={setPrice} n={2}>{symbol}</Price>
        <Price selected={price} setSelected={setPrice} n={3}>{symbol}</Price>
        <Price selected={price} setSelected={setPrice} n={4}>{symbol}</Price>
      </View>
      <MultiSelect
        handleSelect={setCategories}
        items={CATEGORIES}
      />
      <View style={styles.button}>
        <Button color="purple" size="sm" onPress={(): void => handleCreate()}>
          CREATE
        </Button>
      </View>
    </ScrollView>
  )
})

export default CreateScreen

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
    margin: 16,
  },
  openNow: {
    marginTop: 8,
    marginBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
  },
  openNowText: {
    fontWeight: 'bold',
    marginLeft: 16,
  },
  switch: {
    alignSelf: 'flex-start',
    marginLeft: 16,
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
