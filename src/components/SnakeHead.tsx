/**
 * SnakeHead — cute cartoon snake head with expressive googly eyes
 * and animated/forked snake tongue sticking out in front.
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Direction } from '../game/types';

interface SnakeHeadProps {
  direction: Direction;
  color: string;
  size: number; // cell size in pixels
  isHinted?: boolean;
  isSingleCell?: boolean;
}

const ROTATION: Record<Direction, string> = {
  [Direction.RIGHT]: '0deg',
  [Direction.DOWN]: '90deg',
  [Direction.LEFT]: '180deg',
  [Direction.UP]: '270deg',
};

export const SnakeHead: React.FC<SnakeHeadProps> = ({
  direction,
  color,
  size,
  isHinted = false,
  isSingleCell = false,
}) => {
  const rotation = ROTATION[direction] ?? '0deg';
  const bodyThickness = size * 0.84;
  const eyeDiameter = Math.max(5, Math.min(size * 0.30, 14));
  const pupilDiameter = Math.max(2.5, eyeDiameter * 0.54);
  const shineDiameter = Math.max(1.2, pupilDiameter * 0.45);

  const tongueStemLength = Math.max(3, size * 0.14);
  const tongueThickness = Math.max(1.5, size * 0.06);
  const tineLength = Math.max(2, size * 0.08);

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          transform: [{ rotate: rotation }],
        },
      ]}
    >
      {/* Clean Smooth Head Dome */}
      <View
        style={[
          styles.headBase,
          {
            backgroundColor: color,
            width: isSingleCell ? size * 0.88 : size * 0.98,
            height: bodyThickness,
            borderTopRightRadius: bodyThickness * 0.5,
            borderBottomRightRadius: bodyThickness * 0.5,
            borderTopLeftRadius: isSingleCell ? bodyThickness * 0.5 : 0,
            borderBottomLeftRadius: isSingleCell ? bodyThickness * 0.5 : 0,
            shadowColor: isHinted ? '#FFD700' : '#000',
            shadowOpacity: isHinted ? 0.9 : 0.35,
            shadowRadius: isHinted ? 10 : 3,
          },
        ]}
      >
        {/* Forked Snake Tongue sticking out front */}
        <View
          style={[
            styles.tongueWrapper,
            {
              right: -(tongueStemLength + tineLength * 0.6),
              top: (bodyThickness - tongueThickness) / 2,
            },
          ]}
          pointerEvents="none"
        >
          {/* Tongue Stem */}
          <View
            style={[
              styles.tongueStem,
              {
                width: tongueStemLength,
                height: tongueThickness,
                borderRadius: tongueThickness / 2,
              },
            ]}
          />
          {/* Fork Tines */}
          <View style={styles.forkContainer}>
            <View
              style={[
                styles.forkTine,
                {
                  width: tineLength,
                  height: tongueThickness * 0.9,
                  borderRadius: tongueThickness / 2,
                  transform: [{ rotate: '-28deg' }],
                  marginBottom: 0.5,
                },
              ]}
            />
            <View
              style={[
                styles.forkTine,
                {
                  width: tineLength,
                  height: tongueThickness * 0.9,
                  borderRadius: tongueThickness / 2,
                  transform: [{ rotate: '28deg' }],
                  marginTop: 0.5,
                },
              ]}
            />
          </View>
        </View>

        {/* Top Googly Eye */}
        <View
          style={[
            styles.eyeSocket,
            {
              width: eyeDiameter,
              height: eyeDiameter,
              borderRadius: eyeDiameter / 2,
              top: size * 0.06,
              right: isSingleCell ? size * 0.16 : size * 0.12,
            },
          ]}
        >
          {/* Pupil */}
          <View
            style={[
              styles.pupil,
              {
                width: pupilDiameter,
                height: pupilDiameter,
                borderRadius: pupilDiameter / 2,
                top: (eyeDiameter - pupilDiameter) / 2,
                right: 1.5,
              },
            ]}
          >
            {/* White Specular Shine */}
            <View
              style={[
                styles.eyeShine,
                {
                  width: shineDiameter,
                  height: shineDiameter,
                  borderRadius: shineDiameter / 2,
                  top: 1,
                  left: 1,
                },
              ]}
            />
          </View>
        </View>

        {/* Bottom Googly Eye */}
        <View
          style={[
            styles.eyeSocket,
            {
              width: eyeDiameter,
              height: eyeDiameter,
              borderRadius: eyeDiameter / 2,
              bottom: size * 0.06,
              right: isSingleCell ? size * 0.16 : size * 0.12,
            },
          ]}
        >
          {/* Pupil */}
          <View
            style={[
              styles.pupil,
              {
                width: pupilDiameter,
                height: pupilDiameter,
                borderRadius: pupilDiameter / 2,
                top: (eyeDiameter - pupilDiameter) / 2,
                right: 1.5,
              },
            ]}
          >
            {/* White Specular Shine */}
            <View
              style={[
                styles.eyeShine,
                {
                  width: shineDiameter,
                  height: shineDiameter,
                  borderRadius: shineDiameter / 2,
                  top: 1,
                  left: 1,
                },
              ]}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  headBase: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    position: 'relative',
    elevation: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  tongueWrapper: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 2,
  },
  tongueStem: {
    backgroundColor: '#FF2A6D',
  },
  forkContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginLeft: -1,
  },
  forkTine: {
    backgroundColor: '#FF2A6D',
  },
  eyeSocket: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: 'rgba(0, 0, 0, 0.35)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 1.5,
    elevation: 3,
    zIndex: 5,
  },
  pupil: {
    position: 'absolute',
    backgroundColor: '#111111',
  },
  eyeShine: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
  },
});
