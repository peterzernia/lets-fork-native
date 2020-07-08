import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import MultiSelect from 'components/MultiSelect'
import { CATEGORIES } from 'utils/constants'

test('MultiSelect', () => {
  const handleSelect = jest.fn()

  const { getAllByRole, getByText, getAllByTestId } = render(
    <MultiSelect items={CATEGORIES} handleSelect={handleSelect} />,
  )

  let modal = getAllByTestId('modal')
  expect(modal[0].props.visible).toEqual(false)

  const openButton = getByText(/Filter by Categories/i)
  fireEvent.press(openButton)

  modal = getAllByTestId('modal')
  expect(modal[0].props.visible).toEqual(true)

  // Clicking first button adds category to selected categories
  const categoryButtons = getAllByRole('button')
  fireEvent.press(categoryButtons[0])
  expect(handleSelect).toBeCalledWith([CATEGORIES[0].id])

  // Clicking first button again removes
  fireEvent.press(categoryButtons[0])
  expect(handleSelect).toBeCalledWith([])
})
