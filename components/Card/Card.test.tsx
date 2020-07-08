import React from 'react'
import { render } from '@testing-library/react-native'
import Card from 'components/Card'
import { restaurant } from 'mock'

test('Card', () => {
  render(
    <Card
      restaurant={restaurant}
      leftOpacity={0}
      rightOpacity={0}
      textOpacity={0}
    />,
  )
})
