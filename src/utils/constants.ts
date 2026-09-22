/**
 * Global configurable constants for Snake Puzzle.
 * Adjust these values to balance the game economy and feel.
 */

// ─── Snake Colors (Vibrant Screenshot Palette) ────────────────────────────────
// Hot Pink, Lime Green, Royal Purple, Lavender, Cobalt Blue, Golden Yellow, Cyan, Coral
export const SNAKE_COLORS = [
  '#FF2079', // vibrant magenta pink
  '#76FF03', // neon lime green
  '#9333EA', // vivid royal purple
  '#B682C4', // soft lavender mauve
  '#2563EB', // electric cobalt blue
  '#FFC700', // golden amber yellow
  '#00E5FF', // electric cyan
  '#FF5722', // bright coral orange
];

// ─── Board ────────────────────────────────────────────────────────────────────
/** Fraction of the minimum screen dimension used for the board */
export const BOARD_SIZE_FRACTION = 0.90;
/** Gap (px) between cell inner content and cell boundary */
export const CELL_PADDING = 0;
/** Border radius of each cell (decorative background) */
export const CELL_BORDER_RADIUS = 0;
/** Gap (px) between cells (0 for seamless connected worm bodies) */
export const CELL_GAP = 0;

// ─── Animation Durations (ms) ─────────────────────────────────────────────────
export const ANIM_EXIT_DURATION = 350;       // snake slides off board
export const ANIM_SHAKE_DURATION = 400;      // blocked shake
export const ANIM_LEVEL_COMPLETE_DELAY = 600; // before showing level complete screen
export const ANIM_HINT_PULSE_DURATION = 500; // hint highlight pulse

// ─── Star System ─────────────────────────────────────────────────────────────
// Stars are awarded based on move efficiency.
// STAR_MOVE_MULTIPLIER: if moveCount <= snakeCount * multiplier → 3 stars
export const STAR_3_MOVE_MULTIPLIER = 1.5; // moves <= snakes * 1.5 → 3 stars
export const STAR_2_MOVE_MULTIPLIER = 2.5; // moves <= snakes * 2.5 → 2 stars
// Hints used also reduce stars:
export const HINTS_MAX_FOR_3_STARS = 0;    // no hints → still eligible for 3
export const HINTS_MAX_FOR_2_STARS = 1;

// ─── Hint System ─────────────────────────────────────────────────────────────
export const HINT_HIGHLIGHT_DURATION_MS = 2000;

// ─── Level Selection ─────────────────────────────────────────────────────────
export const LEVELS_PER_PAGE = 20; // how many levels shown per "page" in level select

// ─── Navigation Params ───────────────────────────────────────────────────────
// (Referenced by AppNavigator types)
export const INITIAL_LEVEL = 1;

// ─── Splash Screen ───────────────────────────────────────────────────────────
export const SPLASH_DURATION_MS = 2500;

// ─── AdMob Configuration ───────────────────────────────────────────────────
export const ADMOB_CONFIG = {
  APP_ID_ANDROID: 'ca-app-pub-7503400330650109~9977886732',
  APP_ID_IOS: 'ca-app-pub-7503400330650109~9977886732',
  INTERSTITIAL_ANDROID: 'ca-app-pub-7503400330650109/5253007811',
  INTERSTITIAL_IOS: 'ca-app-pub-7503400330650109/5253007811',
  BANNER_ANDROID: 'ca-app-pub-7503400330650109/9224042410',
  BANNER_IOS: 'ca-app-pub-7503400330650109/9224042410',
};

// ─── Colors & Theme ──────────────────────────────────────────────────────────
export const THEME = {
  background: '#0F0E17',
  surface: '#1A1A2E',
  surfaceElevated: '#16213E',
  primary: '#7C3AED',      // violet
  primaryLight: '#A855F7',
  accent: '#06D6A0',       // mint
  accentWarm: '#FFB703',   // amber
  text: '#FFFFFE',
  textSecondary: '#A8A8B3',
  textMuted: '#666680',
  boardBg: '#1E1E3F',
  cellBg: '#2A2A4A',
  cellBgAlt: '#252544',
  border: '#3D3D6B',
  success: '#06D6A0',
  error: '#FF6B6B',
  warning: '#FFB703',
  star: '#FFD700',
  shadow: 'rgba(0,0,0,0.5)',
  overlay: 'rgba(0,0,0,0.7)',
};
