/**
 * SnakeBody — renders a single body segment of the snake.
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Direction } from '../game/types';

interface SnakeBodyProps {
  direction: Direction;
  color: string;
  size: number;
  /** Whether this is the tail segment (slightly tapered) */
  isTail?: boolean;
  isHinted?: boolean;
}

// For body segments, the segment fills the cell
// but we make it slightly inset to show a "connected" look.

export const SnakeBody: React.FC<SnakeBodyProps> = ({
  direction,
  color,
  size,
  isTail = false,
  isHinted = false,
}) => {
  const isVertical = direction === Direction.UP || direction === Direction.DOWN;

  const width = isVertical ? size * 0.72 : size;
  const height = isVertical ? size : size * 0.72;

  // Tail is slightly more tapered/rounded
  const tailBorderRadius = isTail ? size * 0.36 : size * 0.2;

  return (
    <View
      style={[
        styles.container,
        { width: size, height: size },
      ]}
    >
      <View
        style={[
          styles.segment,
          {
            width,
            height,
            backgroundColor: color,
            borderRadius: isTail ? tailBorderRadius : size * 0.18,
            opacity: isTail ? 0.85 : 1,
            shadowColor: isHinted ? '#FFD700' : '#000',
            shadowOpacity: isHinted ? 0.7 : 0.25,
            shadowRadius: isHinted ? 8 : 3,
          },
        ]}
      >
        {/* Scale pattern highlight */}
        <View
          style={[
            styles.highlight,
            {
              width: isVertical ? width * 0.55 : width * 0.7,
              height: isVertical ? height * 0.4 : height * 0.55,
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  segment: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    overflow: 'hidden',
  },
  highlight: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 999,
    marginTop: 4,
  },
});
