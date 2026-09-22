import { generateLevel } from '../src/game/LevelGenerator';
import { GameEngine } from '../src/game/GameEngine';
import { isSolvable, findHintSnake } from '../src/game/PuzzleSolver';
import { canSnakeExit, getOccupiedCells } from '../src/game/Collision';
import { calculateStars, calculateCoinsEarned, makeLevelProgress } from '../src/utils/helpers';
import { loadProgress, updateLevelProgress, spendCoins } from '../src/storage/GameStorage';
import { Direction } from '../src/game/types';

describe('Snake Puzzle QA Engine Test Suite', () => {
  test('Levels 1 to 50 are all valid, solvable, and do not trigger fallback', () => {
    let fallbackCount = 0;

    for (let lvl = 1; lvl <= 50; lvl++) {
      const config = generateLevel(lvl);

      expect(config.snakes.length).toBeGreaterThanOrEqual(2);
      expect(config.boardSize.rows).toBeGreaterThanOrEqual(4);
      expect(config.boardSize.cols).toBeGreaterThanOrEqual(4);

      if (config.seed === 0) {
        fallbackCount++;
      }

      const engine = new GameEngine(config);
      const state = engine.getState();
      const solvable = isSolvable(state);
      expect(solvable).toBe(true);
    }

    expect(fallbackCount).toBe(0);
  });

  test('Higher tier levels (Hard, Very Hard, Expert) are solvable', () => {
    const testLevels = [55, 75, 120, 260, 520];

    for (const lvl of testLevels) {
      const config = generateLevel(lvl);
      const engine = new GameEngine(config);
      const solvable = isSolvable(engine.getState());
      expect(solvable).toBe(true);
    }
  });

  test('Simulated full playthrough of levels 1 to 20', () => {
    for (let lvl = 1; lvl <= 20; lvl++) {
      const config = generateLevel(lvl);
      const engine = new GameEngine(config);

      let steps = 0;
      const maxSteps = 40;

      while (!engine.isComplete() && steps < maxSteps) {
        steps++;
        const currentSnakes = engine.getState().snakes.filter(s => !s.exited);

        // Verify blocked snakes cannot move
        for (const snake of currentSnakes) {
          if (!canSnakeExit(snake, currentSnakes, config.boardSize)) {
            const res = engine.tapSnake(snake.id);
            expect(res.type).toBe('blocked');
          }
        }

        // Use hint to find a valid move
        const hint = engine.useHint();
        expect(hint.found).toBe(true);
        expect(hint.snakeId).toBeDefined();

        // Tap the valid snake
        const res = engine.tapSnake(hint.snakeId!);
        expect(res.type).toBe('exited');
      }

      expect(engine.isComplete()).toBe(true);

      const state = engine.getState();
      expect(state.moveCount).toBeGreaterThan(0);

      // Verify star calculation
      const stars = calculateStars(state.moveCount, state.hintsUsed, config.snakes.length);
      expect([1, 2, 3]).toContain(stars);

      const coins = calculateCoinsEarned(stars);
      expect(coins).toBeGreaterThanOrEqual(10);

      // Verify restart
      engine.restart(config);
      const restarted = engine.getState();
      expect(restarted.isComplete).toBe(false);
      expect(restarted.moveCount).toBe(0);
      expect(restarted.hintsUsed).toBe(0);
      expect(restarted.snakes.every(s => !s.exited)).toBe(true);
    }
  });

  test('Collision detection correctly blocks snakes moving through obstacles', () => {
    // Construct a specific board layout:
    // Snake 1: at (1, 1), pointing RIGHT, length 2 -> occupies (1, 1) and (1, 0)
    // Snake 2: at (1, 3), pointing UP, length 1 -> occupies (1, 3)
    // Board is 4x4
    const boardSize = { rows: 4, cols: 4 };
    const snake1 = {
      id: 's1',
      cells: [{ row: 1, col: 1 }, { row: 1, col: 0 }],
      direction: Direction.RIGHT,
      colorIndex: 0,
      exited: false,
      length: 2,
    };
    const snake2 = {
      id: 's2',
      cells: [{ row: 1, col: 3 }],
      direction: Direction.UP,
      colorIndex: 1,
      exited: false,
      length: 1,
    };

    // Snake 1 wants to move RIGHT. In front of it is (1, 2) and (1, 3).
    // (1, 3) is occupied by Snake 2! So Snake 1 MUST be blocked!
    expect(canSnakeExit(snake1, [snake1, snake2], boardSize)).toBe(false);

    // Snake 2 wants to move UP. In front of it is (0, 3). Empty!
    // So Snake 2 CAN exit!
    expect(canSnakeExit(snake2, [snake1, snake2], boardSize)).toBe(true);

    // After Snake 2 exits, Snake 1 should now be able to exit!
    expect(canSnakeExit(snake1, [snake1], boardSize)).toBe(true);
  });

  test('Complete gameplay flow: Play -> Move -> Complete -> Save Progress -> Next Level -> Restart', async () => {
    // 1. Initial state
    const initialProgress = await loadProgress();
    expect(initialProgress.highestUnlockedLevel).toBe(1);
    expect(initialProgress.coins).toBeGreaterThan(0);

    // 2. Play Level 1
    const lvl1Config = generateLevel(1);
    const engine1 = new GameEngine(lvl1Config);

    // 3. Play through level 1
    while (!engine1.isComplete()) {
      const active = engine1.getState().snakes.filter(s => !s.exited);
      let moved = false;
      for (const s of active) {
        if (canSnakeExit(s, active, lvl1Config.boardSize)) {
          const res = engine1.tapSnake(s.id);
          expect(res.type).toBe('exited');
          moved = true;
          break;
        }
      }
      expect(moved).toBe(true);
    }
    expect(engine1.isComplete()).toBe(true);

    // 4. Complete Level 1 & Save Progress
    const state1 = engine1.getState();
    const stars1 = calculateStars(state1.moveCount, state1.hintsUsed, lvl1Config.snakes.length);
    const coinsEarned1 = calculateCoinsEarned(stars1);
    const lp1 = makeLevelProgress(state1, stars1);

    const updatedProgress = await updateLevelProgress(1, lp1, coinsEarned1);
    expect(updatedProgress.highestUnlockedLevel).toBe(2);
    expect(updatedProgress.levels['1'].completed).toBe(true);
    expect(updatedProgress.levels['1'].stars).toBe(stars1);
    expect(updatedProgress.coins).toBe(initialProgress.coins + coinsEarned1);

    // 5. Next Level (Level 2)
    const lvl2Config = generateLevel(2);
    const engine2 = new GameEngine(lvl2Config);
    expect(engine2.getState().levelNumber).toBe(2);
    expect(engine2.getState().moveCount).toBe(0);

    // 6. Test Restart on Level 2
    const firstSnake = lvl2Config.snakes[0];
    engine2.tapSnake(firstSnake.id);
    expect(engine2.getState().moveCount).toBe(1);

    engine2.restart(lvl2Config);
    expect(engine2.getState().moveCount).toBe(0);
    expect(engine2.getState().isComplete).toBe(false);
    expect(engine2.getState().snakes.every(s => !s.exited)).toBe(true);
  });
});
