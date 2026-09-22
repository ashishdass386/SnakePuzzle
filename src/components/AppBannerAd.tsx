/**
 * AppBannerAd — reusable Banner Ad component for Google AdMob.
 */

import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import { getBannerAdUnitId } from '../ads/AdManager';

interface AppBannerAdProps {
  size?: any;
}

export const AppBannerAd: React.FC<AppBannerAdProps> = ({ size }) => {
  const [adFailed, setAdFailed] = useState(false);

  if (adFailed) {
    return null;
  }

  const selectedSize = size || BannerAdSize.ANCHORED_ADAPTIVE_BANNER;

  return (
    <View style={styles.container}>
      <BannerAd
        unitId={getBannerAdUnitId()}
        size={selectedSize}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
        onAdLoaded={() => {
          console.log('[BannerAd] Loaded successfully');
        }}
        onAdFailedToLoad={(error: any) => {
          console.log('[BannerAd] Failed to load:', error);
          setAdFailed(true);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    backgroundColor: 'transparent',
    overflow: 'hidden',
    minHeight: 50,
  },
});
