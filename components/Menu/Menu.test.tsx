import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import Menu from 'components/Menu'

test('Menu', () => {
  const navigation: any = { // eslint-disable-line
    navigate: jest.fn(),
  }

  const { getAllByTestId, getAllByRole } = render(
    <Menu navigation={navigation} />,
  )

  let modal = getAllByTestId('modal')
  expect(modal[0].props.visible).toEqual(false)

  const buttons = getAllByRole('button')
  fireEvent.press(buttons[0])

  modal = getAllByTestId('modal')
  expect(modal[0].props.visible).toEqual(true)

  fireEvent.press(buttons[1])
  expect(navigation.navigate).toBeCalledWith('Share')

  fireEvent.press(buttons[2])
  expect(navigation.navigate).toBeCalledWith('Match')
})
