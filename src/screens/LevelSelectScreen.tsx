/**
 * LevelSelectScreen — paginated level browser.
 *
 * Shows levels in a grid. Unlocked levels show star progress.
 * Locked levels show a lock icon.
 * Uses FlatList for virtualization — only renders visible levels.
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { THEME, LEVELS_PER_PAGE } from '../utils/constants';
import { loadProgress } from '../storage/GameStorage';
import { GameProgress } from '../game/types';
import { playSound } from '../audio/AudioManager';

type Props = NativeStackScreenProps<RootStackParamList, 'LevelSelect'>;

const { width } = Dimensions.get('window');
const COLS = 5;
const ITEM_SIZE = (width - 48 - (COLS - 1) * 8) / COLS;

// Total levels to display in the browser (unlimited, but cap the list for UI)
const DISPLAY_LEVEL_COUNT = 500;

interface LevelItemProps {
  levelNumber: number;
  stars: number;
  unlocked: boolean;
  onPress: () => void;
}

const LevelItem: React.FC<LevelItemProps> = ({ levelNumber, stars, unlocked, onPress }) => (
  <TouchableOpacity
    style={[styles.levelItem, !unlocked && styles.levelItemLocked]}
    onPress={unlocked ? onPress : undefined}
    activeOpacity={unlocked ? 0.7 : 1}
    testID={`level-btn-${levelNumber}`}
  >
    {unlocked ? (
      <>
        <Text style={styles.levelNumber}>{levelNumber}</Text>
        <View style={styles.starsRow}>
          {[0, 1, 2].map(i => (
            <Text key={i} style={[styles.starDot, i < stars && styles.starDotFilled]}>
              {'★'}
            </Text>
          ))}
        </View>
      </>
    ) : (
      <Text style={styles.lockIcon}>🔒</Text>
    )}
  </TouchableOpacity>
);

export const LevelSelectScreen: React.FC<Props> = ({ navigation }) => {
  const [progress, setProgress] = useState<GameProgress | null>(null);
  const [page, setPage] = useState(0);

  useEffect(() => {
    loadProgress().then(setProgress);
    const unsubscribe = navigation.addListener('focus', () => {
      loadProgress().then(setProgress);
    });
    return unsubscribe;
  }, [navigation]);

  const totalPages = Math.ceil(DISPLAY_LEVEL_COUNT / LEVELS_PER_PAGE);
  const pageStart = page * LEVELS_PER_PAGE + 1;
  const pageEnd = Math.min(pageStart + LEVELS_PER_PAGE - 1, DISPLAY_LEVEL_COUNT);

  const levels = Array.from(
    { length: pageEnd - pageStart + 1 },
    (_, i) => pageStart + i,
  );

  const handleLevelPress = (levelNumber: number) => {
    playSound('button');
    navigation.navigate('Game', { levelNumber });
  };

  if (!progress) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
          testID="btn-back"
        >
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>SELECT LEVEL</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Page indicator */}
      <Text style={styles.pageLabel}>
        Levels {pageStart}–{pageEnd}
      </Text>

      {/* Level grid */}
      <FlatList
        data={levels}
        keyExtractor={item => String(item)}
        numColumns={COLS}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => {
          const lp = progress.levels[String(item)];
          const unlocked = item <= progress.highestUnlockedLevel;
          return (
            <LevelItem
              levelNumber={item}
              stars={lp?.stars ?? 0}
              unlocked={unlocked}
              onPress={() => handleLevelPress(item)}
            />
          );
        }}
      />

      {/* Page navigation */}
      <View style={styles.pagination}>
        <TouchableOpacity
          onPress={() => setPage(p => Math.max(0, p - 1))}
          disabled={page === 0}
          style={[styles.pageBtn, page === 0 && styles.pageBtnDisabled]}
          testID="btn-prev-page"
        >
          <Text style={styles.pageBtnText}>‹ Prev</Text>
        </TouchableOpacity>

        <Text style={styles.pageNum}>
          {page + 1} / {totalPages}
        </Text>

        <TouchableOpacity
          onPress={() => setPage(p => Math.min(totalPages - 1, p + 1))}
          disabled={page === totalPages - 1}
          style={[styles.pageBtn, page === totalPages - 1 && styles.pageBtnDisabled]}
          testID="btn-next-page"
        >
          <Text style={styles.pageBtnText}>Next ›</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.background,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: THEME.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: THEME.textSecondary,
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: THEME.surfaceElevated,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: THEME.border,
  },
  backArrow: {
    color: THEME.text,
    fontSize: 24,
    fontWeight: '700',
  },
  headerTitle: {
    color: THEME.text,
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 2,
  },
  pageLabel: {
    color: THEME.textMuted,
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: 1,
  },
  grid: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  row: {
    gap: 8,
    marginBottom: 8,
  },
  levelItem: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    backgroundColor: THEME.surfaceElevated,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: THEME.border,
  },
  levelItemLocked: {
    opacity: 0.4,
    backgroundColor: THEME.surface,
  },
  levelNumber: {
    color: THEME.text,
    fontSize: 15,
    fontWeight: '700',
  },
  starsRow: {
    flexDirection: 'row',
    marginTop: 3,
  },
  starDot: {
    fontSize: 9,
    color: THEME.border,
  },
  starDotFilled: {
    color: THEME.star,
  },
  lockIcon: {
    fontSize: 18,
  },
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 24,
  },
  pageBtn: {
    backgroundColor: THEME.surfaceElevated,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: THEME.border,
  },
  pageBtnDisabled: {
    opacity: 0.3,
  },
  pageBtnText: {
    color: THEME.text,
    fontSize: 14,
    fontWeight: '600',
  },
  pageNum: {
    color: THEME.textMuted,
    fontSize: 13,
    minWidth: 60,
    textAlign: 'center',
  },
});
