/**
 * Snake Puzzle — Root App Component
 *
 * Sets up:
 * - GestureHandlerRootView (required for react-native-gesture-handler)
 * - SafeAreaProvider
 * - AppNavigator (React Navigation)
 */

import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './src/navigation/AppNavigator';
import { initAdMob } from './src/ads/AdManager';

function App(): React.JSX.Element {
  useEffect(() => {
    initAdMob();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar barStyle="light-content" />
        <AppNavigator />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default App;
