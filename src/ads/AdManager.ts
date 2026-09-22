/**
 * AdManager — Google AdMob integration for Interstitial and Banner ads.
 */

import { Platform } from 'react-native';
import mobileAds, {
  InterstitialAd,
  AdEventType,
  TestIds,
} from 'react-native-google-mobile-ads';
import { ADMOB_CONFIG } from '../utils/constants';

let interstitialAd: InterstitialAd | null = null;
let isInterstitialLoaded = false;
let isInterstitialLoading = false;
let adInitialized = false;

export function getInterstitialAdUnitId(): string {
  return Platform.OS === 'android'
    ? ADMOB_CONFIG.INTERSTITIAL_ANDROID
    : ADMOB_CONFIG.INTERSTITIAL_IOS;
}

export function getBannerAdUnitId(): string {
  return Platform.OS === 'android'
    ? ADMOB_CONFIG.BANNER_ANDROID
    : ADMOB_CONFIG.BANNER_IOS;
}

export async function initAdMob(): Promise<void> {
  if (adInitialized) return;
  try {
    console.log('[AdManager] Initializing Google Mobile Ads SDK...');
    const adapterStatuses = await mobileAds().initialize();
    console.log('[AdManager] AdMob initialized:', adapterStatuses);
    adInitialized = true;
    loadInterstitialAd();
  } catch (e) {
    console.log('[AdManager] initAdMob error:', e);
  }
}

export function loadInterstitialAd(): void {
  if (isInterstitialLoaded || isInterstitialLoading) return;

  const adUnitId = getInterstitialAdUnitId();
  try {
    console.log('[AdManager] Loading Interstitial Ad for unit:', adUnitId);
    isInterstitialLoading = true;
    interstitialAd = InterstitialAd.createForAdRequest(adUnitId, {
      requestNonPersonalizedAdsOnly: true,
    });

    const unsubscribeLoaded = interstitialAd.addAdEventListener(
      AdEventType.LOADED,
      () => {
        console.log('[AdManager] Interstitial Ad Loaded successfully');
        isInterstitialLoaded = true;
        isInterstitialLoading = false;
        unsubscribeLoaded();
      },
    );

    const unsubscribeError = interstitialAd.addAdEventListener(
      AdEventType.ERROR,
      (error: any) => {
        console.log('[AdManager] Interstitial error:', error);
        isInterstitialLoaded = false;
        isInterstitialLoading = false;
        unsubscribeError();
      },
    );

    interstitialAd.load();
  } catch (e) {
    console.log('[AdManager] Failed to create interstitial:', e);
    isInterstitialLoading = false;
  }
}

/**
 * Show interstitial ad if ready, then execute callback on dismiss/error.
 * Immediately begins preloading the next interstitial.
 */
export async function showInterstitialAd(onDismiss?: () => void): Promise<void> {
  if (interstitialAd && isInterstitialLoaded) {
    let dismissed = false;

    const handleClose = () => {
      if (!dismissed) {
        dismissed = true;
        isInterstitialLoaded = false;
        loadInterstitialAd();
        onDismiss?.();
      }
    };

    const unsubscribeClosed = interstitialAd.addAdEventListener(
      AdEventType.CLOSED,
      () => {
        console.log('[AdManager] Interstitial Ad Closed');
        unsubscribeClosed();
        handleClose();
      },
    );

    const unsubscribeError = interstitialAd.addAdEventListener(
      AdEventType.ERROR,
      (err: any) => {
        console.log('[AdManager] Interstitial Ad show error event:', err);
        unsubscribeError();
        handleClose();
      },
    );

    try {
      console.log('[AdManager] Showing Interstitial Ad...');
      await interstitialAd.show();
    } catch (e) {
      console.log('[AdManager] Error during interstitial show:', e);
      handleClose();
    }
  } else {
    console.log('[AdManager] Interstitial not ready yet, continuing flow. Loaded:', isInterstitialLoaded, 'Loading:', isInterstitialLoading);
    loadInterstitialAd();
    onDismiss?.();
  }
}
