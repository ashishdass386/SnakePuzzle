/**
 * GameBoard — the puzzle grid with snakes overlaid.
 *
 * Layout:
 * - Renders the grid background (GameCell rows × cols).
 * - Positions each Snake absolutely on top.
 * - Computes cell size dynamically from available space.
 * - Passes animation commands down to each Snake.
 */

import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { SnakePiece } from '../game/types';
import { THEME, BOARD_SIZE_FRACTION, CELL_GAP } from '../utils/constants';
import { GameCell } from './GameCell';
import { Snake, SnakeAnimationCommand } from './Snake';
import { range } from '../utils/helpers';

// ─── Types ────────────────────────────────────────────────────────────────────

interface GameBoardProps {
  snakes: SnakePiece[];
  boardRows: number;
  boardCols: number;
  snakeCommands: Record<string, SnakeAnimationCommand>;
  onSnakeTap: (snakeId: string) => void;
  onSnakeExitComplete?: (snakeId: string) => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function computeCellSize(rows: number, cols: number): number {
  const { width, height } = Dimensions.get('window');
  const minDim = Math.min(width, height);
  const boardPx = minDim * BOARD_SIZE_FRACTION;
  // Cell size must fit both rows and cols
  const byWidth = (boardPx - CELL_GAP * (cols + 1)) / cols;
  const byHeight = (boardPx - CELL_GAP * (rows + 1)) / rows;
  return Math.floor(Math.min(byWidth, byHeight));
}

// ─── Component ────────────────────────────────────────────────────────────────

export const GameBoard: React.FC<GameBoardProps> = ({
  snakes,
  boardRows,
  boardCols,
  snakeCommands,
  onSnakeTap,
  onSnakeExitComplete,
}) => {
  const cellSize = computeCellSize(boardRows, boardCols);
  const boardPadding = CELL_GAP;
  const boardWidth = boardCols * cellSize + CELL_GAP * (boardCols + 1);
  const boardHeight = boardRows * cellSize + CELL_GAP * (boardRows + 1);

  return (
    <View
      style={[
        styles.board,
        {
          width: boardWidth,
          height: boardHeight,
        },
      ]}
    >
      {/* Grid background */}
      <View style={styles.gridContainer} pointerEvents="none">
        {range(boardRows).map(row => (
          <View key={`row-${row}`} style={styles.gridRow}>
            {range(boardCols).map(col => (
              <GameCell
                key={`cell-${row}-${col}`}
                size={cellSize}
                row={row}
                col={col}
              />
            ))}
          </View>
        ))}
      </View>

      {/* Snakes overlay */}
      {snakes.map(snake => {
        if (snake.exited && snakeCommands[snake.id] !== 'exit') {
          // Don't render fully exited snakes (animation done)
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
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  board: {
    backgroundColor: THEME.boardBg,
    borderRadius: 20,
    padding: CELL_GAP,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 12,
    borderWidth: 1,
    borderColor: THEME.border,
    overflow: 'hidden',
  },
  gridContainer: {
    position: 'absolute',
    top: CELL_GAP,
    left: CELL_GAP,
  },
  gridRow: {
    flexDirection: 'row',
    gap: CELL_GAP,
    marginBottom: CELL_GAP,
  },
});
