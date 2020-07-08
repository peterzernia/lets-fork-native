import React from 'react'
import { render } from '@testing-library/react-native'
import SwipeWindow from 'components/SwipeWindow'
import { restaurant } from 'mock'

test('SwipeWindow', () => {
  const handleSwipeRight = jest.fn()
  const setFinished = jest.fn()
  const setRestaurants = jest.fn()

  render(
    <SwipeWindow
      restaurants={[restaurant]}
      handleSwipeRight={handleSwipeRight}
      setFinished={setFinished}
      setRestaurants={setRestaurants}
    />,
  )
})
