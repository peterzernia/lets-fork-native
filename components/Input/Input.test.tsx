import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import Input from 'components/Input'

test('Input', () => {
  const handleChange = jest.fn()
  const famousWomanInHistory = 'Ada Lovelace'

  const { getByPlaceholderText } = render(
    <Input placeholder="Input" value="" handleChange={handleChange} />,
  )

  const input = getByPlaceholderText('Input')
  fireEvent.changeText(input, famousWomanInHistory)

  expect(handleChange).toBeCalledWith(famousWomanInHistory)
})
