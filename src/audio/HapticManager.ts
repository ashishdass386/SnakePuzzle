/**
 * HapticManager — abstraction over react-native-haptic-feedback.
 */

import ReactNativeHapticFeedback, {
  HapticFeedbackTypes,
} from 'react-native-haptic-feedback';

export type HapticType = 'light' | 'medium' | 'heavy' | 'success' | 'error';

let hapticsEnabled = true;

const HAPTIC_MAP: Record<HapticType, any> = {
  light: typeof HapticFeedbackTypes !== 'undefined' ? HapticFeedbackTypes.impactLight : 'impactLight',
  medium: typeof HapticFeedbackTypes !== 'undefined' ? HapticFeedbackTypes.impactMedium : 'impactMedium',
  heavy: typeof HapticFeedbackTypes !== 'undefined' ? HapticFeedbackTypes.impactHeavy : 'impactHeavy',
  success: typeof HapticFeedbackTypes !== 'undefined' ? HapticFeedbackTypes.notificationSuccess : 'notificationSuccess',
  error: typeof HapticFeedbackTypes !== 'undefined' ? HapticFeedbackTypes.notificationError : 'notificationError',
};

const OPTIONS = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};

export function triggerHaptic(type: HapticType): void {
  if (!hapticsEnabled) return;
  try {
    ReactNativeHapticFeedback.trigger(HAPTIC_MAP[type], OPTIONS);
  } catch {
    // Silently fail — haptics are non-critical
  }
}

export function setHapticsEnabled(enabled: boolean): void {
  hapticsEnabled = enabled;
}

export function isHapticsEnabled(): boolean {
  return hapticsEnabled;
}
