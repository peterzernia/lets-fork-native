import React from 'react'
import {
  TouchableOpacity, View, ScrollView, StyleSheet,
} from 'react-native'
import Modal from 'react-native-modal'
import Text from 'components/Text'
import { Feather, Ionicons } from '@expo/vector-icons'

type Props = {
  handleSelect: (s: string[]) => void;
  items: {
    name: string;
    id: string;
  }[];
}

export default function MultiSelect(props: Props): React.ReactElement {
  const { handleSelect, items } = props
  const [open, setOpen] = React.useState(false)
  const [selected, setSelected] = React.useState<string[]>([])

  const handlePress = (id: string): void => {
    let sel = [...selected]

    if (sel.includes(id)) {
      sel = selected.filter((i) => i !== id)
    } else {
      sel = [...selected, id]
    }

    setSelected(sel)
    handleSelect(sel)
  }

  return (
    <View>
      <Modal isVisible={open} onBackdropPress={(): void => setOpen(false)} testID="modal">
        <ScrollView style={styles.scroll}>
          {
            items.map((c) => (
              <View key={c.id} style={styles.item}>
                <TouchableOpacity
                  accessibilityRole="button"
                  onPress={(): void => handlePress(c.id)}
                >
                  <Text
                    style={{
                      ...styles.itemText,
                      color: selected.includes(c.id) ? 'black' : '#808080',
                    }}
                  >
                    {c.name}
                  </Text>
                </TouchableOpacity>
                {
                  selected.includes(c.id)
                    && <Feather name="check" size={20} color="black" />
                }
              </View>
            ))
          }
        </ScrollView>
      </Modal>
      <TouchableOpacity
        accessibilityRole="button"
        style={styles.openButton}
        onPress={(): void => setOpen(true)}
      >
        <Text style={styles.openText}>
          { selected.length
            ? `${selected.length} ${selected.length === 1 ? 'category' : 'categories'} selected`
            : 'Filter by Categories (Optional)'}
        </Text>
        <Ionicons name="md-arrow-dropright" size={26} />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  openButton: {
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 30,
    paddingBottom: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  openText: {
    fontWeight: 'bold',
  },
  scroll: {
    backgroundColor: 'white',
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 50,
    marginTop: 50,
    borderRadius: 8,
    paddingLeft: 8,
    paddingRight: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemText: {
    fontWeight: 'bold',
    fontSize: 16,
    padding: 3,
  },
})
