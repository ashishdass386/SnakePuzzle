/**
 * Snake — composed snake component with Reanimated exit and shake animations.
 *
 * This component:
 * 1. Renders a snake's head + body segments at their grid positions.
 * 2. Animates exit (slide off board) when tapped and path is clear.
 * 3. Animates a shake when blocked.
 * 4. Highlights when hinted.
 *
 * The snake is positioned absolutely on the board using grid coordinates.
 */

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withSpring,
  withRepeat,
  Easing,
} from 'react-native-reanimated';

import { SnakePiece, Direction } from '../game/types';
import { SNAKE_COLORS, ANIM_EXIT_DURATION, ANIM_SHAKE_DURATION, THEME, CELL_GAP } from '../utils/constants';
import { getExitOffset, gridToPixel } from '../game/Movement';
import { SnakeHead } from './SnakeHead';
import { SnakeBody } from './SnakeBody';

// ─── Types ────────────────────────────────────────────────────────────────────

export type SnakeAnimationCommand = 'idle' | 'exit' | 'blocked' | 'hint';

interface SnakeProps {
  snake: SnakePiece;
  cellSize: number;
  boardPadding: number;
  boardSize: { rows: number; cols: number };
  animCommand: SnakeAnimationCommand;
  onTap: (snakeId: string) => void;
  onExitComplete?: (snakeId: string) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export const Snake: React.FC<SnakeProps> = ({
  snake,
  cellSize,
  boardPadding,
  boardSize,
  animCommand,
  onTap,
  onExitComplete,
}) => {
  const color = SNAKE_COLORS[snake.colorIndex];
  const cellGap = CELL_GAP;
  const step = cellSize + cellGap;

  // Shared animation values
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1);
  const scale = useSharedValue(1);
  const hintGlow = useSharedValue(0);

  const prevCommand = useRef<SnakeAnimationCommand>('idle');

  // ── React to animation commands ──────────────────────────────────────────

  useEffect(() => {
    if (animCommand === prevCommand.current) return;
    prevCommand.current = animCommand;

    if (animCommand === 'exit') {
      const offset = getExitOffset(snake, boardSize, cellSize, cellGap);

      translateX.value = withTiming(offset.x, {
        duration: ANIM_EXIT_DURATION,
        easing: Easing.out(Easing.cubic),
      });
      translateY.value = withTiming(offset.y, {
        duration: ANIM_EXIT_DURATION,
        easing: Easing.out(Easing.cubic),
      });
      opacity.value = withTiming(0, {
        duration: ANIM_EXIT_DURATION * 0.8,
        easing: Easing.out(Easing.quad),
      });
      scale.value = withTiming(0.85, {
        duration: ANIM_EXIT_DURATION,
      });

      // Notify parent after animation finishes (setTimeout is on JS thread)
      if (onExitComplete) {
        const id = snake.id;
        setTimeout(() => onExitComplete(id), ANIM_EXIT_DURATION + 50);
      }
    }

    if (animCommand === 'blocked') {
      const shakeAmt = cellSize * 0.08;
      translateX.value = withSequence(
        withTiming(-shakeAmt, { duration: 60 }),
        withTiming(shakeAmt, { duration: 60 }),
        withTiming(-shakeAmt * 0.6, { duration: 50 }),
        withTiming(shakeAmt * 0.6, { duration: 50 }),
        withTiming(0, { duration: 80 }),
      );
    }

    if (animCommand === 'hint') {
      hintGlow.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 400 }),
          withTiming(0.3, { duration: 400 }),
        ),
        4,
        true,
      );
    }

    if (animCommand === 'idle') {
      hintGlow.value = withTiming(0, { duration: 200 });
      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
      opacity.value = withTiming(1);
      scale.value = withSpring(1);
    }
  }, [animCommand]);

  // ── Animated style ───────────────────────────────────────────────────────

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  // ── Layout ───────────────────────────────────────────────────────────────

  // Compute the bounding box of all cells
  const minRow = Math.min(...snake.cells.map(c => c.row));
  const minCol = Math.min(...snake.cells.map(c => c.col));

  const pixelOrigin = gridToPixel({ row: minRow, col: minCol }, cellSize, cellGap, boardPadding);

  const maxRow = Math.max(...snake.cells.map(c => c.row));
  const maxCol = Math.max(...snake.cells.map(c => c.col));

  const containerWidth = (maxCol - minCol) * step + cellSize;
  const containerHeight = (maxRow - minRow) * step + cellSize;

  const isHinted = animCommand === 'hint';

  return (
    <Animated.View
      style={[
        styles.container,
        {
          left: pixelOrigin.x,
          top: pixelOrigin.y,
          width: containerWidth,
          height: containerHeight,
        },
        animatedStyle,
      ]}
    >
      <TouchableOpacity
        onPress={() => onTap(snake.id)}
        style={styles.touchable}
        activeOpacity={0.9}
        testID={`snake-${snake.id}`}
      >
        {/* Render each segment */}
        {snake.cells.map((cell, index) => {
          const isHead = index === 0;
          const isTail = index === snake.cells.length - 1;

          const localLeft = (cell.col - minCol) * step;
          const localTop = (cell.row - minRow) * step;

          return (
            <View
              key={`${snake.id}-seg-${index}`}
              style={[
                styles.segmentWrapper,
                {
                  position: 'absolute',
                  left: localLeft,
                  top: localTop,
                  width: cellSize,
                  height: cellSize,
                },
              ]}
            >
              {isHead ? (
                <SnakeHead
                  direction={snake.direction}
                  color={color}
                  size={cellSize}
                  isHinted={isHinted}
                />
              ) : (
                <SnakeBody
                  direction={snake.direction}
                  color={color}
                  size={cellSize}
                  isTail={isTail}
                  isHinted={isHinted}
                />
              )}
            </View>
          );
        })}
      </TouchableOpacity>
    </Animated.View>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 10,
  },
  touchable: {
    width: '100%',
    height: '100%',
  },
  segmentWrapper: {},
});
