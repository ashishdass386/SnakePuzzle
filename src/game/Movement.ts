/**
 * Movement calculation utilities.
 * Computes visual positions for animating snake exit off the board.
 */

import { Direction, Position, SnakePiece, BoardSize } from './types';

// ─── Exit Offset Calculation ──────────────────────────────────────────────────

export interface ExitOffset {
  /** Pixel translation to apply when animating exit (translateX/Y) */
  x: number;
  y: number;
}

/**
 * Computes the pixel offset needed to fully animate a snake off-screen
 * when it exits in its direction.
 *
 * The offset needs to be large enough to slide the entire snake off the board.
 * We over-shoot by the full board dimension to ensure it's fully hidden.
 *
 * @param snake  The snake to exit
 * @param boardSize  Number of rows/cols
 * @param cellSize  Pixel size per cell
 */
export function getExitOffset(
  snake: SnakePiece,
  boardSize: BoardSize,
  cellSize: number,
  cellGap: number = 0,
): ExitOffset {
  // Step size includes the gap between cells
  const step = cellSize + cellGap;
  const extraCells = snake.length + 2;

  switch (snake.direction) {
    case Direction.UP:
      return { x: 0, y: -(boardSize.rows + extraCells) * step };
    case Direction.DOWN:
      return { x: 0, y: (boardSize.rows + extraCells) * step };
    case Direction.LEFT:
      return { x: -(boardSize.cols + extraCells) * step, y: 0 };
    case Direction.RIGHT:
      return { x: (boardSize.cols + extraCells) * step, y: 0 };
    default:
      return { x: 0, y: 0 };
  }
}

/**
 * Converts a grid position to pixel coordinates (top-left corner of the cell).
 */
export function gridToPixel(
  pos: Position,
  cellSize: number,
  cellGap: number = 0,
  boardPadding: number = 0,
): { x: number; y: number } {
  return {
    x: boardPadding + pos.col * (cellSize + cellGap),
    y: boardPadding + pos.row * (cellSize + cellGap),
  };
}

/**
 * Returns the pixel center of a grid cell.
 */
export function cellCenter(
  pos: Position,
  cellSize: number,
  cellGap: number = 0,
  boardPadding: number = 0,
): { x: number; y: number } {
  return {
    x: boardPadding + pos.col * (cellSize + cellGap) + cellSize / 2,
    y: boardPadding + pos.row * (cellSize + cellGap) + cellSize / 2,
  };
}

/**
 * Returns cells that the snake occupies AFTER moving one step (but before exiting).
 * Used internally by the solver to simulate partial movement.
 */
export function slidedSnakeCells(
  snake: SnakePiece,
  steps: number,
): Position[] {
  const delta = directionDelta(snake.direction);
  return snake.cells.map(cell => ({
    row: cell.row + delta.row * steps,
    col: cell.col + delta.col * steps,
  }));
}

function directionDelta(direction: Direction): Position {
  switch (direction) {
    case Direction.UP:    return { row: -1, col: 0 };
    case Direction.DOWN:  return { row: 1,  col: 0 };
    case Direction.LEFT:  return { row: 0,  col: -1 };
    case Direction.RIGHT: return { row: 0,  col: 1 };
  }
}
