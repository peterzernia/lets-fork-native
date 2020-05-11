import React from 'react'
import { Image, ImageSourcePropType, StyleSheet } from 'react-native'
import a from 'assets/stars/extra_large_0.png'
import b from 'assets/stars/extra_large_1.png'
import c from 'assets/stars/extra_large_1_half.png'
import d from 'assets/stars/extra_large_2.png'
import e from 'assets/stars/extra_large_2_half.png'
import f from 'assets/stars/extra_large_3.png'
import g from 'assets/stars/extra_large_3_half.png'
import h from 'assets/stars/extra_large_4.png'
import i from 'assets/stars/extra_large_4_half.png'
import j from 'assets/stars/extra_large_5.png'

type Props = {
  rating: number;
  size: 'sm' | 'lg';
}

type ratings = {
  [key: number]: ImageSourcePropType;
}

const RATINGS: ratings = {
  0: a,
  1: b,
  1.5: c,
  2: d,
  2.5: e,
  3: f,
  3.5: g,
  4: h,
  4.5: i,
  5: j,
}

export default function Rating(props: Props): React.ReactElement {
  const { rating, size } = props

  return (
    <Image
      style={{
        ...styles.image,
        width: size === 'lg' ? 160 : 80,
      }}
      source={RATINGS[rating]}
    />
  )
}

const styles = StyleSheet.create({
  image: {
    marginTop: -28,
    marginBottom: -28,
    resizeMode: 'contain',
  },
})
