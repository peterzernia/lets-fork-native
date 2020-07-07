import React from 'react'
import { render } from '@testing-library/react-native'
import Rating from 'components/Rating'
import { toMatchDiffSnapshot } from 'snapshot-diff'

expect.extend({ toMatchDiffSnapshot })

test('Rating', () => {
  const { rerender, asJSON } = render(
    <Rating size="sm" rating={4} />,
  )

  const firstRender = asJSON()

  rerender(
    <Rating size="lg" rating={4} />,
  )

  expect(firstRender).toMatchDiffSnapshot(asJSON())

  rerender(
    <Rating size="sm" rating={3} />,
  )

  expect(firstRender).toMatchDiffSnapshot(asJSON())
})
