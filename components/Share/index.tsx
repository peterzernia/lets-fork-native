import React from 'react'
import {
  View, TouchableOpacity, Platform, StyleSheet, ShareAction, Share as RNShare, Dimensions,
} from 'react-native'
import { useHeaderHeight } from '@react-navigation/stack'
import Text from 'components/Text'
import { MaterialIcons, Ionicons } from '@expo/vector-icons'
import QRCode from 'react-native-qrcode-svg'
import env from 'env'
import { Party } from 'types'

type Props = {
  party: Party;
}

const { height } = Dimensions.get('window')

// Initially shown while waiting for users to join party
// But can also be accessed through Menu for additional
// users to join after party has started
export default function Share(props: Props): React.ReactElement {
  const { party } = props
  const headerHeight = useHeaderHeight()
  const viewHeight = env.ADS ? height - headerHeight - 50 : height - headerHeight

  return (
    <View
      style={{
        ...styles.container,
        height: viewHeight,
      }}
    >
      <Text style={styles.text}>Share this code with friends to have them join your party.</Text>
      <Text style={styles.code}>{party.id}</Text>
      <QRCode
        size={200}
        value={`https://letsfork.app/party/${party.id}`}
      />
      <TouchableOpacity
        accessibilityRole="button"
        onPress={(): Promise<ShareAction> => RNShare.share(
          { message: `Join my party on Let's Fork by clicking this link:\nhttps://letsfork.app/party/${party.id}\n\nor by opening the app and entering the code ${party.id}` },
        )}
      >
        {Platform.OS === 'ios' ? (
          <Ionicons name="ios-share-alt" size={32} />
        ) : (
          <MaterialIcons name="share" size={32} />
        )}
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  text: {
    paddingLeft: 32,
    paddingRight: 32,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  code: {
    fontWeight: 'bold',
    fontSize: 36,
  },
})
