/**
 * Collision detection helpers.
 * Pure functions — no side effects, no React dependency.
 */

import { Direction, Position, SnakePiece, BoardSize } from './types';

/**
 * Returns the set of all occupied cells by non-exited snakes and obstacles,
 * excluding the snake we are checking (so a snake doesn't block itself).
 */
export function getOccupiedCells(
  snakes: SnakePiece[],
  excludeSnakeId: string,
  blockedCells?: Position[],
): Set<string> {
  const occupied = new Set<string>();
  if (blockedCells) {
    for (const pos of blockedCells) {
      occupied.add(posKey(pos));
    }
  }
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
 * Given a snake and its direction, compute all cells in front of the head.
 */
export function getCellsInFront(
  snake: SnakePiece,
  boardSize: BoardSize,
): Position[] {
  const head = snake.cells[0];
  const cells: Position[] = [];
  const delta = directionDelta(snake.direction);

  let r = head.row + delta.row;
  let c = head.col + delta.col;

  while (r >= 0 && r < boardSize.rows && c >= 0 && c < boardSize.cols) {
    cells.push({ row: r, col: c });
    r += delta.row;
    c += delta.col;
  }

  return cells;
}

/**
 * Checks whether a snake can exit the board.
 *
 * A snake can exit when every cell directly in front of ALL its body segments
 * (in its direction of movement) is clear of obstacles and other snakes.
 */
export function canSnakeExit(
  snake: SnakePiece,
  allSnakes: SnakePiece[],
  boardSize: BoardSize,
): boolean {
  const occupied = getOccupiedCells(allSnakes, snake.id, boardSize.blockedCells);
  const delta = directionDelta(snake.direction);

  for (const cell of snake.cells) {
    let r = cell.row + delta.row;
    let c = cell.col + delta.col;

    while (r >= 0 && r < boardSize.rows && c >= 0 && c < boardSize.cols) {
      if (occupied.has(posKey({ row: r, col: c }))) {
        return false;
      }
      r += delta.row;
      c += delta.col;
    }
  }

  return true;
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
