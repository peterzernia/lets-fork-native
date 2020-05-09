import React from 'react'
import { View, StyleSheet } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import colors from 'utils/colors'

type StarProps = {
  fill: 'full' | 'half';
  size: 'sm' | 'lg';
}

function Star(props: StarProps): React.ReactElement {
  const { fill, size } = props

  const SIZES = {
    sm: 12,
    lg: 32,
  }

  const COLORS = {
    sm: colors.black,
    lg: colors.white,
  }

  return (
    <View style={
      fill === 'half' && { width: SIZES[size] / 2 }
    }
    >
      <MaterialIcons
        name="star"
        size={SIZES[size]}
        color={COLORS[size]}
      />
    </View>
  )
}


type RatingProps = {
  rating: number;
  size: 'sm' | 'lg';
}

export default function Rating(props: RatingProps): React.ReactElement {
  const { rating, size } = props

  const stars = [...Array(Math.floor(rating))].map((e, i: number) => (
    <Star key={i} size={size} fill="full" /> // eslint-disable-line react/no-array-index-key
  ))

  if (rating - Math.floor(rating) > 0) {
    stars.push(<Star key={0.5} size={size} fill="half" />)
  }

  return (
    <View style={styles.rating}>
      {stars}
    </View>
  )
}

const styles = StyleSheet.create({
  rating: {
    flexDirection: 'row',
  },
})
