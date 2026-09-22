/**
 * GameButton — reusable styled button component.
 */

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { THEME } from '../utils/constants';
import { playSound } from '../audio/AudioManager';
import { triggerHaptic } from '../audio/HapticManager';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

// ─── Types ────────────────────────────────────────────────────────────────────

interface GameButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  testID?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export const GameButton: React.FC<GameButtonProps> = ({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  style,
  textStyle,
  testID,
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.94, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const handlePress = () => {
    if (disabled || loading) return;
    playSound('button');
    triggerHaptic('light');
    onPress();
  };

  return (
    <AnimatedTouchable
      testID={testID}
      activeOpacity={0.85}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      style={[
        styles.base,
        styles[variant],
        styles[`size_${size}`],
        disabled && styles.disabled,
        animatedStyle,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? '#fff' : THEME.primary} />
      ) : (
        <>
          {icon}
          <Text
            style={[
              styles.label,
              styles[`label_${variant}`],
              styles[`label_${size}`],
              textStyle,
            ]}
          >
            {label}
          </Text>
        </>
      )}
    </AnimatedTouchable>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },

  // ── Variants ──
  primary: {
    backgroundColor: THEME.primary,
  },
  secondary: {
    backgroundColor: THEME.surfaceElevated,
    borderWidth: 1,
    borderColor: THEME.border,
  },
  ghost: {
    backgroundColor: 'transparent',
    shadowOpacity: 0,
    elevation: 0,
  },
  danger: {
    backgroundColor: THEME.error,
  },

  // ── Sizes ──
  size_sm: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12 },
  size_md: { paddingHorizontal: 24, paddingVertical: 14 },
  size_lg: { paddingHorizontal: 40, paddingVertical: 18, borderRadius: 20 },

  disabled: {
    opacity: 0.4,
  },

  // ── Labels ──
  label: {
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  label_primary: { color: '#FFFFFF' },
  label_secondary: { color: THEME.text },
  label_ghost: { color: THEME.primary },
  label_danger: { color: '#FFFFFF' },

  label_sm: { fontSize: 13 },
  label_md: { fontSize: 15 },
  label_lg: { fontSize: 18 },
});
