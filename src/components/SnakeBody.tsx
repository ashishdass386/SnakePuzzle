/**
 * SnakeBody — renders a seamless, continuous smooth snake body segment
 * without cut lines or ribbed textures.
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';

export type SegmentType =
  | 'straight_h'
  | 'straight_v'
  | 'corner_up_right'
  | 'corner_up_left'
  | 'corner_down_right'
  | 'corner_down_left';

interface SnakeBodyProps {
  color: string;
  size: number;
  segmentType: SegmentType;
  isHinted?: boolean;
}

export const SnakeBody: React.FC<SnakeBodyProps> = ({
  color,
  size,
  segmentType,
  isHinted = false,
}) => {
  const thickness = size * 0.84;
  const offset = (size - thickness) / 2;

  // ─── 1. Straight Horizontal Segment ──────────────────────────────────────────
  if (segmentType === 'straight_h') {
    return (
      <View style={[styles.container, { width: size, height: size }]}>
        <View
          style={[
            styles.straightH,
            {
              backgroundColor: color,
              width: size + 1, // Slight overlap for seamless connection
              height: thickness,
              shadowColor: isHinted ? '#FFD700' : '#000',
              shadowOpacity: isHinted ? 0.7 : 0.25,
              shadowRadius: isHinted ? 8 : 2,
            },
          ]}
        />
      </View>
    );
  }

  // ─── 2. Straight Vertical Segment ────────────────────────────────────────────
  if (segmentType === 'straight_v') {
    return (
      <View style={[styles.container, { width: size, height: size }]}>
        <View
          style={[
            styles.straightV,
            {
              backgroundColor: color,
              width: thickness,
              height: size + 1,
              shadowColor: isHinted ? '#FFD700' : '#000',
              shadowOpacity: isHinted ? 0.7 : 0.25,
              shadowRadius: isHinted ? 8 : 2,
            },
          ]}
        />
      </View>
    );
  }

  // ─── 3. 90° Corner Bends ─────────────────────────────────────────────────────
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <View
        style={[
          styles.cornerOuter,
          {
            backgroundColor: color,
            shadowColor: isHinted ? '#FFD700' : '#000',
            shadowOpacity: isHinted ? 0.7 : 0.25,
            shadowRadius: isHinted ? 8 : 2,
          },
          getCornerShapeStyle(segmentType, size, thickness, offset),
        ]}
      />
    </View>
  );
};

// ─── Corner Style Helpers ─────────────────────────────────────────────────────

function getCornerShapeStyle(
  type: SegmentType,
  size: number,
  thickness: number,
  offset: number,
) {
  const cornerRadius = size * 0.42;

  switch (type) {
    case 'corner_up_right':
      return {
        top: 0,
        right: 0,
        width: size - offset + 0.5,
        height: size - offset + 0.5,
        borderTopRightRadius: cornerRadius,
        borderBottomLeftRadius: thickness * 0.35,
      };
    case 'corner_up_left':
      return {
        top: 0,
        left: 0,
        width: size - offset + 0.5,
        height: size - offset + 0.5,
        borderTopLeftRadius: cornerRadius,
        borderBottomRightRadius: thickness * 0.35,
      };
    case 'corner_down_right':
      return {
        bottom: 0,
        right: 0,
        width: size - offset + 0.5,
        height: size - offset + 0.5,
        borderBottomRightRadius: cornerRadius,
        borderTopLeftRadius: thickness * 0.35,
      };
    case 'corner_down_left':
      return {
        bottom: 0,
        left: 0,
        width: size - offset + 0.5,
        height: size - offset + 0.5,
        borderBottomLeftRadius: cornerRadius,
        borderTopRightRadius: thickness * 0.35,
      };
    default:
      return {};
  }
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  straightH: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    elevation: 3,
    shadowOffset: { width: 0, height: 1 },
  },
  straightV: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    elevation: 3,
    shadowOffset: { width: 0, height: 1 },
  },
  cornerOuter: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowOffset: { width: 0, height: 1 },
  },
});
