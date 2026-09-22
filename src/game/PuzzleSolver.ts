/**
 * PuzzleSolver — validates that every generated level is solvable.
 *
 * Algorithm: BFS over the space of possible snake-removal orders.
 * State = frozenset of remaining snake IDs.
 * At each state, try to exit each remaining snake.
 * If a snake can exit (given the current remaining snakes), recurse.
 * Success = all snakes removed.
 * Memoize visited states to avoid exponential blowup.
 *
 * Complexity: O(n! / k) in worst case but with memoization
 * it's much more tractable for n ≤ 8 snakes.
 */

import { GameState, SnakePiece } from './types';
import { canSnakeExit } from './Collision';

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Returns true if there exists at least one ordering of snake removals
 * that allows all snakes to exit the board.
 *
 * @param state  The current game state (snakes + board size)
 * @param maxDepth  Maximum recursion depth (safety limit)
 */
export function isSolvable(state: GameState, maxDepth: number = 40): boolean {
  const remainingIds = state.snakes
    .filter(s => !s.exited)
    .map(s => s.id);

  const visited = new Set<string>();

  return dfs(
    remainingIds,
    state.snakes,
    state.boardSize,
    visited,
    maxDepth,
  );
}

// ─── DFS Core ─────────────────────────────────────────────────────────────────

function dfs(
  remaining: string[],
  allSnakes: SnakePiece[],
  boardSize: { rows: number; cols: number },
  visited: Set<string>,
  depthLeft: number,
): boolean {
  // Base: all snakes removed → solved
  if (remaining.length === 0) return true;
  // Depth limit exceeded
  if (depthLeft <= 0) return false;

  // Create a state key (sorted IDs to canonicalize)
  const stateKey = [...remaining].sort().join('|');
  if (visited.has(stateKey)) return false;
  visited.add(stateKey);

  // Current "live" snakes = all snakes that haven't exited yet
  const liveSnakes = allSnakes.filter(s => remaining.includes(s.id));

  // Try removing each remaining snake
  for (const candidateId of remaining) {
    const candidate = liveSnakes.find(s => s.id === candidateId)!;

    if (canSnakeExit(candidate, liveSnakes, boardSize)) {
      // Simulate removal: recurse without this snake
      const nextRemaining = remaining.filter(id => id !== candidateId);
      if (dfs(nextRemaining, allSnakes, boardSize, visited, depthLeft - 1)) {
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
 *
 * Returns the snake ID or null if none can move.
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
