/**
 * GameScreen — the main puzzle gameplay screen.
 *
 * Architecture:
 * - Uses GameEngine (pure TS) for all game logic.
 * - Manages animation commands per snake via state.
 * - Handles tap → GameEngine.tapSnake() → animation dispatch.
 * - Hint button → GameEngine.useHint() → highlight snake.
 * - Restart → reload level config → reset engine.
 * - Level complete → navigate to LevelComplete after delay.
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { GameEngine } from '../game/GameEngine';
import { generateLevel } from '../game/LevelGenerator';
import { LevelConfig, SnakePiece } from '../game/types';
import { GameBoard } from '../components/GameBoard';
import { LevelHeader } from '../components/LevelHeader';
import { GameButton } from '../components/GameButton';
import { SnakeAnimationCommand } from '../components/Snake';
import { THEME, ANIM_LEVEL_COMPLETE_DELAY } from '../utils/constants';
import { updateLevelProgress } from '../storage/GameStorage';
import { calculateStars, makeLevelProgress } from '../utils/helpers';
import { playSound } from '../audio/AudioManager';
import { triggerHaptic } from '../audio/HapticManager';
import { showInterstitialAd } from '../ads/AdManager';
import { AppBannerAd } from '../components/AppBannerAd';

type Props = NativeStackScreenProps<RootStackParamList, 'Game'>;

export const GameScreen: React.FC<Props> = ({ route, navigation }) => {
  const { levelNumber } = route.params;
  const insets = useSafeAreaInsets();
  const topInset = Math.max(insets.top, Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) : 12);
  const bottomInset = Math.max(insets.bottom, 16);

  // ── Game state ────────────────────────────────────────────────────────────

  const [levelConfig, setLevelConfig] = useState<LevelConfig>(() =>
    generateLevel(levelNumber),
  );
  const engineRef = useRef<GameEngine>(new GameEngine(levelConfig));
  const levelCompleteTriggered = useRef(false);

  const [snakes, setSnakes] = useState<SnakePiece[]>(levelConfig.snakes);
  const [snakeCommands, setSnakeCommands] = useState<Record<string, SnakeAnimationCommand>>({});
  const [hintsRemaining, setHintsRemaining] = useState(1);
  const [moveCount, setMoveCount] = useState(0);
  const [hintSnakeId, setHintSnakeId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Sync levelConfig whenever levelNumber changes
  useEffect(() => {
    const config = generateLevel(levelNumber);
    setLevelConfig(config);
    levelCompleteTriggered.current = false;
    setIsProcessing(false);
  }, [levelNumber]);

  // Regenerate engine when level config changes
  useEffect(() => {
    engineRef.current = new GameEngine(levelConfig);
    levelCompleteTriggered.current = false;
    setSnakes(levelConfig.snakes);
    setSnakeCommands({});
    setMoveCount(0);
    setHintsRemaining(1);
    setHintSnakeId(null);
    setIsProcessing(false);
  }, [levelConfig]);

  // ── Tap handler ──────────────────────────────────────────────────────────

  const handleSnakeTap = useCallback(
    (snakeId: string) => {
      // Prevent tapping while another snake is actively exiting or blocked
      if (isProcessing) return;

      const result = engineRef.current.tapSnake(snakeId);
      const state = engineRef.current.getState();
      setMoveCount(state.moveCount);
      setHintSnakeId(null);

      if (result.type === 'exited') {
        // Lock tapping immediately so other snakes cannot move through the exiting snake
        setIsProcessing(true);
        playSound('exit');
        triggerHaptic('medium');

        // Set exit animation
        setSnakeCommands(prev => ({ ...prev, [snakeId]: 'exit' }));

        // Update snake state in React
        setSnakes(engineRef.current.getState().snakes);

        if (result.levelComplete) {
          handleLevelComplete();
        }
      } else if (result.type === 'blocked') {
        playSound('blocked');
        triggerHaptic('error');
        setSnakeCommands(prev => ({ ...prev, [snakeId]: 'blocked' }));
        // Reset blocked anim after shake
        setTimeout(() => {
          setSnakeCommands(prev => ({ ...prev, [snakeId]: 'idle' }));
        }, 400);
      }
    },
    [isProcessing, levelConfig, levelNumber],
  );

  const handleExitComplete = useCallback((snakeId: string) => {
    setSnakeCommands(prev => {
      const next = { ...prev };
      delete next[snakeId];
      return next;
    });

    // Release tap lock once exit animation is finished (unless level is complete)
    if (!engineRef.current.isComplete()) {
      setIsProcessing(false);
    }
  }, []);

  // ── Level complete ────────────────────────────────────────────────────────

  const handleLevelComplete = async () => {
    if (levelCompleteTriggered.current) return;
    levelCompleteTriggered.current = true;
    setIsProcessing(true);

    playSound('complete');
    triggerHaptic('success');

    const state = engineRef.current.getState();
    const snakeCount = levelConfig.snakes.length;
    const stars = calculateStars(state.moveCount, state.hintsUsed, snakeCount);
    const lp = makeLevelProgress(state, stars);

    await updateLevelProgress(levelNumber, lp);

    setTimeout(() => {
      navigation.replace('LevelComplete', {
        levelNumber,
        stars,
        moveCount: state.moveCount,
      });
    }, ANIM_LEVEL_COMPLETE_DELAY);
  };

  // ── Hint (1 per level) ────────────────────────────────────────────────────

  const handleHint = () => {
    if (isProcessing) return;
    if (hintsRemaining <= 0) return;

    const result = engineRef.current.useHint();
    if (result.found && result.snakeId) {
      setHintsRemaining(0);
      playSound('hint');
      triggerHaptic('light');
      setHintSnakeId(result.snakeId);
      setSnakeCommands(prev => ({ ...prev, [result.snakeId!]: 'hint' }));

      // Clear hint after 2s
      setTimeout(() => {
        setHintSnakeId(null);
        setSnakeCommands(prev => {
          const next = { ...prev };
          if (next[result.snakeId!] === 'hint') {
            next[result.snakeId!] = 'idle';
          }
          return next;
        });
      }, 2200);
    }
  };

  // ── Restart (Shows Interstitial Ad) ───────────────────────────────────────

  const handleRestart = () => {
    showInterstitialAd(() => {
      levelCompleteTriggered.current = false;
      engineRef.current.restart(levelConfig);
      setSnakes(levelConfig.snakes);
      setSnakeCommands({});
      setMoveCount(0);
      setHintsRemaining(1);
      setHintSnakeId(null);
      setIsProcessing(false);
    });
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <View style={[styles.container, { paddingTop: topInset, paddingBottom: bottomInset }]}>
      <StatusBar barStyle="light-content" />

      <LevelHeader
        levelNumber={levelNumber}
        moveCount={moveCount}
      />

      {/* Board */}
      <View style={styles.boardContainer}>
        <GameBoard
          snakes={snakes}
          boardRows={levelConfig.boardSize.rows}
          boardCols={levelConfig.boardSize.cols}
          blockedCells={levelConfig.boardSize.blockedCells}
          theme={levelConfig.theme}
          snakeCommands={snakeCommands}
          insetsTop={topInset}
          insetsBottom={bottomInset}
          onSnakeTap={handleSnakeTap}
          onSnakeExitComplete={handleExitComplete}
        />
      </View>

      {/* Bottom controls */}
      <View style={styles.controls}>
        <GameButton
          testID="btn-restart"
          label="↺  Restart"
          onPress={handleRestart}
          variant="secondary"
          size="sm"
          style={styles.controlBtn}
        />
        <GameButton
          testID="btn-hint"
          label={hintsRemaining > 0 ? "💡 Hint (1)" : "💡 Hint (Used)"}
          onPress={handleHint}
          disabled={hintsRemaining <= 0}
          variant="ghost"
          size="sm"
          style={styles.controlBtn}
        />
      </View>

      {/* Banner Ad */}
      <AppBannerAd />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.background,
  },
  boardContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    paddingHorizontal: 24,
    paddingBottom: 24,
    paddingTop: 12,
  },
  controlBtn: {
    flex: 1,
  },
});
