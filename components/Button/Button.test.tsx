import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import Button from 'components/Button'

test('Button', () => {
  const handlePress = jest.fn()

  const { getByText } = render(
    <Button
      onPress={handlePress}
      size="sm"
      color="purple"
    >
      Press Me
    </Button>,
  )

  const button = getByText('Press Me')
  fireEvent.press(button)
  expect(handlePress).toBeCalledTimes(1)
})
