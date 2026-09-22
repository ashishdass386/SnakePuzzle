import { generateLevel } from '../src/game/LevelGenerator';
import { GameEngine } from '../src/game/GameEngine';
import { isSolvable, findHintSnake } from '../src/game/PuzzleSolver';
import { canSnakeExit, getOccupiedCells } from '../src/game/Collision';
import { calculateStars, makeLevelProgress } from '../src/utils/helpers';
import { loadProgress, updateLevelProgress } from '../src/storage/GameStorage';
import { Direction } from '../src/game/types';
import { getBoardTheme } from '../src/utils/themes';

describe('Snake Puzzle QA Engine Test Suite', () => {
  test('Dense Level Generation: Levels 1 to 50 are packed, solvable, and have rich themes', () => {
    let fallbackCount = 0;

    for (let lvl = 1; lvl <= 50; lvl++) {
      const config = generateLevel(lvl);

      expect(config.snakes.length).toBeGreaterThanOrEqual(3);
      expect(config.boardSize.rows).toBeGreaterThanOrEqual(4);
      expect(config.boardSize.cols).toBeGreaterThanOrEqual(4);
      expect(config.theme).toBeDefined();
      expect(config.theme?.name).toBeDefined();

      // Density calculation
      const totalCells = config.boardSize.rows * config.boardSize.cols;
      const blockedCount = config.boardSize.blockedCells?.length ?? 0;
      const availableCells = totalCells - blockedCount;
      const snakeCells = config.snakes.reduce((acc, s) => acc + s.cells.length, 0);
      const density = snakeCells / availableCells;

      // Board is densely packed with snakes!
      expect(density).toBeGreaterThanOrEqual(0.55);

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

  test('Dynamic Board Theme Progression: themes evolve every 10 levels', () => {
    const themeLvl1 = getBoardTheme(1);
    const themeLvl11 = getBoardTheme(11);
    const themeLvl21 = getBoardTheme(21);
    const themeLvl31 = getBoardTheme(31);
    const themeLvl41 = getBoardTheme(41);
    const themeLvl51 = getBoardTheme(51);

    expect(themeLvl1.name).toBe('CYBER NEON');
    expect(themeLvl11.name).toBe('JUNGLE RUINS');
    expect(themeLvl21.name).toBe('MAGMA FORGE');
    expect(themeLvl31.name).toBe('OCEAN ABYSS');
    expect(themeLvl41.name).toBe('GOLDEN PHARAOH');
    expect(themeLvl51.name).toBe('COSMIC STATION');

    expect(themeLvl1.id).not.toEqual(themeLvl11.id);
    expect(themeLvl11.id).not.toEqual(themeLvl21.id);
  });

  test('Higher tier dense levels (Hard, Very Hard, Expert) are solvable', () => {
    const testLevels = [55, 75, 120, 260, 520];

    for (const lvl of testLevels) {
      const config = generateLevel(lvl);
      const engine = new GameEngine(config);
      const solvable = isSolvable(engine.getState());
      expect(solvable).toBe(true);
    }
  });

  test('Simulated full playthrough of dense levels 1 to 15', () => {
    for (let lvl = 1; lvl <= 15; lvl++) {
      const config = generateLevel(lvl);
      const engine = new GameEngine(config);

      let steps = 0;
      const maxSteps = 50;

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

      // Verify restart
      engine.restart(config);
      const restarted = engine.getState();
      expect(restarted.isComplete).toBe(false);
      expect(restarted.moveCount).toBe(0);
      expect(restarted.hintsUsed).toBe(0);
      expect(restarted.snakes.every(s => !s.exited)).toBe(true);
    }
  });

  test('Collision detection correctly blocks snakes with obstacles/blocked cells', () => {
    const boardSize = {
      rows: 4,
      cols: 4,
      blockedCells: [{ row: 0, col: 2 }],
    };

    // Snake at (1, 2) pointing UP. Directly in front is (0, 2) which is a BLOCKED OBSTACLE!
    const snakeBlockedByWall = {
      id: 's_wall',
      cells: [{ row: 1, col: 2 }],
      direction: Direction.UP,
      colorIndex: 0,
      exited: false,
      length: 1,
    };

    // Snake at (1, 0) pointing UP. Directly in front is (0, 0) which is empty!
    const snakeFree = {
      id: 's_free',
      cells: [{ row: 1, col: 0 }],
      direction: Direction.UP,
      colorIndex: 1,
      exited: false,
      length: 1,
    };

    expect(canSnakeExit(snakeBlockedByWall, [snakeBlockedByWall, snakeFree], boardSize)).toBe(false);
    expect(canSnakeExit(snakeFree, [snakeBlockedByWall, snakeFree], boardSize)).toBe(true);
  });

  test('Complete gameplay flow: Play -> Move -> Complete -> Save Progress -> Next Level -> Restart', async () => {
    // 1. Initial state
    const initialProgress = await loadProgress();
    expect(initialProgress.highestUnlockedLevel).toBe(1);

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
    const lp1 = makeLevelProgress(state1, stars1);

    const updatedProgress = await updateLevelProgress(1, lp1);
    expect(updatedProgress.highestUnlockedLevel).toBe(2);
    expect(updatedProgress.levels['1'].completed).toBe(true);
    expect(updatedProgress.levels['1'].stars).toBe(stars1);

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
