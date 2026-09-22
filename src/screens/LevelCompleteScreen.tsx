/**
 * LevelCompleteScreen — shown after successfully clearing all snakes.
 * Shows stars, coins earned, and a Next Level button.
 */

import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { THEME } from '../utils/constants';
import { GameButton } from '../components/GameButton';

type Props = NativeStackScreenProps<RootStackParamList, 'LevelComplete'>;

// ─── Star Item ────────────────────────────────────────────────────────────────

interface StarProps {
  index: number;
  earned: boolean;
  delay: number;
}

const StarItem: React.FC<StarProps> = ({ earned, delay }) => {
  const scale = useSharedValue(0);

  useEffect(() => {
    scale.value = withDelay(
      delay,
      withSequence(
        withSpring(1.3, { damping: 10, stiffness: 200 }),
        withSpring(1, { damping: 12 }),
      ),
    );
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.Text
      style={[styles.star, !earned && styles.starEmpty, animStyle]}
    >
      ⭐
    </Animated.Text>
  );
};

// ─── Component ────────────────────────────────────────────────────────────────

export const LevelCompleteScreen: React.FC<Props> = ({ route, navigation }) => {
  const { levelNumber, stars, coinsEarned, moveCount } = route.params;

  const containerScale = useSharedValue(0.7);
  const containerOpacity = useSharedValue(0);
  const coinScale = useSharedValue(0);
  const coinOpacity = useSharedValue(0);

  useEffect(() => {
    containerScale.value = withSpring(1, { damping: 14, stiffness: 140 });
    containerOpacity.value = withTiming(1, { duration: 300 });

    coinScale.value = withDelay(900, withSpring(1, { damping: 12 }));
    coinOpacity.value = withDelay(900, withTiming(1, { duration: 300 }));
  }, []);

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: containerScale.value }],
    opacity: containerOpacity.value,
  }));

  const coinStyle = useAnimatedStyle(() => ({
    transform: [{ scale: coinScale.value }],
    opacity: coinOpacity.value,
  }));

  const handleNextLevel = () => {
    navigation.replace('Game', { levelNumber: levelNumber + 1 });
  };

  const handleHome = () => {
    navigation.navigate('Home');
  };

  const STAR_DELAYS = [300, 550, 800];

  return (
    <View style={styles.overlay}>
      <Animated.View style={[styles.card, containerStyle]}>
        {/* Header */}
        <Text style={styles.emoji}>🎉</Text>
        <Text style={styles.title}>LEVEL COMPLETE!</Text>
        <Text style={styles.subtitle}>Level {levelNumber}</Text>

        {/* Stars — using a sub-component to avoid hooks-in-loops */}
        <View style={styles.starsRow}>
          {[0, 1, 2].map(i => (
            <StarItem
              key={i}
              index={i}
              earned={i < stars}
              delay={STAR_DELAYS[i]}
            />
          ))}
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{moveCount}</Text>
            <Text style={styles.statLabel}>Moves</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{stars}/3</Text>
            <Text style={styles.statLabel}>Stars</Text>
          </View>
        </View>

        {/* Coins earned */}
        <Animated.View style={[styles.coinsEarned, coinStyle]}>
          <Text style={styles.coinsText}>+{coinsEarned}</Text>
          <Text style={styles.coinsIcon}>🪙</Text>
        </Animated.View>

        {/* Buttons */}
        <View style={styles.buttons}>
          <GameButton
            testID="btn-next-level"
            label="NEXT LEVEL →"
            onPress={handleNextLevel}
            variant="primary"
            size="lg"
            style={styles.nextBtn}
          />
          <GameButton
            testID="btn-home"
            label="🏠 Home"
            onPress={handleHome}
            variant="ghost"
            size="sm"
          />
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 14, 23, 0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: THEME.surfaceElevated,
    borderRadius: 28,
    padding: 32,
    alignItems: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: THEME.border,
    shadowColor: THEME.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 30,
    elevation: 20,
  },
  emoji: {
    fontSize: 52,
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: THEME.text,
    letterSpacing: 2,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: THEME.textMuted,
    marginBottom: 24,
    letterSpacing: 1,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
  },
  star: {
    fontSize: 44,
  },
  starEmpty: {
    opacity: 0.2,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: THEME.surface,
    borderRadius: 16,
    padding: 16,
    width: '100%',
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    color: THEME.text,
  },
  statLabel: {
    fontSize: 12,
    color: THEME.textMuted,
    marginTop: 2,
    letterSpacing: 1,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: THEME.border,
  },
  coinsEarned: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: `${THEME.accentWarm}22`,
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: `${THEME.accentWarm}44`,
  },
  coinsText: {
    fontSize: 22,
    fontWeight: '800',
    color: THEME.accentWarm,
  },
  coinsIcon: {
    fontSize: 20,
  },
  buttons: {
    width: '100%',
    gap: 10,
    alignItems: 'center',
  },
  nextBtn: {
    width: '100%',
  },
});
