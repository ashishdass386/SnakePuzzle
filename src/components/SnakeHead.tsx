/**
 * SnakeHead — renders the snake head with eyes and directional orientation.
 *
 * The head is a rounded rectangle with two eyes and a small tongue.
 * It rotates based on the snake's direction.
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Direction } from '../game/types';

// ─── Types ────────────────────────────────────────────────────────────────────

interface SnakeHeadProps {
  direction: Direction;
  color: string;
  size: number; // cell size in pixels
  isHinted?: boolean;
}

// ─── Rotation Map ─────────────────────────────────────────────────────────────
// RIGHT is the "natural" orientation (eyes face right).
// We rotate the head view to point in the correct direction.

const ROTATION: Record<Direction, string> = {
  [Direction.RIGHT]: '0deg',
  [Direction.DOWN]: '90deg',
  [Direction.LEFT]: '180deg',
  [Direction.UP]: '270deg',
};

// ─── Component ────────────────────────────────────────────────────────────────

export const SnakeHead: React.FC<SnakeHeadProps> = ({
  direction,
  color,
  size,
  isHinted = false,
}) => {
  const rotation = ROTATION[direction];
  const eyeSize = size * 0.14;
  const tongueWidth = size * 0.1;
  const tongueHeight = size * 0.22;

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
      {/* Head oval */}
      <View
        style={[
          styles.head,
          {
            backgroundColor: color,
            width: size * 0.92,
            height: size * 0.88,
            borderRadius: size * 0.3,
            borderTopRightRadius: size * 0.45,
            borderBottomRightRadius: size * 0.45,
            shadowColor: isHinted ? '#FFD700' : '#000',
            shadowOpacity: isHinted ? 0.9 : 0.4,
            shadowRadius: isHinted ? 10 : 4,
          },
        ]}
      >
        {/* Eyes */}
        <View
          style={[
            styles.eye,
            {
              width: eyeSize,
              height: eyeSize,
              borderRadius: eyeSize / 2,
              position: 'absolute',
              top: size * 0.16,
              right: size * 0.18,
            },
          ]}
        />
        <View
          style={[
            styles.eye,
            {
              width: eyeSize,
              height: eyeSize,
              borderRadius: eyeSize / 2,
              position: 'absolute',
              bottom: size * 0.16,
              right: size * 0.18,
            },
          ]}
        />

        {/* Tongue */}
        <View
          style={[
            styles.tongueContainer,
            { right: -tongueHeight * 0.6 },
          ]}
        >
          <View
            style={[
              styles.tongue,
              {
                width: tongueHeight,
                height: tongueWidth,
                backgroundColor: '#FF4081',
                borderRadius: tongueWidth / 2,
              },
            ]}
          />
          {/* Fork */}
          <View style={styles.tongueFork}>
            <View
              style={[
                styles.tineTop,
                {
                  width: tongueHeight * 0.5,
                  height: tongueWidth * 0.5,
                  backgroundColor: '#FF4081',
                  borderRadius: tongueWidth * 0.25,
                  transform: [{ rotate: '-20deg' }],
                },
              ]}
            />
            <View
              style={[
                styles.tineBottom,
                {
                  width: tongueHeight * 0.5,
                  height: tongueWidth * 0.5,
                  backgroundColor: '#FF4081',
                  borderRadius: tongueWidth * 0.25,
                  transform: [{ rotate: '20deg' }],
                },
              ]}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  head: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
    position: 'relative',
  },
  eye: {
    backgroundColor: '#FFFFFF',
    // Pupil
    borderWidth: 2.5,
    borderColor: '#1A1A1A',
  },
  tongueContainer: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
  },
  tongue: {},
  tongueFork: {
    flexDirection: 'column',
    marginLeft: 1,
  },
  tineTop: { marginBottom: 1 },
  tineBottom: {},
});
