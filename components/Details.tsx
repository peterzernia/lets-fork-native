import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Dimensions,
  Platform,
  Image,
  ScrollView,
  Animated,
} from 'react-native'
import Hours from 'components/Hours'
import MapView, { Marker } from 'react-native-maps'
import { useHeaderHeight } from '@react-navigation/stack'
import { MaterialIcons, FontAwesome } from '@expo/vector-icons'
import { Restaurant } from 'types'
import { call } from 'utils/phone'
import { getRestaurant } from 'utils/api'
import Rating from 'components/Rating'

type Props = {
  restaurant: Restaurant;
}

const { width, height } = Dimensions.get('window')

export default function Details(props: Props): React.ReactElement {
  const headerHeight = useHeaderHeight()
  const { restaurant: defaultRestaurant } = props
  const [restaurant, setRestaurant] = React.useState(defaultRestaurant)

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

  const images = [
    <Image
      key={restaurant.image_url}
      style={{
        ...styles.image,
        height: height - headerHeight,
      }}
      source={{ uri: restaurant.image_url }}
    />,
  ]

  if (restaurant.photos?.length) {
    restaurant.photos.forEach((url) => {
      if (url !== restaurant.image_url) {
        images.push(
          <Image
            key={url}
            style={{
              ...styles.image,
              height: height - headerHeight,
            }}
            source={{ uri: url }}
          />,
        )
      }
    })
  }

  // transacitons

  return (
    <View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator
        scrollEventThrottle={10}
        pagingEnabled
        onScroll={
          Animated.event(
            [{ nativeEvent: { contentOffset: { x: new Animated.Value(0) } } }],
          )
        }
      >
        {images}
      </ScrollView>
      <View>
        <View style={styles.name}>
          <Text style={styles.text}>{`${restaurant.name} • `}</Text>
          <Rating rating={restaurant.rating} size="sm" />
        </View>
        <Text
          style={styles.text}
        >
          {`${restaurant.price} • ${restaurant?.categories?.map((c) => c.title).join(', ')}`}
        </Text>
        { restaurant?.transactions?.length
          ? (
            <Text style={styles.text}>
              {restaurant.transactions.map((tran) => `${tran[0].toUpperCase()}${tran.substring(1)}`).join(' • ')}
            </Text>
          ) : null}
      </View>
      <View style={styles.section}>
        <TouchableOpacity onPress={(): void => call(restaurant.display_phone)}>
          <MaterialIcons name="phone" size={32} />
        </TouchableOpacity>
        <TouchableOpacity onPress={(): Promise<any> => Linking.openURL(restaurant.url)}>
          <FontAwesome name="yelp" size={32} />
        </TouchableOpacity>
      </View>
      {
        restaurant?.coordinates?.latitude && restaurant?.coordinates?.longitude
          ? (
            <View style={styles.mapContainer}>
              <MapView
                initialRegion={{
                  latitude: restaurant.coordinates.latitude,
                  longitude: restaurant.coordinates.longitude,
                  latitudeDelta: 0.001,
                  longitudeDelta: 0.01,
                }}
                style={styles.map}
                rotateEnabled={false}
                scrollEnabled
                zoomEnabled
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
          ) : null
      }
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
          <Text style={styles.directionText}>Get Directions</Text>
          <MaterialIcons name="directions" size={32} />
        </View>
      </TouchableOpacity>
      <Hours hours={restaurant.hours} />
    </View>
  )
}

const styles = StyleSheet.create({
  image: {
    width,
    resizeMode: 'cover',
  },
  name: {
    flexDirection: 'row',
    alignItems: 'center',
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
    paddingLeft: 16,
    paddingTop: 16,
    paddingBottom: 16,
  },
  directionText: {
    fontWeight: 'bold',
  },
})
