/**
 * LevelHeader — top bar showing level number and coin count.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { THEME } from '../utils/constants';

interface LevelHeaderProps {
  levelNumber: number;
  coins: number;
  onBack?: () => void;
}

export const LevelHeader: React.FC<LevelHeaderProps> = ({
  levelNumber,
  coins,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.levelBadge}>
        <Text style={styles.levelLabel}>LEVEL</Text>
        <Text style={styles.levelNumber}>{levelNumber}</Text>
      </View>

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
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.surfaceElevated,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
    gap: 6,
    borderWidth: 1,
    borderColor: THEME.border,
  },
  levelLabel: {
    color: THEME.textMuted,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.5,
  },
  levelNumber: {
    color: THEME.text,
    fontSize: 18,
    fontWeight: '800',
  },
  coinBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.surfaceElevated,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
    gap: 6,
    borderWidth: 1,
    borderColor: THEME.border,
  },
  coinIcon: {
    fontSize: 16,
  },
  coinCount: {
    color: THEME.accentWarm,
    fontSize: 16,
    fontWeight: '700',
  },
});
