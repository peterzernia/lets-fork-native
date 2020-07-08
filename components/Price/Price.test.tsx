import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import Price from 'components/Price'

test('Price', () => {
  const handleSelected = jest.fn()

  const { getByRole } = render(
    <Price n={1} selected={[false, false]} setSelected={handleSelected}>
      $
    </Price>,
  )

  const button = getByRole('button')

  fireEvent.press(button)

  expect(handleSelected).toBeCalledWith([true, false])
})
