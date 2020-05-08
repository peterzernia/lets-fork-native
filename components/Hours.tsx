import React from 'react'
import { Text, View, StyleSheet } from 'react-native'
import { Hours as HoursType } from 'types'
import { formatTime } from 'utils/datetime'

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

  const ampm = true

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Hours</Text>
      <View style={styles.divider} />
      <View style={styles.dayContainer}>
        <Text style={dayStyles(today === 2).day}>Monday</Text>
        <Text style={dayStyles(today === 2).day}>
          {monday ? `${formatTime(monday.start, ampm)} - ${formatTime(monday.end, ampm)}` : 'Closed'}
        </Text>
      </View>
      <View style={styles.dayContainer}>
        <Text style={dayStyles(today === 3).day}>Tuesday</Text>
        <Text style={dayStyles(today === 3).day}>
          {tuesday ? `${formatTime(tuesday.start, ampm)} - ${formatTime(tuesday.end, ampm)}` : 'Closed'}
        </Text>
      </View>
      <View style={styles.dayContainer}>
        <Text style={dayStyles(today === 4).day}>Wednesday</Text>
        <Text style={dayStyles(today === 4).day}>
          {wednesday ? `${formatTime(wednesday.start, ampm)} - ${formatTime(wednesday.end, ampm)}` : 'Closed'}
        </Text>
      </View>
      <View style={styles.dayContainer}>
        <Text style={dayStyles(today === 5).day}>Thursday</Text>
        <Text style={dayStyles(today === 5).day}>
          {thursday ? `${formatTime(thursday.start, ampm)} - ${formatTime(thursday.end, ampm)}` : 'Closed'}
        </Text>
      </View>
      <View style={styles.dayContainer}>
        <Text style={dayStyles(today === 6).day}>Friday</Text>
        <Text style={dayStyles(today === 6).day}>
          {friday ? `${formatTime(friday.start, ampm)} - ${formatTime(friday.end, ampm)}` : 'Closed'}
        </Text>
      </View>
      <View style={styles.dayContainer}>
        <Text style={dayStyles(today === 9).day}>Saturday</Text>
        <Text style={dayStyles(today === 9).day}>
          {saturday ? `${formatTime(saturday.start, ampm)} - ${formatTime(saturday.end, ampm)}` : 'Closed'}
        </Text>
      </View>
      <View style={styles.dayContainer}>
        <Text style={dayStyles(today === 1).day}>Sunday</Text>
        <Text style={dayStyles(today === 1).day}>
          {sunday ? `${formatTime(sunday.start, ampm)} - ${formatTime(sunday.end, ampm)}` : 'Closed'}
        </Text>
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
