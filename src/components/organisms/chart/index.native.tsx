import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { View, StyleSheet, PanResponder, Dimensions } from 'react-native'
import Svg, { Defs, Path, G, Use, Circle } from 'react-native-svg'
import { Spring } from 'react-spring/renderprops'

import SVG_PATH_CHART_LINE from './chart-lines'

const MetricsPath = require('art/metrics/path')

interface Props {
  chartVariation: number
}

const LineChartNative: React.FC<Props> = ({ chartVariation }) => {
  const [animate, setAnimate] = useState<boolean>(true)

  const pathMetrics = useRef(new MetricsPath(SVG_PATH_CHART_LINE[chartVariation])).current

  const [pathLength, setPathLength] = useState<number>(0)
  const [dragger, setDragger] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
  const [displayAdditions, setDisplayAdditions] = useState<boolean>(false)

  const getPointAtLength = useCallback(
    (progress: number) => {
      return {
        x: pathMetrics.point(progress * pathLength).x - 2,
        y: pathMetrics.point(progress * pathLength).y - 2
      }
    },
    [pathLength, pathMetrics]
  )

  const positionDragger = useCallback(
    (progress: number) => {
      const { x, y } = getPointAtLength(progress)
      setDragger({ x, y })
    },
    [getPointAtLength]
  )

  useEffect(() => {
    setPathLength(pathMetrics.length)
  }, [pathMetrics])

  useEffect(() => {
    positionDragger(1)
    setAnimate(true)
  }, [pathLength, chartVariation, positionDragger])

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onStartShouldSetPanResponderCapture: () => true,
        onMoveShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponderCapture: () => true,

        onPanResponderGrant: (_, gestureState) => {
          // The gesture has started. Show visual feedback so the user knows
          // what is happening!
          // gestureState.d{x,y} will be set to zero now
          const { x0 } = gestureState
          const windowWidth = Dimensions.get('window').width
          const start = getPointAtLength(0)
          const end = getPointAtLength(1)

          const lineLengthSvg = end.x - start.x
          const ratio = lineLengthSvg / 380

          const lineLengthActual = windowWidth * ratio

          positionDragger((x0 - start.x * ratio) / lineLengthActual)
        },
        onPanResponderMove: (_, gestureState) => {
          // The most recent move distance is gestureState.move{X,Y}
          // The accumulated gesture distance since becoming responder is
          // gestureState.d{x,y}
          const { moveX } = gestureState

          const windowWidth = Dimensions.get('window').width
          const start = getPointAtLength(0)
          const end = getPointAtLength(1)

          const lineLengthSvg = end.x - start.x
          const ratio = lineLengthSvg / 380

          const lineLengthActual = windowWidth * ratio
          positionDragger((moveX - start.x * ratio) / lineLengthActual)
        },
        onPanResponderTerminationRequest: () => true,
        onShouldBlockNativeResponder: () => {
          return true
        }
      }),
    [getPointAtLength, positionDragger]
  )

  return (
    <View>
      <Spring
        from={{ x: 464 }}
        to={{ x: 0 }}
        config={{ duration: 800 }}
        onRest={() => {
          setDisplayAdditions(true)
          setAnimate(false)
        }}
      >
        {props => (
          <Svg width={381} height={108} viewBox="0 0 381 108" {...props}>
            <Defs>
              <Path id="prefix__b" d={SVG_PATH_CHART_LINE[chartVariation]} />
            </Defs>
            <G transform="translate(1 -40)" fill="none" fillRule="evenodd" strokeLinecap="round" strokeLinejoin="round">
              <Use
                stroke="#194CA9"
                strokeWidth={4}
                href="#prefix__b"
                strokeDashoffset={props.x}
                strokeDasharray="464"
              />
              <Spring reset={animate} from={{ opacity: 0 }} to={{ opacity: displayAdditions ? 1 : 0 }}>
                {props => (
                  <Circle
                    cx="2"
                    cy="2"
                    r="6"
                    stroke="#FA775E"
                    strokeWidth={4}
                    fill="#fff"
                    opacity={props.opacity}
                    transform={`translate(${dragger.x}, ${dragger.y})`}
                  />
                )}
              </Spring>
            </G>
          </Svg>
        )}
      </Spring>

      <View {...panResponder.panHandlers} style={{ ...StyleSheet.absoluteFillObject, zIndex: 3 }} />
    </View>
  )
}

export default LineChartNative
