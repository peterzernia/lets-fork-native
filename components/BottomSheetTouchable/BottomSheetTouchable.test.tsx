import React from 'react'
import { render } from '@testing-library/react-native'
import BottomSheetTouchable from 'components/BottomSheetTouchable'

test('BottomSheetTouchable', () => {
  // defaults to ios in test
  const { getByRole, rerender } = render(
    <BottomSheetTouchable>
      Touch me
    </BottomSheetTouchable>,
  )

  let touchable = getByRole('button')
  expect(touchable.type).toEqual('TouchableOpacity')

  jest.mock('react-native/Libraries/Utilities/Platform', () => {
    const Platform = {
      OS: 'android',
    }
    return Platform
  })

  rerender(
    <BottomSheetTouchable>
      Touch me
    </BottomSheetTouchable>,
  )

  touchable = getByRole('button')
  // react-native-gesture-handler touchable is wrapped in a view
  expect(touchable.type).toEqual('View')
})
