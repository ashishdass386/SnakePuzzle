/**
 * AudioManager — abstraction over react-native-sound.
 *
 * All sounds go through this module so the game logic
 * is never directly coupled to audio APIs.
 *
 * Sound files should be placed in android/app/src/main/res/raw/
 * and ios/SnakePuzzle/  with the same base names.
 */

import Sound from 'react-native-sound';

if (Sound && typeof Sound.setCategory === 'function') {
  try {
    Sound.setCategory('Ambient');
  } catch {
    // Safely ignore on environments without audio session support
  }
}

// ─── Sound IDs ────────────────────────────────────────────────────────────────

export type SoundId = 'tap' | 'exit' | 'blocked' | 'complete' | 'button' | 'hint';

const SOUND_FILES: Record<SoundId, string> = {
  tap: 'sound_tap.mp3',
  exit: 'sound_exit.mp3',
  blocked: 'sound_blocked.mp3',
  complete: 'sound_complete.mp3',
  button: 'sound_button.mp3',
  hint: 'sound_hint.mp3',
};

// ─── State ────────────────────────────────────────────────────────────────────

let soundEnabled = true;
let loadedSounds: Partial<Record<SoundId, Sound>> = {};

// ─── Init ─────────────────────────────────────────────────────────────────────

export function initAudio(): void {
  (Object.keys(SOUND_FILES) as SoundId[]).forEach(id => {
    const sound = new Sound(SOUND_FILES[id], Sound.MAIN_BUNDLE, err => {
      if (err) {
        // Sound file missing — silently fail (not blocking for gameplay)
        console.warn(`[Audio] Could not load ${SOUND_FILES[id]}:`, err);
        return;
      }
      loadedSounds[id] = sound;
    });
  });
}

// ─── Playback ─────────────────────────────────────────────────────────────────

export function playSound(id: SoundId): void {
  if (!soundEnabled) return;
  const sound = loadedSounds[id];
  if (!sound) return;
  sound.stop(() => {
    sound.play(success => {
      if (!success) console.warn(`[Audio] Playback failed for ${id}`);
    });
  });
}

// ─── Settings ─────────────────────────────────────────────────────────────────

export function setSoundEnabled(enabled: boolean): void {
  soundEnabled = enabled;
}

export function isSoundEnabled(): boolean {
  return soundEnabled;
}

export function releaseAudio(): void {
  (Object.values(loadedSounds) as Sound[]).forEach(s => s.release());
  loadedSounds = {};
}
