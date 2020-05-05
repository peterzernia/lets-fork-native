import React from 'react'
import { View, StyleSheet } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'

type StarProps = {
  fill: 'full' | 'half';
}

function Star(props: StarProps): React.ReactElement {
  const { fill } = props

  return (
    <View style={fill === 'half' && styles.half}>
      <MaterialIcons styles={styles.half} name="star" size={32} color="white" />
    </View>
  )
}


type RatingProps = {
  rating: number;
}

export default function Rating(props: RatingProps): React.ReactElement {
  const { rating } = props

  const stars = [...Array(Math.floor(rating))].map((e, i: number) => (
    <Star key={i} fill="full" /> // eslint-disable-line react/no-array-index-key
  ))

  if (rating - Math.floor(rating) > 0) {
    stars.push(<Star key={0.5} fill="half" />)
  }

  return (
    <View style={styles.rating}>
      {stars}
    </View>
  )
}

const styles = StyleSheet.create({
  half: {
    width: 16,
  },
  rating: {
    flexDirection: 'row',
  },
})
