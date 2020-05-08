import React from 'react'
import { Text, View, StyleSheet } from 'react-native'
import { Hours as HoursType } from 'types'

type Props = {
  hours: HoursType[];
}

export default function Hours(props: Props): React.ReactElement {
  const { hours } = props
  const today = new Date().getDay() + 1
  const monday = hours[0].open.find((day) => day.day === 0)
  const tuesday = hours[0].open.find((day) => day.day === 1)
  const wednesday = hours[0].open.find((day) => day.day === 2)
  const thursday = hours[0].open.find((day) => day.day === 3)
  const friday = hours[0].open.find((day) => day.day === 4)
  const saturday = hours[0].open.find((day) => day.day === 5)
  const sunday = hours[0].open.find((day) => day.day === 6)

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Hours</Text>
      <View style={styles.divider} />
      <View style={styles.dayContainer}>
        <Text style={dayStyles(today === 2).day}>Monday</Text>
        <Text style={dayStyles(today === 2).day}>{monday ? `${monday.start} - ${monday.end}` : 'Closed'}</Text>
      </View>
      <View style={styles.dayContainer}>
        <Text style={dayStyles(today === 3).day}>Tuesday</Text>
        <Text style={dayStyles(today === 3).day}>{tuesday ? `${tuesday.start} - ${tuesday.end}` : 'Closed'}</Text>
      </View>
      <View style={styles.dayContainer}>
        <Text style={dayStyles(today === 4).day}>Wednesday</Text>
        <Text style={dayStyles(today === 4).day}>{wednesday ? `${wednesday.start} - ${wednesday.end}` : 'Closed'}</Text>
      </View>
      <View style={styles.dayContainer}>
        <Text style={dayStyles(today === 5).day}>Thursday</Text>
        <Text style={dayStyles(today === 5).day}>{thursday ? `${thursday.start} - ${thursday.end}` : 'Closed'}</Text>
      </View>
      <View style={styles.dayContainer}>
        <Text style={dayStyles(today === 6).day}>Friday</Text>
        <Text style={dayStyles(today === 6).day}>{friday ? `${friday.start} - ${friday.end}` : 'Closed'}</Text>
      </View>
      <View style={styles.dayContainer}>
        <Text style={dayStyles(today === 9).day}>Saturday</Text>
        <Text style={dayStyles(today === 9).day}>{saturday ? `${saturday.start} - ${saturday.end}` : 'Closed'}</Text>
      </View>
      <View style={styles.dayContainer}>
        <Text style={dayStyles(today === 1).day}>Sunday</Text>
        <Text style={dayStyles(today === 1).day}>{sunday ? `${sunday.start} - ${sunday.end}` : 'Closed'}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  header: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  divider: {
    borderTopWidth: 1,
    borderColor: 'lightgray',
    paddingTop: 4,
    paddingBottom: 4,
  },
  dayContainer: {
    paddingTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
})

const dayStyles = (isToday: boolean): any => StyleSheet.create({
  day: {
    fontWeight: isToday ? 'bold' : 'normal',
  },
})
