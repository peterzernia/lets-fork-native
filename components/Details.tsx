import React from 'react'
import {
  View,
  StyleSheet,
  Linking,
  Dimensions,
  Platform,
  Image,
  ScrollView,
  Animated,
} from 'react-native'
import TouchableOpacity from 'components/BottomSheetTouchable'
import Text from 'components/Text'
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
  photos?: boolean;
}

const { width, height } = Dimensions.get('window')

export default function Details(props: Props): React.ReactElement {
  const headerHeight = useHeaderHeight()
  const { restaurant: defaultRestaurant, photos } = props
  const [restaurant, setRestaurant] = React.useState(defaultRestaurant)

  React.useEffect(() => {
    const fetchData = async (): Promise<void> => {
      // More details about the restaurant can be fetched from
      // the server. This can be triggered off a feature flag in the future.
      // For the time being this saves on api requests to yelp.
      if (false) { // eslint-disable-line
        try {
          const rest = await getRestaurant(defaultRestaurant.id)
          setRestaurant({
            ...rest,
            ...defaultRestaurant,
          })
        } catch (err) {
          console.log(err)
        }
      } else {
        setRestaurant(defaultRestaurant)
      }
    }

    fetchData()
  }, [defaultRestaurant])

  const imageHeight = env.ADS
    ? height - headerHeight - 50
    : height - headerHeight

  const images = [(
    <Image
      key={restaurant.image_url}
      style={{
        ...styles.image,
        height: imageHeight,
      }}
      source={{ uri: restaurant.image_url, cache: 'force-cache' }}
    />
  )]

  if (restaurant.photos?.length) {
    restaurant.photos.forEach((url) => {
      if (url !== restaurant.image_url) {
        images.push(
          <Image
            key={url}
            style={{
              ...styles.image,
              height: imageHeight,
            }}
            source={{ uri: url, cache: 'force-cache' }}
          />,
        )
      }
    })
  }

  return (
    <View
      style={{
        ...styles.container,
        minHeight: (height - headerHeight) * 0.8,
      }}
    >
      {
        photos ? (
          <ScrollView
            horizontal
            alwaysBounceHorizontal={false}
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
        ) : null
      }
      <View>
        <Text style={[styles.text, styles.name]}>{restaurant.name}</Text>
        <View style={styles.rating}>
          <Rating rating={restaurant.rating} size="sm" />
          <Text style={styles.text}>{`•   ${restaurant.review_count} reviews`}</Text>
        </View>
        <Text
          style={styles.text}
        >
          {
            restaurant.price
              ? `${restaurant.price}   •   ${restaurant?.categories?.map((c) => c.title).join(', ')}`
              : restaurant?.categories?.map((c) => c.title).join(', ')
          }
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
                region={{
                  latitude: restaurant.coordinates.latitude,
                  longitude: restaurant.coordinates.longitude,
                  latitudeDelta: 0.005,
                  longitudeDelta: 0.05,
                }}
                style={styles.map}
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
          ) : null
      }
      <TouchableOpacity
        style={styles.section}
        onPress={(): void => {
          const url = Platform.select({
            ios: `maps:0,0?q=${restaurant.coordinates.latitude},${restaurant.coordinates.longitude}`,
            android: `geo:0,0?q=${restaurant.coordinates.latitude},${restaurant.coordinates.longitude}`,
          })
          if (url) {
            Linking.openURL(url)
          }
        }}
      >
        <Text style={styles.directionText}>Get Directions</Text>
        <MaterialIcons name="directions" size={32} />
      </TouchableOpacity>
      {
        restaurant.hours
          ? <Hours hours={restaurant.hours} />
          : null
      }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
  },
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
    maxHeight: 200,
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
    maxHeight: 80,
  },
  name: {
    fontSize: 24,
    fontWeight: 'normal',
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
