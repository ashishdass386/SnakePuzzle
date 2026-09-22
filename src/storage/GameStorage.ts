/**
 * GameStorage — AsyncStorage wrapper for persisting game state.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { GameProgress, GameSettings, LevelProgress } from '../game/types';
import { INITIAL_LEVEL } from '../utils/constants';

// ─── Storage Keys ─────────────────────────────────────────────────────────────

const KEYS = {
  PROGRESS: '@SnakePuzzle:progress',
  SETTINGS: '@SnakePuzzle:settings',
};

// ─── Defaults ─────────────────────────────────────────────────────────────────

const DEFAULT_PROGRESS: GameProgress = {
  highestUnlockedLevel: INITIAL_LEVEL,
  levels: {},
};

const DEFAULT_SETTINGS: GameSettings = {
  soundEnabled: true,
  musicEnabled: true,
  hapticsEnabled: true,
};

// ─── Progress ─────────────────────────────────────────────────────────────────

export async function loadProgress(): Promise<GameProgress> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.PROGRESS);
    if (!raw) return DEFAULT_PROGRESS;
    return { ...DEFAULT_PROGRESS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_PROGRESS;
  }
}

export async function saveProgress(progress: GameProgress): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.PROGRESS, JSON.stringify(progress));
  } catch (e) {
    console.warn('Failed to save progress:', e);
  }
}

export async function updateLevelProgress(
  levelNumber: number,
  levelProgress: LevelProgress,
): Promise<GameProgress> {
  const current = await loadProgress();
  const key = String(levelNumber);
  const existing = current.levels[key];

  // Only update if this is a better result
  const updated: LevelProgress = existing
    ? {
        ...levelProgress,
        stars: Math.max(existing.stars, levelProgress.stars),
        bestMoves: Math.min(existing.bestMoves, levelProgress.bestMoves),
      }
    : levelProgress;

  const next: GameProgress = {
    ...current,
    highestUnlockedLevel: Math.max(
      current.highestUnlockedLevel,
      levelNumber + 1,
    ),
    levels: { ...current.levels, [key]: updated },
  };

  await saveProgress(next);
  return next;
}

// ─── Settings ─────────────────────────────────────────────────────────────────

export async function loadSettings(): Promise<GameSettings> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.SETTINGS);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function saveSettings(settings: GameSettings): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.warn('Failed to save settings:', e);
  }
}
