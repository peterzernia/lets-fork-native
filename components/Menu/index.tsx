import React from 'react'
import {
  TouchableOpacity, StyleSheet, View, Platform,
} from 'react-native'
import { StackNavigationProp } from '@react-navigation/stack'
import { MaterialIcons, Ionicons } from '@expo/vector-icons'
import Modal from 'react-native-modal'
import Text from 'components/Text'

type StackParamList = {
  Match: undefined;
  Party: undefined;
  Share: undefined;
}

type NavigationProp = StackNavigationProp<
  StackParamList,
  'Party'
>

type Props = {
  navigation: NavigationProp;
}

export default function Menu(props: Props): React.ReactElement {
  const { navigation } = props
  const [open, setOpen] = React.useState(false)

  return (
    <TouchableOpacity
      accessibilityRole="button"
      style={styles.button}
      onPress={(): void => setOpen(true)}
    >
      <MaterialIcons name="more-vert" color="black" size={24} />
      <Modal
        isVisible={open}
        onBackdropPress={(): void => setOpen(false)}
        animationIn="fadeIn"
        animationOut="fadeOut"
        backdropColor="transparent"
        testID="modal"
      >
        <View style={styles.modal}>
          <TouchableOpacity
            accessibilityRole="button"
            style={styles.item}
            onPress={(): void => {
              setOpen(false)
              navigation.navigate('Share')
            }}
          >
            {Platform.OS === 'ios' ? (
              <Ionicons name="ios-share-outline" color="black" size={24} />
            ) : (
              <MaterialIcons name="share" color="black" size={24} />
            )}
            <Text style={styles.text}>Share</Text>
          </TouchableOpacity>
          <TouchableOpacity
            accessibilityRole="button"
            style={styles.item}
            onPress={(): void => {
              setOpen(false)
              navigation.navigate('Match')
            }}
          >
            <MaterialIcons name="menu" color="black" size={24} />
            <Text style={styles.text}>Matches</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    paddingRight: 16,
  },
  modal: {
    position: 'absolute',
    padding: 16,
    top: 1,
    right: 1,
    width: 160,
    height: 160,
    backgroundColor: 'white',
    borderColor: '#ccc',
    borderWidth: 0.5,
    borderRadius: 8,

    flexDirection: 'column',
    justifyContent: 'space-around',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    paddingLeft: 12,
  },
})
