/**
 * GameCell — transparent grid node with subtle center guide dot for seamless borderless play.
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BoardThemeConfig } from '../utils/themes';

interface GameCellProps {
  size: number;
  row: number;
  col: number;
  theme?: BoardThemeConfig;
  isBlocked?: boolean;
}

export const GameCell: React.FC<GameCellProps> = ({
  size,
  theme,
  isBlocked = false,
}) => {
  if (isBlocked) {
    // Blocked/Silhouette cell: subtle ambient micro-dot
    return (
      <View style={[styles.cell, { width: size, height: size }]}>
        <View
          style={[
            styles.microDot,
            {
              backgroundColor: theme?.frameBorderColor ?? '#4A3E72',
              width: size * 0.08,
              height: size * 0.08,
              borderRadius: size * 0.04,
            },
          ]}
        />
      </View>
    );
  }

  const dotColor = theme?.frameBorderColor ?? '#5E4B8B';

  return (
    <View
      style={[
        styles.cell,
        {
          width: size,
          height: size,
        },
      ]}
    >
      {/* Subtle guide dot in node center */}
      <View
        style={[
          styles.nodeDot,
          {
            backgroundColor: dotColor,
            width: size * 0.10,
            height: size * 0.10,
            borderRadius: size * 0.05,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  cell: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  nodeDot: {
    opacity: 0.22,
  },
  microDot: {
    opacity: 0.08,
  },
});
