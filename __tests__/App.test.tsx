import * as React from 'react'
import { View } from 'react-native'
import { render } from 'react-native-testing-library'

describe('runs basic test', () => {
  it('renders a view', () => {
    render(<View />)
  })
})
