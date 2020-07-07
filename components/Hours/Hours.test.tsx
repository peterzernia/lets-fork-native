import React from 'react'
import { render } from '@testing-library/react-native'
import Hours from 'components/Hours'
import { Hours as HoursType } from 'types'
import * as phone from 'utils/phone'

const hours: HoursType[] = [{
  hours_type: 'REGULAR',
  is_open_now: true,
  open: [
    {
      day: 0,
      end: '2300',
      is_overnight: false,
      start: '0500',
    },
    {
      day: 1,
      end: '2300',
      is_overnight: false,
      start: '0500',
    },
    {
      day: 2,
      end: '2300',
      is_overnight: false,
      start: '0500',
    },
    {
      day: 3,
      end: '2300',
      is_overnight: false,
      start: '0500',
    },
    {
      day: 4,
      end: '2300',
      is_overnight: false,
      start: '0500',
    },
    {
      day: 5,
      end: '2300',
      is_overnight: false,
      start: '0500',
    },
  ],
}]

test('Hours', () => {
  jest.spyOn(phone, 'getLocale').mockReturnValue('en_US')
  const { getByText, getAllByText, rerender } = render(
    <Hours />,
  )

  try {
    getByText('Moday') // No hours initially
  } catch {
    getByText('Hours')
  }

  rerender(<Hours hours={hours} />)
  getByText('Closed') // on Sundays (no day 6 hours)
  getAllByText('5:00am - 11:00pm')


  // Shows 24hr clock when not in US, UK, etc
  jest.spyOn(phone, 'getLocale').mockReturnValue('de_DE')
  rerender(<Hours hours={hours} />)
  try {
    getAllByText(/am/i)
  } catch {
    getAllByText('05:00 - 23:00')
  }
})
