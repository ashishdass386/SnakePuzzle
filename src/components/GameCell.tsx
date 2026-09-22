/**
 * GameCell — renders a single background grid cell.
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { THEME, CELL_PADDING } from '../utils/constants';

interface GameCellProps {
  size: number;
  row: number;
  col: number;
}

export const GameCell: React.FC<GameCellProps> = ({ size, row, col }) => {
  // Alternate slightly for a subtle checker feel
  const isAlt = (row + col) % 2 === 1;

  return (
    <View
      style={[
        styles.cell,
        {
          width: size,
          height: size,
          backgroundColor: isAlt ? THEME.cellBgAlt : THEME.cellBg,
          borderRadius: size * 0.12,
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  cell: {},
});
