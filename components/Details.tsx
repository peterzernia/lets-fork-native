import React from 'react'
import {
  View, Text, TouchableOpacity, StyleSheet, Linking, Dimensions, Platform, Image,
} from 'react-native'
import MapView, { Marker } from 'react-native-maps'
import { MaterialIcons, FontAwesome } from '@expo/vector-icons'
import { Restaurant } from 'types'
import { call } from 'utils/phone'
import { getRestaurant } from 'utils/api'

type Props = {
  restaurant: Restaurant;
}

const { width } = Dimensions.get('window')

export default function Details(props: Props): React.ReactElement {
  const { restaurant: defaultRestaurant } = props
  const [restaurant, setRestaurant] = React.useState(defaultRestaurant)
  const [region, setRegion] = React.useState({
    latitude: restaurant.coordinates.latitude,
    longitude: restaurant.coordinates.longitude,
    latitudeDelta: 0.001,
    longitudeDelta: 0.01,
  })

  React.useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        const rest = await getRestaurant(restaurant.id)
        setRestaurant(rest)
      } catch (err) {
        console.log(err)
      }
    }

    fetchData()
  }, [restaurant.id])

  // rating
  // transacitons

  return (
    <View>
      { restaurant.photos
        && <Image style={styles.image} source={{ uri: restaurant?.photos[0] }} /> }
      <View style={styles.section}>
        <Text
          style={styles.text}
        >
          {`${restaurant.price} • ${restaurant.categories.map((category) => category.title).join(', ')}`}
        </Text>
      </View>
      <View style={styles.section}>
        <TouchableOpacity onPress={(): void => call(restaurant.display_phone)}>
          <MaterialIcons name="phone" size={32} />
        </TouchableOpacity>
        <TouchableOpacity onPress={(): Promise<any> => Linking.openURL(restaurant.url)}>
          <FontAwesome name="yelp" size={32} />
        </TouchableOpacity>
      </View>
      <View style={styles.mapContainer}>
        <MapView
          region={region}
          style={styles.map}
          onRegionChange={setRegion}
          rotateEnabled={false}
          scrollEnabled={false}
          zoomEnabled={false}
        >
          <Marker
            coordinate={{
              latitude: restaurant.coordinates.latitude,
              longitude: restaurant.coordinates.longitude,
            }}
            title={restaurant.name}
          />
        </MapView>
      </View>
      <TouchableOpacity onPress={(): void => {
        const url = Platform.select({
          ios: `maps:0,0?q=${restaurant.coordinates.latitude},${restaurant.coordinates.longitude}`,
          android: `geo:0,0?q=${restaurant.coordinates.latitude},${restaurant.coordinates.longitude}`,
        })
        if (url) {
          Linking.openURL(url)
        }
      }}
      >
        <View style={styles.section}>
          <Text style={styles.text}>Get Directions</Text>
          <MaterialIcons name="directions" size={32} />
        </View>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  image: {
    width,
    height: 300,
    resizeMode: 'cover',
  },
  mapContainer: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    height: 200,
    width,
  },
  section: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 80,
  },
  text: {
    fontWeight: 'bold',
  },
})
