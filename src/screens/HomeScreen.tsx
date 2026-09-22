/**
 * HomeScreen — main menu with Play, Levels, Settings.
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { THEME } from '../utils/constants';
import { loadProgress } from '../storage/GameStorage';
import { GameButton } from '../components/GameButton';
import { AppBannerAd } from '../components/AppBannerAd';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const { width } = Dimensions.get('window');

export const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [highestLevel, setHighestLevel] = useState(1);
  const insets = useSafeAreaInsets();
  const topInset = Math.max(insets.top, Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) : 12);
  const bottomInset = Math.max(insets.bottom, 16);

  const titleY = useSharedValue(-50);
  const titleOpacity = useSharedValue(0);
  const buttonsY = useSharedValue(60);
  const buttonsOpacity = useSharedValue(0);

  useEffect(() => {
    loadProgress().then(p => {
      setHighestLevel(p.highestUnlockedLevel);
    });

    const unsubscribe = navigation.addListener('focus', () => {
      loadProgress().then(p => {
        setHighestLevel(p.highestUnlockedLevel);
      });
    });

    // Entrance animations
    titleY.value = withSpring(0, { damping: 15 });
    titleOpacity.value = withTiming(1, { duration: 400 });
    buttonsY.value = withDelay(200, withSpring(0, { damping: 14 }));
    buttonsOpacity.value = withDelay(200, withTiming(1, { duration: 400 }));

    return unsubscribe;
  }, [navigation]);

  const titleStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: titleY.value }],
    opacity: titleOpacity.value,
  }));

  const buttonsStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: buttonsY.value }],
    opacity: buttonsOpacity.value,
  }));

  return (
    <View style={[styles.container, { paddingBottom: bottomInset }]}>
      <StatusBar barStyle="light-content" />

      {/* Decorative background element */}
      <View style={styles.bgCircle1} />
      <View style={styles.bgCircle2} />

      {/* Main Content */}
      <View style={styles.mainContent}>
        {/* Logo / Title */}
        <Animated.View style={[styles.titleSection, titleStyle]}>
          <View style={styles.snakeMiniLogo}>
            <View style={[styles.miniDot, { backgroundColor: '#FF6B6B' }]} />
            <View style={[styles.miniDot, { backgroundColor: '#4ECDC4', width: 18, height: 18 }]} />
            <View style={[styles.miniHead]} />
          </View>
          <Text style={styles.title}>SNAKE</Text>
          <Text style={styles.titleAccent}>PUZZLE</Text>
          <Text style={styles.tagline}>Tap · Slide · Escape</Text>
        </Animated.View>

        {/* Buttons */}
        <Animated.View style={[styles.buttonSection, buttonsStyle]}>
          <GameButton
            testID="btn-play"
            label="▶  PLAY"
            onPress={() => navigation.navigate('Game', { levelNumber: highestLevel })}
            variant="primary"
            size="lg"
            style={styles.playButton}
          />

          <View style={styles.secondaryRow}>
            <GameButton
              testID="btn-levels"
              label="📋  LEVELS"
              onPress={() => navigation.navigate('LevelSelect')}
              variant="secondary"
              size="md"
              style={styles.halfButton}
            />
            <GameButton
              testID="btn-settings"
              label="⚙️  SETTINGS"
              onPress={() => navigation.navigate('Settings')}
              variant="secondary"
              size="md"
              style={styles.halfButton}
            />
          </View>
        </Animated.View>
      </View>

      {/* Banner Ad */}
      <AppBannerAd />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.background,
    paddingHorizontal: 24,
  },
  mainContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  bgCircle1: {
    position: 'absolute',
    width: width,
    height: width,
    borderRadius: width / 2,
    backgroundColor: THEME.primary,
    opacity: 0.05,
    top: -width * 0.35,
    left: -width * 0.2,
  },
  bgCircle2: {
    position: 'absolute',
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: width * 0.35,
    backgroundColor: THEME.accent,
    opacity: 0.04,
    bottom: -width * 0.2,
    right: -width * 0.15,
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: 60,
  },
  snakeMiniLogo: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 4,
    marginBottom: 20,
  },
  miniDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#FF6B6B',
  },
  miniHead: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderTopRightRadius: 6,
    backgroundColor: THEME.primaryLight,
  },
  title: {
    fontSize: 52,
    fontWeight: '900',
    color: THEME.text,
    letterSpacing: 10,
    lineHeight: 56,
  },
  titleAccent: {
    fontSize: 52,
    fontWeight: '900',
    color: THEME.primaryLight,
    letterSpacing: 10,
    lineHeight: 56,
  },
  tagline: {
    fontSize: 13,
    color: THEME.textMuted,
    letterSpacing: 3,
    marginTop: 12,
    fontWeight: '500',
  },
  buttonSection: {
    width: '100%',
    alignItems: 'center',
    gap: 12,
  },
  playButton: {
    width: '100%',
    paddingVertical: 20,
  },
  secondaryRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  halfButton: {
    flex: 1,
  },
  footer: {
    position: 'absolute',
    bottom: 24,
    color: THEME.textMuted,
    fontSize: 12,
    letterSpacing: 1,
  },
});
