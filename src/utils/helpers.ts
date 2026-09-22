/**
 * Miscellaneous helper utilities.
 */

import { GameState, LevelProgress } from '../game/types';
import {
  STAR_3_MOVE_MULTIPLIER,
  STAR_2_MOVE_MULTIPLIER,
  HINTS_MAX_FOR_3_STARS,
  HINTS_MAX_FOR_2_STARS,
  COINS_PER_LEVEL_COMPLETION,
  COINS_BONUS_3_STARS,
  COINS_BONUS_2_STARS,
} from './constants';

// ─── Star Calculation ─────────────────────────────────────────────────────────

/**
 * Calculates the number of stars (1–3) earned for completing a level.
 */
export function calculateStars(
  moveCount: number,
  hintsUsed: number,
  snakeCount: number,
): number {
  const optimalMoves3 = Math.ceil(snakeCount * STAR_3_MOVE_MULTIPLIER);
  const optimalMoves2 = Math.ceil(snakeCount * STAR_2_MOVE_MULTIPLIER);

  if (moveCount <= optimalMoves3 && hintsUsed <= HINTS_MAX_FOR_3_STARS) {
    return 3;
  }
  if (moveCount <= optimalMoves2 && hintsUsed <= HINTS_MAX_FOR_2_STARS) {
    return 2;
  }
  return 1;
}

/**
 * Calculates coins earned from level completion.
 */
export function calculateCoinsEarned(stars: number): number {
  let coins = COINS_PER_LEVEL_COMPLETION;
  if (stars === 3) coins += COINS_BONUS_3_STARS;
  else if (stars === 2) coins += COINS_BONUS_2_STARS;
  return coins;
}

// ─── Level Progress ───────────────────────────────────────────────────────────

export function makeLevelProgress(
  state: GameState,
  stars: number,
): LevelProgress {
  return {
    stars,
    bestMoves: state.moveCount,
    completed: true,
    hintsUsed: state.hintsUsed,
  };
}

// ─── Formatting ───────────────────────────────────────────────────────────────

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export function formatCoins(coins: number): string {
  if (coins >= 1000) return `${(coins / 1000).toFixed(1)}k`;
  return String(coins);
}

// ─── Array Utilities ─────────────────────────────────────────────────────────

export function range(n: number): number[] {
  return Array.from({ length: n }, (_, i) => i);
}

/** Clamp a value between min and max */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}
