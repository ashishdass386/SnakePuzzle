/**
 * AudioManager
 *
 * Temporary audio implementation.
 * Sound can be added later without changing game logic.
 */

export type SoundId =
  | 'tap'
  | 'exit'
  | 'blocked'
  | 'complete'
  | 'button'
  | 'hint';

let soundEnabled = true;

export function initAudio(): void {
  // Audio disabled temporarily
}

export function playSound(_id: SoundId): void {
  // Audio disabled temporarily
}

export function setSoundEnabled(enabled: boolean): void {
  soundEnabled = enabled;
}

export function isSoundEnabled(): boolean {
  return soundEnabled;
}

export function releaseAudio(): void {
  // Nothing to release
}