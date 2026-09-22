/**
 * LevelHeader — top bar showing world theme badge, level number, and coin count.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { THEME } from '../utils/constants';
import { BoardThemeConfig, getBoardTheme } from '../utils/themes';

interface LevelHeaderProps {
  levelNumber: number;
  coins: number;
  theme?: BoardThemeConfig;
  shapeType?: string;
  onBack?: () => void;
}

const SHAPE_BADGES: Record<string, { icon: string; name: string }> = {
  arrow: { icon: '🏹', name: 'ARROW' },
  heart: { icon: '💖', name: 'HEART' },
  diamond: { icon: '💎', name: 'DIAMOND' },
  ring: { icon: '🍩', name: 'RING' },
  hourglass: { icon: '⏳', name: 'HOURGLASS' },
  pyramid: { icon: '🔺', name: 'PYRAMID' },
  t_shape: { icon: '⚓', name: 'T-SHAPE' },
  u_shape: { icon: '🧲', name: 'U-SHAPE' },
  zigzag: { icon: '⚡', name: 'ZIGZAG' },
  stairs: { icon: '📶', name: 'STAIRS' },
  butterfly: { icon: '🦋', name: 'BUTTERFLY' },
  castle: { icon: '🏰', name: 'CASTLE' },
  cross: { icon: '➕', name: 'CROSS' },
  compact: { icon: '🔮', name: 'CLUSTER' },
};

export const LevelHeader: React.FC<LevelHeaderProps> = ({
  levelNumber,
  coins,
  theme,
  shapeType,
}) => {
  const currentTheme = theme ?? getBoardTheme(levelNumber);
  const shapeInfo = shapeType && SHAPE_BADGES[shapeType] ? SHAPE_BADGES[shapeType] : null;

  const displayIcon = shapeInfo ? shapeInfo.icon : currentTheme.icon;
  const displayName = shapeInfo ? `${shapeInfo.name} · ${currentTheme.name}` : currentTheme.name;

  return (
    <View style={styles.container}>
      {/* Level Badge */}
      <View style={styles.levelBadge}>
        <Text style={styles.levelLabel}>LEVEL</Text>
        <Text style={styles.levelNumber}>{levelNumber}</Text>
      </View>

      {/* World / Shape Theme Badge */}
      <View
        style={[
          styles.themeBadge,
          {
            backgroundColor: currentTheme.headerBadgeBg,
            borderColor: currentTheme.frameBorderColor,
          },
        ]}
      >
        <Text style={styles.themeIcon}>{displayIcon}</Text>
        <Text
          style={[
            styles.themeText,
            { color: currentTheme.headerTextColor },
          ]}
          numberOfLines={1}
        >
          {displayName}
        </Text>
      </View>

      {/* Coin Badge */}
      <View style={styles.coinBadge}>
        <Text style={styles.coinIcon}>🪙</Text>
        <Text style={styles.coinCount}>{coins}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.surfaceElevated,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 4,
    borderWidth: 1,
    borderColor: THEME.border,
  },
  levelLabel: {
    color: THEME.textMuted,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1.2,
  },
  levelNumber: {
    color: THEME.text,
    fontSize: 16,
    fontWeight: '800',
  },
  themeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 5,
    borderWidth: 1,
    maxWidth: '45%',
  },
  themeIcon: {
    fontSize: 14,
  },
  themeText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  coinBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.surfaceElevated,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 4,
    borderWidth: 1,
    borderColor: THEME.border,
  },
  coinIcon: {
    fontSize: 14,
  },
  coinCount: {
    color: THEME.accentWarm,
    fontSize: 15,
    fontWeight: '700',
  },
});
