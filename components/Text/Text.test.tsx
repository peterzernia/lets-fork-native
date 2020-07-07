import React from 'react'
import { render } from '@testing-library/react-native'
import Text from 'components/Text'

test('Text', () => {
  const { getByText } = render(
    <Text>
      Hello World
    </Text>,
  )

  const text = getByText('Hello World')
  expect(text.props.children).toEqual('Hello World')
})
