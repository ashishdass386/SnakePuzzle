/**
 * Difficulty configuration for each level tier.
 * Controls board size, snake counts, and lengths.
 */

import { DifficultyConfig, DifficultyTier } from './types';

// ─── Tier Breakpoints ─────────────────────────────────────────────────────────

// ─── Tier Breakpoints ─────────────────────────────────────────────────────────

// ─── Tier Breakpoints ─────────────────────────────────────────────────────────

const TIER_BREAKPOINTS: Array<{ maxLevel: number; tier: DifficultyTier }> = [
  { maxLevel: 5, tier: 'easy' },
  { maxLevel: 15, tier: 'normal' },
  { maxLevel: 35, tier: 'medium' },
  { maxLevel: 60, tier: 'hard' },
  { maxLevel: 100, tier: 'very_hard' },
  { maxLevel: Infinity, tier: 'expert' },
];

// ─── Difficulty Config Table (Compact Cute Snakes & High Density) ─────────────

const DIFFICULTY_CONFIGS: Record<DifficultyTier, DifficultyConfig> = {
  easy: {
    tier: 'easy',
    boardRows: 6,
    boardCols: 6,
    minSnakes: 12,
    maxSnakes: 24,
    minSnakeLength: 1,
    maxSnakeLength: 2,
    targetFillRate: 0.96,
    maxSolverDepth: 50,
  },
  normal: {
    tier: 'normal',
    boardRows: 7,
    boardCols: 7,
    minSnakes: 18,
    maxSnakes: 36,
    minSnakeLength: 1,
    maxSnakeLength: 3,
    targetFillRate: 0.96,
    maxSolverDepth: 70,
  },
  medium: {
    tier: 'medium',
    boardRows: 8,
    boardCols: 8,
    minSnakes: 25,
    maxSnakes: 50,
    minSnakeLength: 1,
    maxSnakeLength: 3,
    targetFillRate: 0.97,
    maxSolverDepth: 90,
  },
  hard: {
    tier: 'hard',
    boardRows: 8,
    boardCols: 9,
    minSnakes: 32,
    maxSnakes: 62,
    minSnakeLength: 1,
    maxSnakeLength: 3,
    targetFillRate: 0.97,
    maxSolverDepth: 110,
  },
  very_hard: {
    tier: 'very_hard',
    boardRows: 9,
    boardCols: 9,
    minSnakes: 40,
    maxSnakes: 75,
    minSnakeLength: 1,
    maxSnakeLength: 4,
    targetFillRate: 0.98,
    maxSolverDepth: 130,
  },
  expert: {
    tier: 'expert',
    boardRows: 10,
    boardCols: 10,
    minSnakes: 48,
    maxSnakes: 90,
    minSnakeLength: 1,
    maxSnakeLength: 4,
    targetFillRate: 0.98,
    maxSolverDepth: 150,
  },
};

// ─── 15 Silhouette Shapes Generator ───────────────────────────────────────────

import { BoardShape, Position, BoardShapeType } from './types';

const SHAPE_ROTATION: BoardShapeType[] = [
  'rectangle',
  'cross',
  'diamond',
  'arrow',
  'ring',
  'heart',
  'hourglass',
  'pyramid',
  't_shape',
  'u_shape',
  'zigzag',
  'stairs',
  'butterfly',
  'castle',
  'compact',
];

export function getBoardShape(levelNumber: number, rows: number, cols: number): BoardShape {
  // Rotate through exciting shapes starting at level 2
  const shapeIndex = (levelNumber - 1) % SHAPE_ROTATION.length;
  const shapeType = levelNumber === 1 ? 'rectangle' : SHAPE_ROTATION[shapeIndex];

  const blocked: Position[] = [];
  const midR = Math.floor(rows / 2);
  const midC = Math.floor(cols / 2);

  switch (shapeType) {
    case 'cross': {
      // 4 corners cut out
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const isCorner =
            (r === 0 || r === rows - 1) &&
            (c === 0 || c === cols - 1 || (cols >= 6 && (c === 1 || c === cols - 2)));
          if (isCorner) blocked.push({ row: r, col: c });
        }
      }
      break;
    }

    case 'diamond': {
      // Rhombus / diamond active center
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const dist = Math.abs(r - midR) + Math.abs(c - midC);
          const maxDist = Math.floor(Math.min(rows, cols) / 2) + 1;
          if (dist > maxDist) {
            blocked.push({ row: r, col: c });
          }
        }
      }
      break;
    }

    case 'arrow': {
      // Arrow pointing up
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const inHead = r <= midR && Math.abs(c - midC) <= r;
          const inStem = r > midR && Math.abs(c - midC) <= (cols >= 6 ? 2 : 1);
          if (!inHead && !inStem) {
            blocked.push({ row: r, col: c });
          }
        }
      }
      break;
    }

    case 'ring': {
      // Octagonal shape with solid center (no hollow gap in middle)
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const isOuterCorner = (r === 0 || r === rows - 1) && (c <= 1 || c >= cols - 2);
          if (isOuterCorner) {
            blocked.push({ row: r, col: c });
          }
        }
      }
      break;
    }

    case 'heart': {
      // Cute heart shape
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const isTopCleft = r === 0 && (c === midC || c === 0 || c === cols - 1);
          const isBottomCut = r >= midR && (c < r - midR || c >= cols - (r - midR));
          if (isTopCleft || isBottomCut) {
            blocked.push({ row: r, col: c });
          }
        }
      }
      break;
    }

    case 'hourglass': {
      // Wide at top and bottom, narrow at waist
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const distFromMidR = Math.abs(r - midR);
          const allowedWidth = distFromMidR + 1;
          if (Math.abs(c - midC) > allowedWidth) {
            blocked.push({ row: r, col: c });
          }
        }
      }
      break;
    }

    case 'pyramid': {
      // Stepped pyramid pointing UP
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const allowedHalfW = r + (cols % 2 === 0 ? 1 : 0);
          if (Math.abs(c - midC) > allowedHalfW) {
            blocked.push({ row: r, col: c });
          }
        }
      }
      break;
    }

    case 'stairs': {
      // Stepped diagonal cut on top-right and bottom-left corners
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const isTopRight = r <= 1 && c >= cols - 2;
          const isBottomLeft = r >= rows - 2 && c <= 1;
          if (isTopRight || isBottomLeft) {
            blocked.push({ row: r, col: c });
          }
        }
      }
      break;
    }

    case 'butterfly': {
      // Dual wings: cut 4 outer corner pockets
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const isOuterCorner = (r <= 1 || r >= rows - 2) && (c <= 1 || c >= cols - 2);
          if (isOuterCorner) {
            blocked.push({ row: r, col: c });
          }
        }
      }
      break;
    }

    case 'castle': {
      // Battlements on top & bottom
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const isTopGap = r === 0 && (c === 1 || c === cols - 2);
          const isCornerCut = (r === rows - 1) && (c === 0 || c === cols - 1);
          if (isTopGap || isCornerCut) {
            blocked.push({ row: r, col: c });
          }
        }
      }
      break;
    }

    case 'compact': {
      // Rounded 4 corners cut
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const isCorner = (r === 0 || r === rows - 1) && (c === 0 || c === cols - 1);
          if (isCorner) blocked.push({ row: r, col: c });
        }
      }
      break;
    }

    case 't_shape': {
      // T shape: cut top-left and top-right outer corners
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const isCut = r >= 2 && (c <= 1 || c >= cols - 2);
          if (isCut) {
            blocked.push({ row: r, col: c });
          }
        }
      }
      break;
    }

    case 'u_shape': {
      // U shape: cut top center cleft
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const isTopCleft = r <= 1 && Math.abs(c - midC) <= 1;
          if (isTopCleft) {
            blocked.push({ row: r, col: c });
          }
        }
      }
      break;
    }

    case 'zigzag': {
      // S / Zig-zag shape
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const isTopCut = r <= 1 && c >= cols - 2;
          const isBottomCut = r >= rows - 2 && c <= 1;
          if (isTopCut || isBottomCut) {
            blocked.push({ row: r, col: c });
          }
        }
      }
      break;
    }

    case 'rectangle':
    default:
      // Full grid
      break;
  }

  // Safety check: ensure we leave at least 8 available cells
  const totalCells = rows * cols;
  if (totalCells - blocked.length < 8) {
    return { type: 'compact', blockedCells: [{ row: 0, col: 0 }, { row: 0, col: cols - 1 }, { row: rows - 1, col: 0 }, { row: rows - 1, col: cols - 1 }] };
  }

  return { type: shapeType, blockedCells: blocked };
}

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
