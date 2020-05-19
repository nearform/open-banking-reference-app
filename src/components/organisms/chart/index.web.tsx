import React, { useState, useEffect, useRef, useMemo, RefObject, useCallback } from 'react'
import { View, StyleSheet, PanResponder, Dimensions } from 'react-native'
import { Spring } from 'react-spring/renderprops'

import SVG_PATH_CHART_LINE from './chart-lines'

interface Props {
  chartVariation: number
}

const LineChart: React.FC<Props> = ({ chartVariation }) => {
  const [animate, setAnimate] = useState<boolean>(true)

  const [pathLength, setPathLength] = useState<number>(0)
  const [displayAdditions, setDisplayAdditions] = useState<boolean>(false)

  const path = useRef() as RefObject<SVGPathElement>
  const dragger = useRef() as RefObject<SVGCircleElement>

  const getPointAtLength = useCallback(
    (progress: number) => {
      if (!path.current) {
        return {
          x: 0,
          y: 0
        }
      }

      return {
        x: path.current.getPointAtLength(progress * pathLength).x - 2,
        y: path.current.getPointAtLength(progress * pathLength).y - 40 - 2
      }
    },
    [pathLength]
  )

  const positionDragger = useCallback(
    (progress: number) => {
      const { x, y } = getPointAtLength(progress)
      dragger.current && dragger.current.setAttribute('transform', `translate(${x}, ${y})`)
    },
    [getPointAtLength]
  )

  useEffect(() => {
    setPathLength(path.current ? path.current.getTotalLength() : 0)
  }, [path])

  useEffect(() => {
    positionDragger(1)
    setAnimate(true)
  }, [pathLength, chartVariation, positionDragger])

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        // Ask to be the responder:
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
          // Returns whether this component should block native components from becoming the JS
          // responder. Returns true by default. Is currently only supported on android.
          return true
        }
      }),
    [getPointAtLength, positionDragger]
  )

  return (
    <View>
      <Spring
        from={{ x: 400 }}
        to={{ x: 0 }}
        config={{ duration: 800 }}
        onRest={() => {
          setDisplayAdditions(true)
          setAnimate(false)
        }}
      >
        {props => (
          <svg viewBox="0 0 380 108">
            <defs>
              <path ref={path} id="chartLine" d={SVG_PATH_CHART_LINE[chartVariation]} />
              <filter
                x="-10.3%"
                y="-34.4%"
                width="120.4%"
                height="197.6%"
                filterUnits="objectBoundingBox"
                id="filter-2"
              >
                <feMorphology radius="1.5" operator="dilate" in="SourceAlpha" result="shadowSpreadOuter1" />
                <feOffset dx="0" dy="10" in="shadowSpreadOuter1" result="shadowOffsetOuter1" />
                <feMorphology radius="1.5" operator="erode" in="SourceAlpha" result="shadowInner" />
                <feOffset dx="0" dy="10" in="shadowInner" result="shadowInner" />
                <feComposite in="shadowOffsetOuter1" in2="shadowInner" operator="out" result="shadowOffsetOuter1" />
                <feGaussianBlur stdDeviation="8" in="shadowOffsetOuter1" result="shadowBlurOuter1" />
                <feColorMatrix
                  values="1 0 0 0 0.13
                    0 1 0 0 0.4
                    0 0 1 0 0.89
                    0 0 0 0.3 0"
                  type="matrix"
                  in="shadowBlurOuter1"
                />
              </filter>
            </defs>
            <g transform="translate(0 -40)" fill="none" fillRule="evenodd" strokeLinecap="round" strokeLinejoin="round">
              <Spring reset={animate} from={{ opacity: 0 }} to={{ opacity: displayAdditions ? 1 : 0 }}>
                {props => <use opacity={props.opacity} fill="#000" filter="url(#filter-2)" xlinkHref="#chartLine" />}
              </Spring>
              <use
                stroke="#194CA9"
                strokeWidth={4}
                xlinkHref="#chartLine"
                strokeDashoffset={props.x}
                strokeDasharray="464"
              />
            </g>
            <Spring reset={animate} from={{ opacity: 0 }} to={{ opacity: displayAdditions ? 1 : 0 }}>
              {props => (
                <circle
                  ref={dragger}
                  cx="2"
                  cy="2"
                  stroke="#FA775E"
                  strokeWidth={4}
                  fill="#fff"
                  r="5"
                  opacity={props.opacity}
                />
              )}
            </Spring>
          </svg>
        )}
      </Spring>

      <View {...panResponder.panHandlers} style={StyleSheet.absoluteFill} />
    </View>
  )
}

export default LineChart
