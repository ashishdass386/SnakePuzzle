/**
 * Theme & Side Design Configuration System for Snake Puzzle.
 *
 * Each theme provides distinct visual styling for:
 * - Board side frames & glowing borders
 * - Corner ornaments (cyber brackets, gold jewels, wooden studs, etc.)
 * - Side border trims & exit gate indicators
 * - Background grid cell textures and obstacle pillars
 */

export interface BoardThemeConfig {
  id: string;
  name: string;
  worldNumber: number;
  icon: string;
  subtitle: string;
  // Frame & Borders
  frameBorderColor: string;
  frameInnerGlow: string;
  frameBg: string;
  cornerStyle: 'cyber' | 'totem' | 'magma' | 'pearl' | 'jewel' | 'tech' | 'candy' | 'sakura' | 'ice' | 'dragon';
  cornerColor: string;
  sideAccentColor: string;
  exitGateColor: string;
  // Grid & Cells
  cellBg: string;
  cellBgAlt: string;
  cellBorder: string;
  obstacleBg: string;
  obstacleBorder: string;
  obstacleIcon?: string;
  // Ambient & Header
  headerBadgeBg: string;
  headerTextColor: string;
  glowColor: string;
}

export const BOARD_THEMES: BoardThemeConfig[] = [
  {
    id: 'cyber_neon',
    name: 'CYBER NEON',
    worldNumber: 1,
    icon: '⚡',
    subtitle: 'Sector 01 // Grid City',
    frameBorderColor: '#00F5FF',
    frameInnerGlow: 'rgba(0, 245, 255, 0.25)',
    frameBg: '#0B0E17',
    cornerStyle: 'cyber',
    cornerColor: '#FF007F',
    sideAccentColor: '#00F5FF',
    exitGateColor: '#00F5FF88',
    cellBg: '#131A29',
    cellBgAlt: '#101624',
    cellBorder: '#1E2C44',
    obstacleBg: '#090D15',
    obstacleBorder: '#FF007F',
    obstacleIcon: '💠',
    headerBadgeBg: '#00F5FF22',
    headerTextColor: '#00F5FF',
    glowColor: '#00F5FF',
  },
  {
    id: 'jungle_ruins',
    name: 'JUNGLE RUINS',
    worldNumber: 2,
    icon: '🌿',
    subtitle: 'Lost Aztec Sanctuary',
    frameBorderColor: '#10B981',
    frameInnerGlow: 'rgba(16, 185, 129, 0.22)',
    frameBg: '#141E15',
    cornerStyle: 'totem',
    cornerColor: '#F59E0B',
    sideAccentColor: '#34D399',
    exitGateColor: '#10B98188',
    cellBg: '#1A291C',
    cellBgAlt: '#162318',
    cellBorder: '#29432C',
    obstacleBg: '#0E170F',
    obstacleBorder: '#D97706',
    obstacleIcon: '🗿',
    headerBadgeBg: '#10B98122',
    headerTextColor: '#34D399',
    glowColor: '#10B981',
  },
  {
    id: 'magma_forge',
    name: 'MAGMA FORGE',
    worldNumber: 3,
    icon: '🔥',
    subtitle: 'Volcanic Core Depth',
    frameBorderColor: '#FF5722',
    frameInnerGlow: 'rgba(255, 87, 34, 0.3)',
    frameBg: '#1F110B',
    cornerStyle: 'magma',
    cornerColor: '#FFC107',
    sideAccentColor: '#FF7043',
    exitGateColor: '#FF572288',
    cellBg: '#2C1810',
    cellBgAlt: '#24130C',
    cellBorder: '#4E2617',
    obstacleBg: '#150A06',
    obstacleBorder: '#FF9800',
    obstacleIcon: '🌋',
    headerBadgeBg: '#FF572225',
    headerTextColor: '#FF9E80',
    glowColor: '#FF5722',
  },
  {
    id: 'ocean_abyss',
    name: 'OCEAN ABYSS',
    worldNumber: 4,
    icon: '🌊',
    subtitle: 'Sunken Coral Kingdom',
    frameBorderColor: '#06B6D4',
    frameInnerGlow: 'rgba(6, 182, 212, 0.25)',
    frameBg: '#081726',
    cornerStyle: 'pearl',
    cornerColor: '#2DD4BF',
    sideAccentColor: '#38BDF8',
    exitGateColor: '#06B6D488',
    cellBg: '#0F263D',
    cellBgAlt: '#0C1F33',
    cellBorder: '#1A4064',
    obstacleBg: '#05101C',
    obstacleBorder: '#2DD4BF',
    obstacleIcon: '🐚',
    headerBadgeBg: '#06B6D422',
    headerTextColor: '#38BDF8',
    glowColor: '#06B6D4',
  },
  {
    id: 'golden_pharaoh',
    name: 'GOLDEN PHARAOH',
    worldNumber: 5,
    icon: '👑',
    subtitle: 'Royal Gilded Vault',
    frameBorderColor: '#F59E0B',
    frameInnerGlow: 'rgba(245, 158, 11, 0.28)',
    frameBg: '#1E1608',
    cornerStyle: 'jewel',
    cornerColor: '#A855F7',
    sideAccentColor: '#FBBF24',
    exitGateColor: '#F59E0B88',
    cellBg: '#2E220D',
    cellBgAlt: '#261B09',
    cellBorder: '#523C16',
    obstacleBg: '#140E04',
    obstacleBorder: '#A855F7',
    obstacleIcon: '💎',
    headerBadgeBg: '#F59E0B25',
    headerTextColor: '#FCD34D',
    glowColor: '#F59E0B',
  },
  {
    id: 'cosmic_station',
    name: 'COSMIC STATION',
    worldNumber: 6,
    icon: '🚀',
    subtitle: 'Deep Orbit Matrix',
    frameBorderColor: '#8B5CF6',
    frameInnerGlow: 'rgba(139, 92, 246, 0.3)',
    frameBg: '#110C24',
    cornerStyle: 'tech',
    cornerColor: '#38BDF8',
    sideAccentColor: '#C084FC',
    exitGateColor: '#8B5CF688',
    cellBg: '#1D143D',
    cellBgAlt: '#170F31',
    cellBorder: '#35256D',
    obstacleBg: '#0B0718',
    obstacleBorder: '#38BDF8',
    obstacleIcon: '🛸',
    headerBadgeBg: '#8B5CF622',
    headerTextColor: '#D8B4FE',
    glowColor: '#8B5CF6',
  },
  {
    id: 'candy_kingdom',
    name: 'CANDY KINGDOM',
    worldNumber: 7,
    icon: '🍭',
    subtitle: 'Sugar Rush Wonderland',
    frameBorderColor: '#EC4899',
    frameInnerGlow: 'rgba(236, 72, 153, 0.25)',
    frameBg: '#220D1A',
    cornerStyle: 'candy',
    cornerColor: '#FDE047',
    sideAccentColor: '#F472B6',
    exitGateColor: '#EC489988',
    cellBg: '#341528',
    cellBgAlt: '#2A1020',
    cellBorder: '#5C2246',
    obstacleBg: '#180712',
    obstacleBorder: '#FDE047',
    obstacleIcon: '🍬',
    headerBadgeBg: '#EC489922',
    headerTextColor: '#F9A8D4',
    glowColor: '#EC4899',
  },
  {
    id: 'sakura_dojo',
    name: 'SAKURA DOJO',
    worldNumber: 8,
    icon: '🌸',
    subtitle: 'Zen Master Temple',
    frameBorderColor: '#F472B6',
    frameInnerGlow: 'rgba(244, 114, 182, 0.25)',
    frameBg: '#211218',
    cornerStyle: 'sakura',
    cornerColor: '#A3E635',
    sideAccentColor: '#FB7185',
    exitGateColor: '#F472B688',
    cellBg: '#331B25',
    cellBgAlt: '#29151E',
    cellBorder: '#5A2F41',
    obstacleBg: '#170B10',
    obstacleBorder: '#A3E635',
    obstacleIcon: '🏮',
    headerBadgeBg: '#F472B622',
    headerTextColor: '#FDA4AF',
    glowColor: '#F472B6',
  },
  {
    id: 'frost_citadel',
    name: 'FROST CITADEL',
    worldNumber: 9,
    icon: '❄️',
    subtitle: 'Frozen Glacial Spire',
    frameBorderColor: '#38BDF8',
    frameInnerGlow: 'rgba(56, 189, 248, 0.3)',
    frameBg: '#091A2A',
    cornerStyle: 'ice',
    cornerColor: '#E0F2FE',
    sideAccentColor: '#7DD3FC',
    exitGateColor: '#38BDF888',
    cellBg: '#122A42',
    cellBgAlt: '#0E2236',
    cellBorder: '#20476E',
    obstacleBg: '#05111D',
    obstacleBorder: '#E0F2FE',
    obstacleIcon: '🧊',
    headerBadgeBg: '#38BDF822',
    headerTextColor: '#BAE6FD',
    glowColor: '#38BDF8',
  },
  {
    id: 'dragon_lair',
    name: 'DRAGON LAIR',
    worldNumber: 10,
    icon: '🐉',
    subtitle: 'Infernal Obsidian Crypt',
    frameBorderColor: '#DC2626',
    frameInnerGlow: 'rgba(220, 38, 38, 0.35)',
    frameBg: '#1C0A0A',
    cornerStyle: 'dragon',
    cornerColor: '#F59E0B',
    sideAccentColor: '#EF4444',
    exitGateColor: '#DC262688',
    cellBg: '#2A1010',
    cellBgAlt: '#220B0B',
    cellBorder: '#4B1C1C',
    obstacleBg: '#120404',
    obstacleBorder: '#F59E0B',
    obstacleIcon: '⚔️',
    headerBadgeBg: '#DC262625',
    headerTextColor: '#FCA5A5',
    glowColor: '#DC2626',
  },
];

export const THEME_CYCLE_LEVELS = 10; // New theme every 10 levels

/**
 * Returns the theme configuration for a given level.
 * Cycles every 10 levels with a fresh world theme!
 */
export function getBoardTheme(levelNumber: number): BoardThemeConfig {
  const zeroIndexed = Math.max(0, levelNumber - 1);
  const themeIndex = Math.floor(zeroIndexed / THEME_CYCLE_LEVELS) % BOARD_THEMES.length;
  const baseTheme = BOARD_THEMES[themeIndex];
  const worldNum = Math.floor(zeroIndexed / THEME_CYCLE_LEVELS) + 1;

  return {
    ...baseTheme,
    worldNumber: worldNum,
  };
}
