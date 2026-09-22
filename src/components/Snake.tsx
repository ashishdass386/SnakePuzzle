/**
 * Snake — composed snake component with Reanimated exit and shake animations.
 *
 * Renders head, ribbed body segments (straight & corner turns), and tapered cone tail.
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

import { SnakePiece, Direction, Position } from '../game/types';
import { SNAKE_COLORS, ANIM_EXIT_DURATION, ANIM_SHAKE_DURATION, CELL_GAP } from '../utils/constants';
import { getExitOffset, gridToPixel } from '../game/Movement';
import { SnakeHead } from './SnakeHead';
import { SnakeBody, SegmentType } from './SnakeBody';
import { SnakeTail } from './SnakeTail';

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
  const color = SNAKE_COLORS[snake.colorIndex % SNAKE_COLORS.length];
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

      // Notify parent after animation finishes
      if (onExitComplete) {
        const id = snake.id;
        setTimeout(() => onExitComplete(id), ANIM_EXIT_DURATION + 50);
      }
    }

    if (animCommand === 'blocked') {
      const shakeAmt = cellSize * 0.1;
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

  const minRow = Math.min(...snake.cells.map(c => c.row));
  const minCol = Math.min(...snake.cells.map(c => c.col));

  const pixelOrigin = gridToPixel({ row: minRow, col: minCol }, cellSize, cellGap, boardPadding);

  const maxRow = Math.max(...snake.cells.map(c => c.row));
  const maxCol = Math.max(...snake.cells.map(c => c.col));

  const containerWidth = (maxCol - minCol) * step + cellSize;
  const containerHeight = (maxRow - minRow) * step + cellSize;

  const isHinted = animCommand === 'hint';
  const totalLength = snake.cells.length;

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
          const isTail = index === totalLength - 1 && totalLength > 1;

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
                  isSingleCell={totalLength === 1}
                />
              ) : isTail ? (
                <SnakeTail
                  tipDirection={getTailTipDirection(cell, snake.cells[index - 1])}
                  color={color}
                  size={cellSize}
                  isHinted={isHinted}
                />
              ) : (
                <SnakeBody
                  color={color}
                  size={cellSize}
                  segmentType={getBodySegmentType(cell, snake.cells[index - 1], snake.cells[index + 1])}
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

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getTailTipDirection(current: Position, prev: Position): Direction {
  const dr = current.row - prev.row;
  const dc = current.col - prev.col;

  if (dr === 1) return Direction.DOWN;
  if (dr === -1) return Direction.UP;
  if (dc === 1) return Direction.RIGHT;
  if (dc === -1) return Direction.LEFT;
  return Direction.DOWN;
}

function getBodySegmentType(
  current: Position,
  prev: Position,
  next: Position,
): SegmentType {
  const rPrev = prev.row - current.row;
  const cPrev = prev.col - current.col;
  const rNext = next.row - current.row;
  const cNext = next.col - current.col;

  // Straight Horizontal
  if (rPrev === 0 && rNext === 0) {
    return 'straight_h';
  }

  // Straight Vertical
  if (cPrev === 0 && cNext === 0) {
    return 'straight_v';
  }

  // Corner Elbows
  const hasUp = rPrev === -1 || rNext === -1;
  const hasDown = rPrev === 1 || rNext === 1;
  const hasLeft = cPrev === -1 || cNext === -1;
  const hasRight = cPrev === 1 || cNext === 1;

  if (hasUp && hasRight) return 'corner_up_right';
  if (hasUp && hasLeft) return 'corner_up_left';
  if (hasDown && hasRight) return 'corner_down_right';
  if (hasDown && hasLeft) return 'corner_down_left';

  return 'straight_h';
}

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
