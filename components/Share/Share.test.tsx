import React from 'react'
import { Share as RNShare } from 'react-native'
import { render, fireEvent } from '@testing-library/react-native'
import Share from 'components/Share'
import { Party } from 'types'
import { createStackNavigator } from '@react-navigation/stack'
import { NavigationContainer } from '@react-navigation/native'

const party: Party = { id: '123456', status: 'waiting' }

const Stack = createStackNavigator()

test('Share', () => {
  const shareSpy = jest.spyOn(RNShare, 'share')

  const { getAllByRole } = render(
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Details"
        >
          {(props): React.ReactElement => (
            <Share {...props} party={party} />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>,
  )

  const button = getAllByRole('button')[1]
  fireEvent.press(button)
  expect(shareSpy).toBeCalledTimes(1)
})
