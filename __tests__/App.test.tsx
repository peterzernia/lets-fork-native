import * as React from 'react'
import { View } from 'react-native'
import { render } from '@testing-library/react-native'

describe('runs basic test', () => {
  it('renders a view', () => {
    render(<View />)
  })
})
