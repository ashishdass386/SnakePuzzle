/**
 * AppNavigator — React Navigation native stack setup.
 *
 * Screens:
 *   Splash → Home → Game → LevelComplete
 *                 → LevelSelect → Game
 *                 → Settings
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { SplashScreen } from '../screens/SplashScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { GameScreen } from '../screens/GameScreen';
import { LevelCompleteScreen } from '../screens/LevelCompleteScreen';
import { LevelSelectScreen } from '../screens/LevelSelectScreen';
import { SettingsScreen } from '../screens/SettingsScreen';

// ─── Route Params ─────────────────────────────────────────────────────────────

export type RootStackParamList = {
  Splash: undefined;
  Home: undefined;
  Game: { levelNumber: number };
  LevelComplete: {
    levelNumber: number;
    stars: number;
    coinsEarned: number;
    moveCount: number;
  };
  LevelSelect: undefined;
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

// ─── Navigator ────────────────────────────────────────────────────────────────

export const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
          animation: 'fade',
          contentStyle: { backgroundColor: '#0F0E17' },
        }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen
          name="Game"
          component={GameScreen}
          options={{ animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="LevelComplete"
          component={LevelCompleteScreen}
          options={{ animation: 'fade_from_bottom' }}
        />
        <Stack.Screen
          name="LevelSelect"
          component={LevelSelectScreen}
          options={{ animation: 'slide_from_bottom' }}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{ animation: 'slide_from_bottom' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
