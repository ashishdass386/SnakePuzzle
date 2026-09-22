/**
 * LevelGenerator — procedural, seeded level generation.
 *
 * Every level is generated from its level number as a seed.
 * Levels are validated by PuzzleSolver before being returned.
 * If a layout is unsolvable, we increment the seed and retry (up to MAX_RETRIES).
 *
 * Strategy:
 * 1. Pick board size + snake count from DifficultyConfig.
 * 2. Randomly place snakes on the board (no overlaps).
 * 3. Each snake gets a random direction pointing toward the nearest edge.
 * 4. Validate with PuzzleSolver.
 * 5. Return validated LevelConfig.
 */

import { Direction, LevelConfig, Position, SnakePiece, GameState } from './types';
import { getDifficultyConfig, createSeededRng } from './Difficulty';
import { isSolvable } from './PuzzleSolver';
import { posKey } from './Collision';
import { SNAKE_COLORS } from '../utils/constants';

const MAX_RETRIES = 30;

// ─── Public API ───────────────────────────────────────────────────────────────

export function generateLevel(levelNumber: number): LevelConfig {
  const config = getDifficultyConfig(levelNumber);
  const baseSeed = levelNumber * 6271 + 3141;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    const seed = baseSeed + attempt * 997;
    const rng = createSeededRng(seed);

    const boardSize = { rows: config.boardRows, cols: config.boardCols };
    const snakeCount = rng.nextInt(config.minSnakes, config.maxSnakes);

    const snakes = placeSnakes(snakeCount, config, boardSize, rng);
    if (!snakes) continue; // placement failed (not enough space)

    const gameState: GameState = {
      snakes,
      boardSize,
      levelNumber,
      moveCount: 0,
      hintsUsed: 0,
      startTime: 0,
      isComplete: false,
    };

    if (isSolvable(gameState, config.maxSolverDepth)) {
      return { levelNumber, boardSize, snakes, seed };
    }
  }

  // Fallback: return a trivially solvable level (all snakes already free)
  return generateFallbackLevel(levelNumber);
}

// ─── Snake Placement ──────────────────────────────────────────────────────────

function placeSnakes(
  count: number,
  config: ReturnType<typeof getDifficultyConfig>,
  boardSize: { rows: number; cols: number },
  rng: ReturnType<typeof createSeededRng>,
): SnakePiece[] | null {
  const snakes: SnakePiece[] = [];
  const occupied = new Set<string>();

  for (let i = 0; i < count; i++) {
    const length = rng.nextInt(config.minSnakeLength, config.maxSnakeLength);
    const snake = tryPlaceSnake(i, length, boardSize, occupied, rng);
    if (!snake) return null; // placement failed

    for (const cell of snake.cells) {
      occupied.add(posKey(cell));
    }
    snakes.push(snake);
  }

  return snakes;
}

function tryPlaceSnake(
  index: number,
  length: number,
  boardSize: { rows: number; cols: number },
  occupied: Set<string>,
  rng: ReturnType<typeof createSeededRng>,
): SnakePiece | null {
  const MAX_PLACEMENT_ATTEMPTS = 100;

  for (let attempt = 0; attempt < MAX_PLACEMENT_ATTEMPTS; attempt++) {
    const direction = randomDirection(rng);
    const delta = dirDelta(direction);
    const tailDelta = { row: -delta.row, col: -delta.col };

    // Pick a random head position that's valid
    const headRow = rng.nextInt(0, boardSize.rows - 1);
    const headCol = rng.nextInt(0, boardSize.cols - 1);

    // Build cells from head in reverse-body direction
    const cells: Position[] = [];
    let valid = true;

    for (let seg = 0; seg < length; seg++) {
      const cell = {
        row: headRow + tailDelta.row * seg,
        col: headCol + tailDelta.col * seg,
      };

      if (
        cell.row < 0 || cell.row >= boardSize.rows ||
        cell.col < 0 || cell.col >= boardSize.cols ||
        occupied.has(posKey(cell))
      ) {
        valid = false;
        break;
      }
      cells.push(cell);
    }

    if (!valid || cells.length !== length) continue;

    return {
      id: `snake_${index}`,
      cells,
      direction,
      colorIndex: index % SNAKE_COLORS.length,
      exited: false,
      length,
    };
  }

  return null;
}

// ─── Fallback Level ───────────────────────────────────────────────────────────

/** Generates a guaranteed-solvable simple level as a fallback */
function generateFallbackLevel(levelNumber: number): LevelConfig {
  const config = getDifficultyConfig(levelNumber);
  const boardSize = { rows: config.boardRows, cols: config.boardCols };
  const snakes: SnakePiece[] = [];
  const count = Math.max(2, Math.min(config.minSnakes, 4));

  const borderConfigs = [
    { row: 0, col: 0, dir: Direction.UP },
    { row: boardSize.rows - 1, col: boardSize.cols - 1, dir: Direction.DOWN },
    { row: boardSize.rows - 1, col: 0, dir: Direction.LEFT },
    { row: 0, col: boardSize.cols - 1, dir: Direction.RIGHT },
  ];

  for (let i = 0; i < count; i++) {
    const b = borderConfigs[i % borderConfigs.length];
    snakes.push({
      id: `snake_${i}`,
      cells: [{ row: b.row, col: b.col }],
      direction: b.dir,
      colorIndex: i % SNAKE_COLORS.length,
      exited: false,
      length: 1,
    });
  }
  return { levelNumber, boardSize, snakes, seed: 0 };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function randomDirection(rng: ReturnType<typeof createSeededRng>): Direction {
  const dirs = [Direction.UP, Direction.DOWN, Direction.LEFT, Direction.RIGHT];
  return dirs[rng.nextInt(0, 3)];
}

function dirDelta(dir: Direction): Position {
  switch (dir) {
    case Direction.UP:    return { row: -1, col: 0 };
    case Direction.DOWN:  return { row: 1,  col: 0 };
    case Direction.LEFT:  return { row: 0,  col: -1 };
    case Direction.RIGHT: return { row: 0,  col: 1 };
  }
}
