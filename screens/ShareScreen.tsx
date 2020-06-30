import React from 'react'
import Share from 'components/Share'
import { Party } from 'types'

type Props = {
  party: Party;
}

const ShareScreen = React.memo((props: Props) => {
  const { party } = props
  return (
    <Share party={party} />
  )
})

export default ShareScreen
