/**
 * LevelHeader — minimal top bar showing ONLY Level and Moves counters.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { THEME } from '../utils/constants';

interface LevelHeaderProps {
  levelNumber: number;
  moveCount: number;
  onBack?: () => void;
}

export const LevelHeader: React.FC<LevelHeaderProps> = ({
  levelNumber,
  moveCount,
}) => {
  return (
    <View style={styles.container}>
      {/* Level Badge */}
      <View style={styles.badge}>
        <Text style={styles.badgeLabel}>LEVEL</Text>
        <Text style={styles.badgeValue}>{levelNumber}</Text>
      </View>

      {/* Moves Badge */}
      <View style={styles.badge}>
        <Text style={styles.badgeLabel}>MOVES</Text>
        <Text style={styles.badgeValue}>{moveCount}</Text>
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
    paddingVertical: 10,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.surfaceElevated,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 7,
    gap: 6,
    borderWidth: 1,
    borderColor: THEME.border,
  },
  badgeLabel: {
    color: THEME.textMuted,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  badgeValue: {
    color: THEME.text,
    fontSize: 16,
    fontWeight: '800',
  },
});
