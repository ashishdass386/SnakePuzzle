/**
 * AdManager — placeholder AdMob integration architecture.
 *
 * Replace placeholder IDs in constants.ts with real AdMob unit IDs
 * and install react-native-google-mobile-ads before enabling real ads.
 *
 * This file isolates all ad logic from the game engine.
 */

import { Platform } from 'react-native';
import { ADMOB_CONFIG } from '../utils/constants';

// ─── Simulated Ad State ───────────────────────────────────────────────────────
// In production, replace with actual react-native-google-mobile-ads calls.

let interstitialLevelCount = 0;
let adsEnabled = false; // Set to true when real ads are integrated

// ─── Ad Unit IDs ─────────────────────────────────────────────────────────────

export function getInterstitialAdUnitId(): string {
  return Platform.OS === 'android'
    ? ADMOB_CONFIG.INTERSTITIAL_ANDROID
    : ADMOB_CONFIG.INTERSTITIAL_IOS;
}

export function getRewardedAdUnitId(): string {
  return Platform.OS === 'android'
    ? ADMOB_CONFIG.REWARDED_ANDROID
    : ADMOB_CONFIG.REWARDED_IOS;
}

// ─── Interstitial Ad ─────────────────────────────────────────────────────────

/**
 * Call this when a level is completed.
 * Shows an interstitial every N levels.
 */
export async function onLevelComplete(): Promise<void> {
  interstitialLevelCount++;
  if (!adsEnabled) return;

  if (interstitialLevelCount % ADMOB_CONFIG.SHOW_INTERSTITIAL_EVERY_N_LEVELS === 0) {
    await showInterstitialAd();
  }
}

async function showInterstitialAd(): Promise<void> {
  console.log('[AdManager] Would show interstitial ad here');
  // TODO: Implement with react-native-google-mobile-ads:
  //
  // import { InterstitialAd, AdEventType, TestIds } from 'react-native-google-mobile-ads';
  // const ad = InterstitialAd.createForAdRequest(getInterstitialAdUnitId());
  // const unsubscribe = ad.addAdEventListener(AdEventType.LOADED, () => ad.show());
  // ad.load();
}

// ─── Rewarded Ad ─────────────────────────────────────────────────────────────

/**
 * Shows a rewarded ad.
 * @param onReward  Called when the user earns the reward.
 */
export async function showRewardedAd(onReward: () => void): Promise<void> {
  if (!adsEnabled) {
    // In dev mode, just give the reward
    onReward();
    return;
  }

  console.log('[AdManager] Would show rewarded ad here');
  // TODO: Implement with react-native-google-mobile-ads:
  //
  // import { RewardedAd, RewardedAdEventType } from 'react-native-google-mobile-ads';
  // const ad = RewardedAd.createForAdRequest(getRewardedAdUnitId());
  // ad.addAdEventListener(RewardedAdEventType.EARNED_REWARD, () => onReward());
  // ad.addAdEventListener(RewardedAdEventType.LOADED, () => ad.show());
  // ad.load();
}

// ─── Config ───────────────────────────────────────────────────────────────────

export function setAdsEnabled(enabled: boolean): void {
  adsEnabled = enabled;
}
