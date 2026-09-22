/**
 * SnakeTail — renders a clean, smooth tapered cone tail without cut lines.
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Direction } from '../game/types';

interface SnakeTailProps {
  /** Relative direction pointing towards the tail tip (opposite of body connection) */
  tipDirection: Direction;
  color: string;
  size: number;
  isHinted?: boolean;
}

const ROTATION: Record<Direction, string> = {
  [Direction.RIGHT]: '0deg',
  [Direction.DOWN]: '90deg',
  [Direction.LEFT]: '180deg',
  [Direction.UP]: '270deg',
};

export const SnakeTail: React.FC<SnakeTailProps> = ({
  tipDirection,
  color,
  size,
  isHinted = false,
}) => {
  const rotation = ROTATION[tipDirection] ?? '0deg';
  const bodyThickness = size * 0.84;

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
      {/* Clean Smooth Tapered Tail */}
      <View
        style={[
          styles.tailBase,
          {
            backgroundColor: color,
            width: size * 0.98,
            height: bodyThickness,
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
            borderTopRightRadius: bodyThickness * 0.48,
            borderBottomRightRadius: bodyThickness * 0.48,
            shadowColor: isHinted ? '#FFD700' : '#000',
            shadowOpacity: isHinted ? 0.8 : 0.3,
            shadowRadius: isHinted ? 8 : 2,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tailBase: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    position: 'relative',
    elevation: 3,
    shadowOffset: { width: 0, height: 1 },
  },
});
