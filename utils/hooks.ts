import React from 'react'
import { Party } from 'types'

// Hook to keep track of the previous state
// eslint-disable-next-line import/prefer-default-export
export const usePrevious = (value: Party): React.MutableRefObject<Party>['current'] => {
  const ref = React.useRef({} as Party)
  React.useEffect(() => {
    ref.current = value
  })
  return ref.current
}
