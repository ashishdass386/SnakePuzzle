/**
 * SplashScreen — animated intro screen shown on launch.
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { THEME, SPLASH_DURATION_MS } from '../utils/constants';
import { initAudio } from '../audio/AudioManager';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

const { width } = Dimensions.get('window');

export const SplashScreen: React.FC<Props> = ({ navigation }) => {
  const logoScale = useSharedValue(0.3);
  const logoOpacity = useSharedValue(0);
  const titleOpacity = useSharedValue(0);
  const titleY = useSharedValue(30);
  const subtitleOpacity = useSharedValue(0);

  const goToHome = () => {
    navigation.replace('Home');
  };

  useEffect(() => {
    initAudio();

    // Logo entrance
    logoScale.value = withSpring(1, { damping: 12, stiffness: 120 });
    logoOpacity.value = withTiming(1, { duration: 500 });

    // Title slide up
    titleOpacity.value = withDelay(400, withTiming(1, { duration: 500 }));
    titleY.value = withDelay(400, withSpring(0, { damping: 15 }));

    // Subtitle
    subtitleOpacity.value = withDelay(800, withTiming(1, { duration: 400 }));

    // Navigate after splash duration
    const timer = setTimeout(() => runOnJS(goToHome)(), SPLASH_DURATION_MS);
    return () => clearTimeout(timer);
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
    opacity: logoOpacity.value,
  }));

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleY.value }],
  }));

  const subtitleStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
  }));

  return (
    <View style={styles.container}>
      {/* Background gradient effect using nested views */}
      <View style={styles.bgGlow} />

      <Animated.View style={[styles.logoContainer, logoStyle]}>
        {/* Snake logo: 3 colored circles in a curve */}
        <View style={styles.snakeLogo}>
          <View style={[styles.snakeDot, { backgroundColor: '#FF6B6B', width: 40, height: 40 }]} />
          <View style={[styles.snakeDot, { backgroundColor: '#4ECDC4', width: 52, height: 52, marginTop: -10 }]} />
          <View style={[styles.snakeDot, { backgroundColor: '#FFE66D', width: 64, height: 64, marginTop: -16 }]} />
          {/* Head */}
          <View style={styles.snakeHead}>
            <View style={styles.snakeEye} />
          </View>
        </View>
      </Animated.View>

      <Animated.Text style={[styles.title, titleStyle]}>
        SNAKE
      </Animated.Text>
      <Animated.Text style={[styles.titleAccent, titleStyle]}>
        PUZZLE
      </Animated.Text>

      <Animated.Text style={[styles.subtitle, subtitleStyle]}>
        Slide to escape
      </Animated.Text>

      {/* Dots loader */}
      <View style={styles.loaderRow}>
        {[0, 1, 2].map(i => (
          <View key={i} style={[styles.loaderDot, { opacity: 0.4 + i * 0.2 }]} />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bgGlow: {
    position: 'absolute',
    width: width * 1.5,
    height: width * 1.5,
    borderRadius: width * 0.75,
    backgroundColor: THEME.primary,
    opacity: 0.07,
    top: -width * 0.3,
  },
  logoContainer: {
    marginBottom: 32,
    alignItems: 'center',
  },
  snakeLogo: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 4,
  },
  snakeDot: {
    borderRadius: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  snakeHead: {
    width: 72,
    height: 72,
    backgroundColor: '#A855F7',
    borderRadius: 36,
    borderTopRightRadius: 20,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingRight: 12,
    marginTop: -20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  snakeEye: {
    width: 12,
    height: 12,
    backgroundColor: '#fff',
    borderRadius: 6,
    borderWidth: 2.5,
    borderColor: '#1A1A1A',
  },
  title: {
    fontSize: 48,
    fontWeight: '900',
    color: THEME.text,
    letterSpacing: 8,
  },
  titleAccent: {
    fontSize: 48,
    fontWeight: '900',
    color: THEME.primaryLight,
    letterSpacing: 8,
    marginTop: -8,
  },
  subtitle: {
    fontSize: 16,
    color: THEME.textSecondary,
    letterSpacing: 2,
    marginTop: 12,
    fontWeight: '500',
  },
  loaderRow: {
    flexDirection: 'row',
    gap: 8,
    position: 'absolute',
    bottom: 60,
  },
  loaderDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: THEME.primaryLight,
  },
});
