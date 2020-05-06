// https://github.com/wcandillon/can-it-be-done-in-react-native/blob/master/season1/tinder-swiping/components/Profiles.js
import * as React from 'react'
import { StyleSheet, View, Dimensions } from 'react-native'
import { PanGestureHandler, State } from 'react-native-gesture-handler'
import Animated from 'react-native-reanimated'
import { Restaurant } from 'types'
import Card from 'components/Card'

const runSpring = (
  clock: Animated.Clock,
  value: Animated.Value<0>,
  dest: any,
): Animated.Node<any>[] => {
  const state = {
    finished: new Value(0),
    velocity: new Value(0),
    position: new Value(0),
    time: new Value(0),
  }

  const config = {
    damping: 20,
    mass: 1,
    stiffness: 100,
    overshootClamping: false,
    restSpeedThreshold: 1,
    restDisplacementThreshold: 0.5,
    toValue: new Value(0),
  }

  return [
    cond(clockRunning(clock), 0, [
      set(state.finished, 0),
      set(state.velocity, 0),
      set(state.position, value),
      set(config.toValue, dest),
      startClock(clock),
    ]),
    spring(clock, state, config),
    cond(state.finished, stopClock(clock)),
    state.position,
  ]
}

const { width, height } = Dimensions.get('window')
const toRadians = (angle: number): number => angle * (Math.PI / 180)
const rotatedWidth = width * Math.sin(toRadians(90 - 15)) + height * Math.sin(toRadians(15))
const {
  add,
  multiply,
  neq,
  spring,
  cond,
  eq,
  event,
  lessThan,
  greaterThan,
  and,
  call,
  set,
  clockRunning,
  startClock,
  stopClock,
  Clock,
  Value,
  concat,
  interpolate,
  Extrapolate,
} = Animated

type Props = {
  handleSwipeRight: (id: string) => void;
  restaurants: Restaurant[];
  setRestaurants: React.Dispatch<React.SetStateAction<Restaurant[] | undefined>>;
  visible: boolean;
}

export default class SwipeWindow extends React.PureComponent<Props> {
  constructor(props: Props) {
    super(props)
    this.translationX = new Value(0)
    this.translationY = new Value(0)
    this.velocityX = new Value(0)
    this.offsetY = new Value(0)
    this.offsetX = new Value(0)
    this.gestureState = new Value(State.UNDETERMINED)
    this.onGestureEvent = event(
      [
        {
          nativeEvent: {
            translationX: this.translationX,
            translationY: this.translationY,
            velocityX: this.velocityX,
            state: this.gestureState,
          },
        },
      ],
      { useNativeDriver: true },
    )
    this.init()
  }

  init = (): void => {
    const clockX = new Clock()
    const clockY = new Clock()
    const {
      translationX,
      translationY,
      velocityX,
      gestureState,
      offsetY,
      offsetX,
    } = this
    gestureState.setValue(State.UNDETERMINED)
    translationX.setValue(0)
    translationY.setValue(0)
    velocityX.setValue(0)
    offsetY.setValue(0)
    offsetX.setValue(0)

    const finalTranslateX = add(translationX, multiply(0.2, velocityX))
    const translationThreshold = width / 4
    const snapPoint = cond(
      lessThan(finalTranslateX, -translationThreshold),
      -rotatedWidth,
      cond(greaterThan(finalTranslateX, translationThreshold), rotatedWidth, 0),
    )
    // TODO: handle case where the user drags the card again before the spring animation finished
    this.translateY = cond(
      eq(gestureState, State.END),
      [
        set(translationY, runSpring(clockY, translationY, 0)),
        set(offsetY, translationY),
        translationY,
      ],
      cond(eq(gestureState, State.BEGAN), [stopClock(clockY), translationY], translationY),
    )
    this.translateX = cond(
      eq(gestureState, State.END),
      [
        set(translationX, runSpring(clockX, translationX, snapPoint)),
        set(offsetX, translationX),
        cond(and(eq(clockRunning(clockX), 0), neq(translationX, 0)), [
          call([translationX], this.swiped),
        ]),
        translationX,
      ],
      cond(eq(gestureState, State.BEGAN), [stopClock(clockX), translationX], translationX),

    )
  };

  swiped = ([translationX]) => {
    const { handleSwipeRight, restaurants, setRestaurants } = this.props
    const [lastRestaurant, ...rest] = restaurants
    console.log(lastRestaurant)

    // positive translation means right swipe
    if (translationX > 0) {
      handleSwipeRight(lastRestaurant.id)
    }
    setRestaurants(rest)
    this.setState(this.init)
  }

  render(): React.ReactElement {
    const { onGestureEvent, translateX, translateY } = this
    const { restaurants, visible } = this.props
    const [lastRestaurant, ...rest] = restaurants

    const rotateZ = concat(
      interpolate(translateX, {
        inputRange: [-width / 2, width / 2],
        outputRange: [15, -15],
        extrapolate: Extrapolate.CLAMP,
      }),
      'deg',
    )

    const style = {
      ...StyleSheet.absoluteFillObject,
      zIndex: 900,
      transform: [
        { translateX },
        { translateY },
        { rotateZ },
      ],
    }

    if (!visible) return <View style={styles.hidden} />

    return (
      <View style={styles.cards}>
        {
          rest.length
            ? <Card restaurant={rest[0]} />
            : null
        }
        {
          lastRestaurant && (
            <PanGestureHandler
              onHandlerStateChange={onGestureEvent}
              onGestureEvent={onGestureEvent}
            >
              <Animated.View style={style}>
                <Card restaurant={lastRestaurant} />
              </Animated.View>
            </PanGestureHandler>
          )
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  cards: {
    flex: 1,
    margin: 8,
    zIndex: 100,
  },
  hidden: {
    height: 0,
  },
})
