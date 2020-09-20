import React from 'react'
import {
  View,
  TouchableOpacity,
  Platform,
  StyleSheet,
  ShareAction,
  Share as RNShare,
  Dimensions,
  Alert,
  ActivityIndicator,
} from 'react-native'
import { useHeaderHeight } from '@react-navigation/stack'
import Text from 'components/Text'
import Button from 'components/Button'
import { MaterialIcons, Ionicons } from '@expo/vector-icons'
import QRCode from 'react-native-qrcode-svg'
import env from 'env'
import { Party } from 'types'
import ReconnectingWebSocket from 'reconnecting-websocket'

type Props = {
  party: Party;
  ws?: ReconnectingWebSocket;
}

const { height } = Dimensions.get('window')

// Initially shown while waiting for users to join party
// But can also be accessed through Menu for additional
// users to join after party has started
export default function Share(props: Props): React.ReactElement {
  const [loading, setLoading] = React.useState(false)
  const { party, ws } = props
  const headerHeight = useHeaderHeight()
  const viewHeight = env.ADS ? height - headerHeight - 50 : height - headerHeight

  const handlePress = (): void => {
    Alert.alert(
      '',
      'No matches will be shown until another user joins',
      [
        {
          text: 'OK',
          onPress: (): void => {
            if (ws) {
              ws.send(JSON.stringify({ type: 'start-swiping' }))
              setLoading(true)
            }
          },
        },
      ],
      { cancelable: true },
    )
  }

  if (loading) {
    return (
      <View
        style={{
          ...styles.container,
          height: viewHeight,
        }}
      >
        <ActivityIndicator size="large" />
      </View>
    )
  }

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
      {
        party.status === 'waiting'
        && <Button color="purple" size="lg" onPress={(): void => handlePress()}>START SWIPING</Button>
      }
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
