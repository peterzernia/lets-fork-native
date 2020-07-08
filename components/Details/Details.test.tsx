import React from 'react'
import { render } from '@testing-library/react-native'
import Details from 'components/Details'
import { createStackNavigator } from '@react-navigation/stack'
import { NavigationContainer } from '@react-navigation/native'
import { restaurant } from 'mock'

const Stack = createStackNavigator()

test('Details', () => {
  render(
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Details"
        >
          {(props): React.ReactElement => (
            <Details
              {...props}
              restaurant={restaurant}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>,
  )
})
