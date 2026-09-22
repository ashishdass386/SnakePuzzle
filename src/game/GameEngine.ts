/**
 * GameEngine — core game logic, independent of React/UI.
 *
 * Manages board state, snake movement, tap handling,
 * hint system, and level completion detection.
 */

import { GameState, SnakePiece, TapResult, HintResult, LevelConfig } from './types';
import { canSnakeExit } from './Collision';
import { findHintSnake } from './PuzzleSolver';

// ─── GameEngine Class ─────────────────────────────────────────────────────────

export class GameEngine {
  private state: GameState;

  constructor(config: LevelConfig) {
    this.state = GameEngine.stateFromConfig(config);
  }

  // ─── State Access ──────────────────────────────────────────────────────────

  getState(): GameState {
    // Return a shallow copy so React can detect changes
    return {
      ...this.state,
      snakes: this.state.snakes.map(s => ({ ...s, cells: [...s.cells] })),
    };
  }

  // ─── Tap Handling ──────────────────────────────────────────────────────────

  /**
   * Called when the player taps a snake.
   * Returns a TapResult describing what happened.
   */
  tapSnake(snakeId: string): TapResult {
    const snake = this.state.snakes.find(s => s.id === snakeId);

    if (!snake) {
      return { type: 'blocked', snakeId, levelComplete: false };
    }

    if (snake.exited) {
      return { type: 'already_exited', snakeId, levelComplete: false };
    }

    const activeSnakes = this.state.snakes.filter(s => !s.exited);

    if (canSnakeExit(snake, activeSnakes, this.state.boardSize)) {
      // Mark snake as exited
      this.state = {
        ...this.state,
        moveCount: this.state.moveCount + 1,
        snakes: this.state.snakes.map(s =>
          s.id === snakeId ? { ...s, exited: true } : s,
        ),
      };

      const levelComplete = this.state.snakes.every(s => s.exited);

      if (levelComplete) {
        this.state = { ...this.state, isComplete: true };
      }

      return { type: 'exited', snakeId, levelComplete };
    } else {
      // Blocked — increment move count anyway (so hints affect stars)
      this.state = {
        ...this.state,
        moveCount: this.state.moveCount + 1,
      };
      return { type: 'blocked', snakeId, levelComplete: false };
    }
  }

  // ─── Hint ──────────────────────────────────────────────────────────────────

  /**
   * Finds a snake that can currently exit.
   * The UI should highlight this snake.
   */
  useHint(): HintResult {
    const snakeId = findHintSnake(this.state);
    if (snakeId) {
      this.state = { ...this.state, hintsUsed: this.state.hintsUsed + 1 };
      return { found: true, snakeId };
    }
    return { found: false };
  }

  // ─── Restart ───────────────────────────────────────────────────────────────

  /**
   * Resets the board to the original level state.
   */
  restart(config: LevelConfig): void {
    this.state = GameEngine.stateFromConfig(config);
  }

  // ─── Level Completion ──────────────────────────────────────────────────────

  isComplete(): boolean {
    return this.state.isComplete;
  }

  getMoveCount(): number {
    return this.state.moveCount;
  }

  getHintsUsed(): number {
    return this.state.hintsUsed;
  }

  getElapsedSeconds(): number {
    return Math.floor((Date.now() - this.state.startTime) / 1000);
  }

  // ─── Private Helpers ───────────────────────────────────────────────────────

  private static stateFromConfig(config: LevelConfig): GameState {
    return {
      snakes: config.snakes.map(s => ({ ...s, exited: false, cells: [...s.cells] })),
      boardSize: config.boardSize,
      levelNumber: config.levelNumber,
      moveCount: 0,
      hintsUsed: 0,
      startTime: Date.now(),
      isComplete: false,
    };
  }
}
