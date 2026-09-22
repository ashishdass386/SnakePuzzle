/**
 * Core data types for Snake Puzzle game.
 * These types define the game model layer, independent of UI.
 */

// ─── Direction ────────────────────────────────────────────────────────────────

export enum Direction {
  UP = 'UP',
  DOWN = 'DOWN',
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
}

// ─── Position ─────────────────────────────────────────────────────────────────

export interface Position {
  row: number;
  col: number;
}

// ─── Snake ────────────────────────────────────────────────────────────────────

export interface SnakePiece {
  /** Ordered array of grid cells: [head, body1, body2, ...tail] */
  cells: Position[];
  /** Movement direction (determined by head facing) */
  direction: Direction;
  /** Unique identifier */
  id: string;
  /** Color token (index into SNAKE_COLORS array) */
  colorIndex: number;
  /** Whether this snake has successfully exited the board */
  exited: boolean;
  /** Length (= cells.length) */
  length: number;
}

import { BoardThemeConfig } from '../utils/themes';

// ─── Board Shape & Obstacles ──────────────────────────────────────────────────

export type BoardShapeType =
  | 'rectangle'
  | 'cross'
  | 'diamond'
  | 'arrow'
  | 'heart'
  | 'ring'
  | 'hourglass'
  | 'pyramid'
  | 't_shape'
  | 'u_shape'
  | 'zigzag'
  | 'stairs'
  | 'butterfly'
  | 'castle'
  | 'compact';

export interface BoardShape {
  type: BoardShapeType;
  blockedCells: Position[]; // Cells outside the shape or obstacle cells
}

// ─── Board ────────────────────────────────────────────────────────────────────

export interface BoardSize {
  rows: number;
  cols: number;
  blockedCells?: Position[];
  shapeType?: BoardShapeType;
}

// ─── Game State ───────────────────────────────────────────────────────────────

export interface GameState {
  snakes: SnakePiece[];
  boardSize: BoardSize;
  levelNumber: number;
  moveCount: number;
  hintsUsed: number;
  startTime: number; // timestamp ms
  isComplete: boolean;
}

// ─── Level Config (as produced by generator) ──────────────────────────────────

export interface LevelConfig {
  levelNumber: number;
  boardSize: BoardSize;
  snakes: SnakePiece[];
  seed: number;
  theme?: BoardThemeConfig;
}

// ─── Tap Result ───────────────────────────────────────────────────────────────

export type TapResultType = 'moved' | 'blocked' | 'exited' | 'already_exited';

export interface TapResult {
  type: TapResultType;
  snakeId: string;
  levelComplete: boolean;
}

// ─── Difficulty ───────────────────────────────────────────────────────────────

export type DifficultyTier = 'easy' | 'normal' | 'medium' | 'hard' | 'very_hard' | 'expert';

export interface DifficultyConfig {
  tier: DifficultyTier;
  boardRows: number;
  boardCols: number;
  minSnakes: number;
  maxSnakes: number;
  minSnakeLength: number;
  maxSnakeLength: number;
  targetFillRate: number; // e.g. 0.75 - 0.95
  maxSolverDepth: number;
}

// ─── Progress & Storage ───────────────────────────────────────────────────────

export interface LevelProgress {
  stars: number; // 0–3
  bestMoves: number;
  completed: boolean;
  hintsUsed: number;
}

export interface GameProgress {
  highestUnlockedLevel: number;
  coins: number;
  levels: Record<string, LevelProgress>;
}

export interface GameSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  hapticsEnabled: boolean;
}

// ─── Hint ─────────────────────────────────────────────────────────────────────

export interface HintResult {
  found: boolean;
  snakeId?: string;
}
