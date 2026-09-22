/**
 * Collision detection helpers.
 * Pure functions — no side effects, no React dependency.
 */

import { Direction, Position, SnakePiece, BoardSize } from './types';

/**
 * Returns the set of all occupied cells by non-exited snakes,
 * excluding the snake we are checking (so a snake doesn't block itself).
 */
export function getOccupiedCells(
  snakes: SnakePiece[],
  excludeSnakeId: string,
): Set<string> {
  const occupied = new Set<string>();
  for (const snake of snakes) {
    if (snake.exited || snake.id === excludeSnakeId) continue;
    for (const cell of snake.cells) {
      occupied.add(posKey(cell));
    }
  }
  return occupied;
}

/** Serialize a position to a string key for Set/Map lookup */
export function posKey(pos: Position): string {
  return `${pos.row},${pos.col}`;
}

/**
 * Given a snake's head and its direction, compute all cells
 * the snake would traverse if it slides forward until the board edge.
 *
 * Returns the cells in front of the snake head (not including head itself).
 */
export function getCellsInFront(
  snake: SnakePiece,
  boardSize: BoardSize,
): Position[] {
  const head = snake.cells[0];
  const cells: Position[] = [];

  switch (snake.direction) {
    case Direction.UP:
      for (let r = head.row - 1; r >= 0; r--) {
        cells.push({ row: r, col: head.col });
      }
      break;
    case Direction.DOWN:
      for (let r = head.row + 1; r < boardSize.rows; r++) {
        cells.push({ row: r, col: head.col });
      }
      break;
    case Direction.LEFT:
      for (let c = head.col - 1; c >= 0; c--) {
        cells.push({ row: head.row, col: c });
      }
      break;
    case Direction.RIGHT:
      for (let c = head.col + 1; c < boardSize.cols; c++) {
        cells.push({ row: head.row, col: c });
      }
      break;
  }

  return cells;
}

/**
 * Checks whether a snake can exit the board.
 *
 * A snake can exit when:
 * 1. Every cell directly in front of its entire body (in its direction) is empty.
 * 2. It reaches the board edge.
 *
 * For a multi-cell snake, ALL cells along the exit path must be clear
 * until the last body cell leaves the board.
 */
export function canSnakeExit(
  snake: SnakePiece,
  allSnakes: SnakePiece[],
  boardSize: BoardSize,
): boolean {
  const occupied = getOccupiedCells(allSnakes, snake.id);

  // We need the path for the HEAD to exit (reach the board edge and beyond).
  // The tail needs to clear its current position too.
  // Simple rule: ALL cells in front of the head until (and past) board edge must be free.
  const head = snake.cells[0];

  switch (snake.direction) {
    case Direction.UP: {
      for (let r = head.row - 1; r >= 0; r--) {
        if (occupied.has(posKey({ row: r, col: head.col }))) return false;
      }
      return true;
    }
    case Direction.DOWN: {
      for (let r = head.row + 1; r < boardSize.rows; r++) {
        if (occupied.has(posKey({ row: r, col: head.col }))) return false;
      }
      return true;
    }
    case Direction.LEFT: {
      for (let c = head.col - 1; c >= 0; c--) {
        if (occupied.has(posKey({ row: head.row, col: c }))) return false;
      }
      return true;
    }
    case Direction.RIGHT: {
      for (let c = head.col + 1; c < boardSize.cols; c++) {
        if (occupied.has(posKey({ row: head.row, col: c }))) return false;
      }
      return true;
    }
    default:
      return false;
  }
}

/**
 * Returns true if a position is within the board bounds.
 */
export function isWithinBounds(pos: Position, boardSize: BoardSize): boolean {
  return (
    pos.row >= 0 &&
    pos.row < boardSize.rows &&
    pos.col >= 0 &&
    pos.col < boardSize.cols
  );
}

/**
 * Given direction, returns the delta (dr, dc) for one step.
 */
export function directionDelta(direction: Direction): Position {
  switch (direction) {
    case Direction.UP:    return { row: -1, col: 0 };
    case Direction.DOWN:  return { row: 1,  col: 0 };
    case Direction.LEFT:  return { row: 0,  col: -1 };
    case Direction.RIGHT: return { row: 0,  col: 1 };
  }
}
