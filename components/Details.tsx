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
import Rating from 'components/Rating'
import MapView, { Marker } from 'react-native-maps'
import { useHeaderHeight } from '@react-navigation/stack'
import { MaterialIcons, FontAwesome } from '@expo/vector-icons'
import { Restaurant } from 'types'
import { call } from 'utils/phone'
import { getRestaurant } from 'utils/api'
import colors from 'utils/colors'
import env from 'env'

type Props = {
  restaurant: Restaurant;
  setDetails: React.Dispatch<React.SetStateAction<Restaurant | undefined>>;
}

const { width, height } = Dimensions.get('window')

export default function Details(props: Props): React.ReactElement {
  const headerHeight = useHeaderHeight()
  const { restaurant: defaultRestaurant, setDetails } = props
  const [restaurant, setRestaurant] = React.useState(defaultRestaurant)

  React.useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        const rest = await getRestaurant(restaurant.id)
        setRestaurant({
          ...restaurant,
          ...rest,
        })
      } catch (err) {
        console.log(err)
      }
    }

    fetchData()
  }, [restaurant])

  const imageHeight = env.ADS
    ? height - headerHeight - 50
    : height - headerHeight

  const images = [(
    <TouchableOpacity
      key={restaurant.image_url}
      activeOpacity={1}
      onPress={(): void => setDetails(undefined)}
    >
      <Image
        style={{
          ...styles.image,
          height: imageHeight,
        }}
        source={{ uri: restaurant.image_url }}
      />
    </TouchableOpacity>
  )]

  if (restaurant.photos?.length) {
    restaurant.photos.forEach((url) => {
      if (url !== restaurant.image_url) {
        images.push(
          <TouchableOpacity
            key={url}
            activeOpacity={1}
            onPress={(): void => setDetails(undefined)}
          >
            <Image
              style={{
                ...styles.image,
                height: imageHeight,
              }}
              source={{ uri: url }}
            />
          </TouchableOpacity>,
        )
      }
    })
  }

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
        <Text style={styles.text}>{restaurant.name}</Text>
        <View style={styles.rating}>
          <Rating rating={restaurant.rating} size="sm" />
          <Text style={styles.text}>{`•   ${restaurant.review_count} reviews on Yelp`}</Text>
        </View>
        <Text
          style={styles.text}
        >
          {`${restaurant.price}   •   ${restaurant?.categories?.map((c) => c.title).join(', ')}`}
        </Text>
        { restaurant?.transactions?.length
          ? (
            <Text style={styles.text}>
              {restaurant.transactions.map((tran) => `${tran[0].toUpperCase()}${tran.replace('_', ' ').substring(1)}`).join('   •   ')}
            </Text>
          ) : null}
      </View>
      <View style={styles.section}>
        <TouchableOpacity onPress={(): void => call(restaurant.display_phone)}>
          <MaterialIcons name="phone" size={32} />
        </TouchableOpacity>
        <TouchableOpacity onPress={(): Promise<any> => Linking.openURL(restaurant.url)}>
          <FontAwesome name="yelp" size={32} color={colors.yelpRed} />
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
  rating: {
    paddingLeft: 16,
    paddingRight: 16,
    flexDirection: 'row',
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
    paddingTop: 8,
    paddingBottom: 8,
    fontSize: 14,
  },
  directionText: {
    fontWeight: 'bold',
  },
})
