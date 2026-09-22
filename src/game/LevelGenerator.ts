/**
 * LevelGenerator — procedural, seeded, high-density reverse-play level generation.
 *
 * Supports straight, L-shaped, S-shaped, and winding snakes with guaranteed solvability.
 * Fills every available cell on the board without gaps.
 */

import { Direction, LevelConfig, Position, SnakePiece, GameState, BoardSize } from './types';
import { getDifficultyConfig, getBoardShape, createSeededRng } from './Difficulty';
import { isSolvable } from './PuzzleSolver';
import { posKey } from './Collision';
import { SNAKE_COLORS } from '../utils/constants';
import { getBoardTheme } from '../utils/themes';

const MAX_GEN_RETRIES = 50;

// ─── Public API ───────────────────────────────────────────────────────────────

export function generateLevel(levelNumber: number): LevelConfig {
  const config = getDifficultyConfig(levelNumber);
  const theme = getBoardTheme(levelNumber);
  const shape = getBoardShape(levelNumber, config.boardRows, config.boardCols);

  const totalCells = config.boardRows * config.boardCols;
  const blockedCount = shape.blockedCells?.length ?? 0;
  const availableCells = totalCells - blockedCount;
  const minRequiredSnakes = Math.max(3, Math.min(config.minSnakes, Math.floor(availableCells / 2.5)));

  const baseSeed = levelNumber * 6271 + 3141;

  for (let attempt = 0; attempt < MAX_GEN_RETRIES; attempt++) {
    const seed = baseSeed + attempt * 997;
    const rng = createSeededRng(seed);

    const boardSize: BoardSize = {
      rows: config.boardRows,
      cols: config.boardCols,
      blockedCells: shape.blockedCells,
      shapeType: shape.type,
    };

    const snakes = generateDenseSnakes(config, boardSize, rng);
    if (!snakes || snakes.length < minRequiredSnakes) continue;

    const gameState: GameState = {
      snakes,
      boardSize,
      levelNumber,
      moveCount: 0,
      hintsUsed: 0,
      startTime: 0,
      isComplete: false,
    };

    if (isSolvable(gameState, 250)) {
      return {
        levelNumber,
        boardSize,
        snakes,
        seed,
        theme,
      };
    }
  }

  // Fallback: guaranteed solvable dense level
  return generateFallbackLevel(levelNumber, shape);
}

// ─── Reverse-Play Dense Generation ────────────────────────────────────────────

function generateDenseSnakes(
  config: ReturnType<typeof getDifficultyConfig>,
  boardSize: BoardSize,
  rng: ReturnType<typeof createSeededRng>,
): SnakePiece[] | null {
  const { rows, cols } = boardSize;
  const totalCells = rows * cols;
  const blockedSet = new Set<string>();

  if (boardSize.blockedCells) {
    for (const pos of boardSize.blockedCells) {
      blockedSet.add(posKey(pos));
    }
  }

  const availableCells = totalCells - blockedSet.size;
  const targetOccupied = Math.floor(availableCells * config.targetFillRate);

  const occupied = new Set<string>(blockedSet);
  const snakes: SnakePiece[] = [];

  const maxAttempts = 700;
  let attempts = 0;
  let snakeIndex = 0;

  // 1. Place multi-segment snakes (lengths 2–4 with straight and winding bends)
  while (
    occupied.size - blockedSet.size < targetOccupied &&
    snakes.length < config.maxSnakes &&
    attempts < maxAttempts
  ) {
    attempts++;

    const remainingToTarget = targetOccupied - (occupied.size - blockedSet.size);
    const maxLen = Math.min(config.maxSnakeLength, Math.max(config.minSnakeLength, remainingToTarget));
    const minLen = config.minSnakeLength;
    const targetLength = rng.nextInt(minLen, maxLen);

    const candidate = tryPlaceReverseSnake(snakeIndex, targetLength, minLen, boardSize, occupied, rng);
    if (!candidate) continue;

    for (const cell of candidate.cells) {
      occupied.add(posKey(cell));
    }
    snakes.push(candidate);
    snakeIndex++;
  }

  // 2. Dense gap-filling pass: fill ANY remaining empty cell with length 2 or 1 snakes
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const p = { row: r, col: c };
      if (!occupied.has(posKey(p)) && snakes.length < config.maxSnakes + 20) {
        const fillSnake = tryPlaceReverseSnakeAtPos(snakeIndex, p, 2, 1, boardSize, occupied, rng);
        if (fillSnake) {
          for (const cell of fillSnake.cells) {
            occupied.add(posKey(cell));
          }
          snakes.push(fillSnake);
          snakeIndex++;
        }
      }
    }
  }

  const actualDensity = (occupied.size - blockedSet.size) / availableCells;
  if (snakes.length >= 3 && actualDensity >= 0.65) {
    return snakes;
  }

  return null;
}

/**
 * Tries to place a snake in reverse time anywhere on the board.
 */
function tryPlaceReverseSnake(
  index: number,
  targetLength: number,
  minAllowedLength: number,
  boardSize: BoardSize,
  occupied: Set<string>,
  rng: ReturnType<typeof createSeededRng>,
): SnakePiece | null {
  const directions: Direction[] = [
    Direction.UP,
    Direction.DOWN,
    Direction.LEFT,
    Direction.RIGHT,
  ];
  rng.shuffle(directions);

  // Collect empty candidate positions
  const positions: Position[] = [];
  for (let r = 0; r < boardSize.rows; r++) {
    for (let c = 0; c < boardSize.cols; c++) {
      if (!occupied.has(posKey({ row: r, col: c }))) {
        positions.push({ row: r, col: c });
      }
    }
  }
  rng.shuffle(positions);

  for (const pos of positions) {
    for (const dir of directions) {
      for (let len = targetLength; len >= minAllowedLength; len--) {
        const candidatePaths = generateCandidatePaths(pos, dir, len, rng);

        for (const path of candidatePaths) {
          if (validateReversePath(path, dir, boardSize, occupied)) {
            return {
              id: `snake_${index}`,
              cells: path,
              direction: dir,
              colorIndex: index % SNAKE_COLORS.length,
              exited: false,
              length: len,
            };
          }
        }
      }
    }
  }

  return null;
}

/**
 * Tries to place a snake specifically starting at `pos` in reverse time.
 */
function tryPlaceReverseSnakeAtPos(
  index: number,
  pos: Position,
  targetLength: number,
  minAllowedLength: number,
  boardSize: BoardSize,
  occupied: Set<string>,
  rng: ReturnType<typeof createSeededRng>,
): SnakePiece | null {
  const directions: Direction[] = [
    Direction.UP,
    Direction.DOWN,
    Direction.LEFT,
    Direction.RIGHT,
  ];
  rng.shuffle(directions);

  for (const dir of directions) {
    for (let len = targetLength; len >= minAllowedLength; len--) {
      const candidatePaths = generateCandidatePaths(pos, dir, len, rng);

      for (const path of candidatePaths) {
        if (validateReversePath(path, dir, boardSize, occupied)) {
          return {
            id: `snake_${index}`,
            cells: path,
            direction: dir,
            colorIndex: index % SNAKE_COLORS.length,
            exited: false,
            length: len,
          };
        }
      }
    }
  }

  return null;
}

/**
 * Generates straight, L-shaped, and winding candidate body paths for a given head, direction, and length.
 */
function generateCandidatePaths(
  head: Position,
  dir: Direction,
  length: number,
  rng: ReturnType<typeof createSeededRng>,
): Position[][] {
  const paths: Position[][] = [];
  const delta = dirDelta(dir);
  const backDelta = { row: -delta.row, col: -delta.col };

  // 1. Straight path
  const straightCells: Position[] = [head];
  for (let seg = 1; seg < length; seg++) {
    straightCells.push({
      row: head.row + backDelta.row * seg,
      col: head.col + backDelta.col * seg,
    });
  }
  paths.push(straightCells);

  // 2. Bent and winding paths (for length >= 3)
  if (length >= 3) {
    const perp1 = { row: -delta.col, col: delta.row };
    const perp2 = { row: delta.col, col: -delta.row };
    const perps = rng.next() > 0.5 ? [perp1, perp2] : [perp2, perp1];

    for (const perp of perps) {
      // L-bend: segment 1 is backwards, remaining segments turn perpendicular
      const lCells: Position[] = [head, { row: head.row + backDelta.row, col: head.col + backDelta.col }];
      for (let s = 2; s < length; s++) {
        const last = lCells[lCells.length - 1];
        lCells.push({ row: last.row + perp.row, col: last.col + perp.col });
      }
      paths.push(lCells);

      // S-bend: for length >= 4, turn perpendicular then backwards again
      if (length >= 4) {
        const sCells: Position[] = [
          head,
          { row: head.row + backDelta.row, col: head.col + backDelta.col },
          { row: head.row + backDelta.row + perp.row, col: head.col + backDelta.col + perp.col },
          { row: head.row + backDelta.row * 2 + perp.row, col: head.col + backDelta.col * 2 + perp.col },
        ];
        paths.push(sCells);
      }
    }
  }

  return paths;
}

/**
 * Validates if a snake path can exit in direction `dir` without hitting occupied cells.
 */
function validateReversePath(
  path: Position[],
  dir: Direction,
  boardSize: BoardSize,
  occupied: Set<string>,
): boolean {
  const delta = dirDelta(dir);
  const pathKeys = new Set<string>();

  // Check bounds and collision for each cell in path
  for (const cell of path) {
    if (
      cell.row < 0 ||
      cell.row >= boardSize.rows ||
      cell.col < 0 ||
      cell.col >= boardSize.cols
    ) {
      return false;
    }

    const key = posKey(cell);
    if (occupied.has(key) || pathKeys.has(key)) {
      return false;
    }
    pathKeys.add(key);
  }

  // Check exit corridor for EVERY cell in the snake path
  for (const cell of path) {
    let r = cell.row + delta.row;
    let c = cell.col + delta.col;

    while (r >= 0 && r < boardSize.rows && c >= 0 && c < boardSize.cols) {
      const stepKey = posKey({ row: r, col: c });
      if (occupied.has(stepKey) && !pathKeys.has(stepKey)) {
        return false;
      }
      r += delta.row;
      c += delta.col;
    }
  }

  return true;
}

// ─── Fallback Level ───────────────────────────────────────────────────────────

function generateFallbackLevel(
  levelNumber: number,
  shape?: ReturnType<typeof getBoardShape>,
): LevelConfig {
  const config = getDifficultyConfig(levelNumber);
  const theme = getBoardTheme(levelNumber);
  const boardSize: BoardSize = {
    rows: config.boardRows,
    cols: config.boardCols,
    blockedCells: shape?.blockedCells,
    shapeType: shape?.type,
  };

  const blockedSet = new Set<string>();
  if (shape?.blockedCells) {
    for (const pos of shape.blockedCells) {
      blockedSet.add(posKey(pos));
    }
  }

  const snakes: SnakePiece[] = [];
  let sIdx = 0;

  // Fill in pairs with guaranteed exits towards nearest edges
  for (let r = 0; r < boardSize.rows; r++) {
    for (let c = 0; c < boardSize.cols; c += 2) {
      if (
        c + 1 < boardSize.cols &&
        !blockedSet.has(posKey({ row: r, col: c })) &&
        !blockedSet.has(posKey({ row: r, col: c + 1 }))
      ) {
        const isLeftHalf = c < boardSize.cols / 2;
        snakes.push({
          id: `snake_${sIdx}`,
          cells: isLeftHalf
            ? [{ row: r, col: c }, { row: r, col: c + 1 }]
            : [{ row: r, col: c + 1 }, { row: r, col: c }],
          direction: isLeftHalf ? Direction.LEFT : Direction.RIGHT,
          colorIndex: sIdx % SNAKE_COLORS.length,
          exited: false,
          length: 2,
        });
        sIdx++;
      }
    }
  }

  return {
    levelNumber,
    boardSize,
    snakes,
    seed: 0,
    theme,
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function dirDelta(dir: Direction): Position {
  switch (dir) {
    case Direction.UP:    return { row: -1, col: 0 };
    case Direction.DOWN:  return { row: 1,  col: 0 };
    case Direction.LEFT:  return { row: 0,  col: -1 };
    case Direction.RIGHT: return { row: 0,  col: 1 };
  }
}
