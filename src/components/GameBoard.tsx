/**
 * GameBoard — borderless, seamless canvas where vibrant snakes live freely
 * without boxed frame borders, side trims, or corner brackets.
 */

import React, { useMemo } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { SnakePiece, Position } from '../game/types';
import { CELL_GAP } from '../utils/constants';
import { BoardThemeConfig, getBoardTheme } from '../utils/themes';
import { GameCell } from './GameCell';
import { Snake, SnakeAnimationCommand } from './Snake';
import { range } from '../utils/helpers';
import { posKey } from '../game/Collision';

// ─── Types ────────────────────────────────────────────────────────────────────

interface GameBoardProps {
  snakes: SnakePiece[];
  boardRows: number;
  boardCols: number;
  blockedCells?: Position[];
  theme?: BoardThemeConfig;
  snakeCommands: Record<string, SnakeAnimationCommand>;
  insetsTop?: number;
  insetsBottom?: number;
  onSnakeTap: (snakeId: string) => void;
  onSnakeExitComplete?: (snakeId: string) => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function computeCellSize(
  rows: number,
  cols: number,
  insetsTop: number = 0,
  insetsBottom: number = 0,
): number {
  const { width, height } = Dimensions.get('window');
  const maxBoardWidth = width - 24;
  const reservedVertical = insetsTop + insetsBottom + 180;
  const maxBoardHeight = Math.max(180, height - reservedVertical);

  const availableGridWidth = maxBoardWidth - CELL_GAP * (cols - 1);
  const availableGridHeight = maxBoardHeight - CELL_GAP * (rows - 1);

  const cellW = availableGridWidth / cols;
  const cellH = availableGridHeight / rows;

  return Math.floor(Math.max(16, Math.min(cellW, cellH)));
}

// ─── Component ────────────────────────────────────────────────────────────────

export const GameBoard: React.FC<GameBoardProps> = ({
  snakes,
  boardRows,
  boardCols,
  blockedCells = [],
  theme,
  snakeCommands,
  insetsTop = 0,
  insetsBottom = 0,
  onSnakeTap,
  onSnakeExitComplete,
}) => {
  const currentTheme = theme ?? getBoardTheme(1);
  const cellSize = computeCellSize(boardRows, boardCols, insetsTop, insetsBottom);
  const boardPadding = 0; // Completely borderless — 0px padding

  const gridWidth = boardCols * cellSize + CELL_GAP * (boardCols - 1);
  const gridHeight = boardRows * cellSize + CELL_GAP * (boardRows - 1);

  const blockedSet = useMemo(() => {
    const set = new Set<string>();
    for (const pos of blockedCells) {
      set.add(posKey(pos));
    }
    return set;
  }, [blockedCells]);

  return (
    <View style={styles.outerWrapper}>
      {/* Seamless Borderless Playfield */}
      <View
        style={[
          styles.boardCanvas,
          {
            width: gridWidth,
            height: gridHeight,
          },
        ]}
      >
        {/* Ambient Guide Dots Layer */}
        <View
          style={[
            styles.gridContainer,
            {
              width: gridWidth,
              height: gridHeight,
            },
          ]}
          pointerEvents="none"
        >
          {range(boardRows).map(row => (
            <View key={`row-${row}`} style={styles.gridRow}>
              {range(boardCols).map(col => {
                const isBlocked = blockedSet.has(posKey({ row, col }));
                return (
                  <GameCell
                    key={`cell-${row}-${col}`}
                    size={cellSize}
                    row={row}
                    col={col}
                    theme={currentTheme}
                    isBlocked={isBlocked}
                  />
                );
              })}
            </View>
          ))}
        </View>

        {/* Snakes overlay */}
        {snakes.map(snake => {
          if (snake.exited && snakeCommands[snake.id] !== 'exit') {
            return null;
          }
          return (
            <Snake
              key={snake.id}
              snake={snake}
              cellSize={cellSize}
              boardPadding={boardPadding}
              boardSize={{ rows: boardRows, cols: boardCols }}
              animCommand={snakeCommands[snake.id] ?? 'idle'}
              onTap={onSnakeTap}
              onExitComplete={onSnakeExitComplete}
            />
          );
        })}
      </View>
    </View>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  outerWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  boardCanvas: {
    backgroundColor: 'transparent',
    overflow: 'visible',
    position: 'relative',
  },
  gridContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  gridRow: {
    flexDirection: 'row',
    gap: CELL_GAP,
  },
});
