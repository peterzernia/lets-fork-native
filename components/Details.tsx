import React from 'react'
import {
  View, Text, TouchableOpacity, StyleSheet, Linking, Dimensions, Platform,
} from 'react-native'
import MapView, { Marker } from 'react-native-maps'
import { MaterialIcons, FontAwesome } from '@expo/vector-icons'
import { Restaurant } from 'types'
import { call } from 'utils/phone'

type Props = {
  restaurant: Restaurant;
}

const { width } = Dimensions.get('window')

export default function Details(props: Props): React.ReactElement {
  const { restaurant } = props
  const [region, setRegion] = React.useState({
    latitude: restaurant.coordinates.latitude,
    longitude: restaurant.coordinates.longitude,
    latitudeDelta: 0.001,
    longitudeDelta: 0.01,
  })

  return (
    <View>
      <Text>{`${restaurant.price} • ${restaurant.categories.map((category) => category.title).join(', ')}`}</Text>
      <Text>{ restaurant.rating }</Text>
      <View style={styles.icons}>
        <TouchableOpacity onPress={(): void => call(restaurant.display_phone)}>
          <MaterialIcons name="phone" size={32} />
        </TouchableOpacity>
        <TouchableOpacity onPress={(): Promise<any> => Linking.openURL(restaurant.url)}>
          <FontAwesome name="yelp" size={32} />
        </TouchableOpacity>
      </View>
      { restaurant.transactions.length ? <Text>{ restaurant.transactions.join(', ') }</Text> : null }
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
        <View style={styles.directions}>
          <Text>Get Directions</Text>
          <MaterialIcons name="directions" size={32} />
        </View>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  icons: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
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
  directions: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 80,
    fontWeight: 'bold',
  },
})
