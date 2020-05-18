// https://github.com/wcandillon/can-it-be-done-in-react-native/blob/master/season1/tinder-swiping/components/Profiles.js
/* eslint max-classes-per-file: 0 */
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
  setDetails: React.Dispatch<React.SetStateAction<Restaurant | undefined>>;
  setFinished: React.Dispatch<React.SetStateAction<boolean>>;
  setRestaurants: React.Dispatch<React.SetStateAction<Restaurant[] | undefined>>;
  visible: boolean;
}

type Sta = {
  loading: boolean;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
class SW extends React.PureComponent<Props, Sta> {
  translationX: any;

  translateX: any;

  translationY: any;

  translateY: any;

  velocityX: any;

  offsetY: any;

  offsetX: any

  gestureState: any;

  onGestureEvent: any;
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export default class SwipeWindow extends SW {
  constructor(props: Props) {
    super(props)
    this.state = {
      loading: false,
    }
    this.translationX = new Value(0)
    this.translationY = new Value(0)
    this.velocityX = new Value(0)
    this.offsetY = new Value(0)
    this.offsetX = new Value(0)
    this.gestureState = new Value(State.UNDETERMINED)
    this.onGestureEvent = event(
      [{
        nativeEvent: {
          translationX: this.translationX,
          translationY: this.translationY,
          velocityX: this.velocityX,
          state: this.gestureState,
        },
      }],
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

  swiped = ([translationX]: readonly number[]): void => {
    this.setState({ loading: true })
    const {
      handleSwipeRight, restaurants, setFinished, setRestaurants,
    } = this.props
    const [lastRestaurant, ...rest] = restaurants

    // positive translation means right swipe
    if (translationX > 0) {
      handleSwipeRight(lastRestaurant.id)
    }

    setRestaurants(rest)

    if (!rest.length) {
      setFinished(true)
    }

    this.setState(this.init)
    this.setState({ loading: false })
  }

  render(): React.ReactElement {
    const { onGestureEvent, translateX, translateY } = this
    const { restaurants, setDetails, visible } = this.props
    const { loading } = this.state
    const [lastRestaurant, ...rest] = restaurants

    // Workaround to prevent text from flashing on ios.
    // There is a moment where the image is fetched and isn't rendered.
    // The ios workaround on Party Screen renders the image, but this causes
    // the text from both the top and bottom cards to flash over top. This workaround
    // turns the opacity of the bottom text to 0 when the top card hasn't moved.
    // This makes it look like the card is rendered correctly the entire time.
    // [TODO] look into using react-native-fast-image for image caching; requires ejecting
    const textOpacity = cond(
      greaterThan(translateX, new Value(0)),
      interpolate(translateX, {
        inputRange: [0, 0.00001],
        outputRange: [0, 1],
      }),
      interpolate(translateX, {
        inputRange: [-0.000001, 0],
        outputRange: [1, 0],
      }),
    )

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
            ? (
              <Card
                textOpacity={textOpacity}
                restaurant={rest[0]}
                setDetails={setDetails}
              />
            ) : null
        }
        {
          lastRestaurant && (
            <PanGestureHandler
              onHandlerStateChange={onGestureEvent}
              onGestureEvent={onGestureEvent}
            >
              <Animated.View style={style}>
                <Card
                  textOpacity={1}
                  loading={loading}
                  restaurant={lastRestaurant}
                  setDetails={setDetails}
                />
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
