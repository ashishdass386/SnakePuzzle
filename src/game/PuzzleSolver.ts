/**
 * PuzzleSolver — validates that every generated level is solvable.
 *
 * Algorithm: DFS over snake-removal sequences with state memoization.
 */

import { GameState, SnakePiece, BoardSize } from './types';
import { canSnakeExit } from './Collision';

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Returns true if there exists at least one ordering of snake removals
 * that allows all snakes to exit the board.
 */
export function isSolvable(state: GameState, maxDepth: number = 200): boolean {
  const remainingIds = state.snakes
    .filter(s => !s.exited)
    .map(s => s.id);

  const visited = new Set<string>();
  const counter = { evaluations: 0, maxEvaluations: 3000 };

  return dfs(
    remainingIds,
    state.snakes,
    state.boardSize,
    visited,
    counter,
    maxDepth,
  );
}

// ─── DFS Core ─────────────────────────────────────────────────────────────────

function dfs(
  remaining: string[],
  allSnakes: SnakePiece[],
  boardSize: BoardSize,
  visited: Set<string>,
  counter: { evaluations: number; maxEvaluations: number },
  depthLeft: number,
): boolean {
  // Base: all snakes removed → solved
  if (remaining.length === 0) return true;
  if (depthLeft <= 0) return false;
  if (counter.evaluations++ > counter.maxEvaluations) return false;

  // Create a state key (sorted IDs to canonicalize)
  const stateKey = [...remaining].sort().join('|');
  if (visited.has(stateKey)) return false;
  visited.add(stateKey);

  // Current "live" snakes
  const liveSnakes = allSnakes.filter(s => remaining.includes(s.id));

  // Try removing each remaining snake (reverse order first as it aligns with construction)
  for (let i = remaining.length - 1; i >= 0; i--) {
    const candidateId = remaining[i];
    const candidate = liveSnakes.find(s => s.id === candidateId);
    if (!candidate) continue;

    if (canSnakeExit(candidate, liveSnakes, boardSize)) {
      const nextRemaining = remaining.filter(id => id !== candidateId);
      if (dfs(nextRemaining, allSnakes, boardSize, visited, counter, depthLeft - 1)) {
        return true;
      }
    }
  }

  return false;
}

// ─── Hint Finder ──────────────────────────────────────────────────────────────

/**
 * Finds a snake that can currently exit the board.
 * Used by the hint system.
 */
export function findHintSnake(state: GameState): string | null {
  const activeSnakes = state.snakes.filter(s => !s.exited);

  for (const snake of activeSnakes) {
    if (canSnakeExit(snake, activeSnakes, state.boardSize)) {
      return snake.id;
    }
  }
  return null;
}
