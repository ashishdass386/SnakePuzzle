/**
 * Difficulty configuration for each level tier.
 * Controls board size, snake counts, and lengths.
 */

import { DifficultyConfig, DifficultyTier } from './types';

// ─── Tier Breakpoints ─────────────────────────────────────────────────────────

const TIER_BREAKPOINTS: Array<{ maxLevel: number; tier: DifficultyTier }> = [
  { maxLevel: 20, tier: 'easy' },
  { maxLevel: 50, tier: 'normal' },
  { maxLevel: 100, tier: 'medium' },
  { maxLevel: 250, tier: 'hard' },
  { maxLevel: 500, tier: 'very_hard' },
  { maxLevel: Infinity, tier: 'expert' },
];

// ─── Difficulty Config Table ──────────────────────────────────────────────────

const DIFFICULTY_CONFIGS: Record<DifficultyTier, DifficultyConfig> = {
  easy: {
    tier: 'easy',
    boardRows: 4,
    boardCols: 4,
    minSnakes: 2,
    maxSnakes: 3,
    minSnakeLength: 1,
    maxSnakeLength: 2,
    maxSolverDepth: 10,
  },
  normal: {
    tier: 'normal',
    boardRows: 5,
    boardCols: 5,
    minSnakes: 3,
    maxSnakes: 4,
    minSnakeLength: 1,
    maxSnakeLength: 3,
    maxSolverDepth: 15,
  },
  medium: {
    tier: 'medium',
    boardRows: 5,
    boardCols: 6,
    minSnakes: 4,
    maxSnakes: 5,
    minSnakeLength: 2,
    maxSnakeLength: 3,
    maxSolverDepth: 20,
  },
  hard: {
    tier: 'hard',
    boardRows: 6,
    boardCols: 6,
    minSnakes: 4,
    maxSnakes: 6,
    minSnakeLength: 2,
    maxSnakeLength: 4,
    maxSolverDepth: 25,
  },
  very_hard: {
    tier: 'very_hard',
    boardRows: 7,
    boardCols: 7,
    minSnakes: 5,
    maxSnakes: 7,
    minSnakeLength: 2,
    maxSnakeLength: 4,
    maxSolverDepth: 30,
  },
  expert: {
    tier: 'expert',
    boardRows: 8,
    boardCols: 8,
    minSnakes: 6,
    maxSnakes: 8,
    minSnakeLength: 2,
    maxSnakeLength: 5,
    maxSolverDepth: 40,
  },
};

// ─── Public API ───────────────────────────────────────────────────────────────

export function getDifficultyTier(levelNumber: number): DifficultyTier {
  for (const bp of TIER_BREAKPOINTS) {
    if (levelNumber <= bp.maxLevel) {
      return bp.tier;
    }
  }
  return 'expert';
}

export function getDifficultyConfig(levelNumber: number): DifficultyConfig {
  const tier = getDifficultyTier(levelNumber);
  return DIFFICULTY_CONFIGS[tier];
}

// ─── Seeded Pseudo-Random Number Generator ────────────────────────────────────
// Uses mulberry32 algorithm — fast, good distribution, deterministic from seed.

export function createSeededRng(seed: number) {
  let s = seed >>> 0;
  return {
    /** Returns float in [0, 1) */
    next(): number {
      s += 0x6d2b79f5;
      let t = s;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    },
    /** Returns integer in [min, max] inclusive */
    nextInt(min: number, max: number): number {
      return Math.floor(this.next() * (max - min + 1)) + min;
    },
    /** Shuffles array in-place using Fisher-Yates */
    shuffle<T>(arr: T[]): T[] {
      for (let i = arr.length - 1; i > 0; i--) {
        const j = this.nextInt(0, i);
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    },
  };
}
