/**
 * SettingsScreen — sound, music, haptics toggles + about/privacy links.
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Linking,
  Alert,
  Platform,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { THEME } from '../utils/constants';
import { loadSettings, saveSettings } from '../storage/GameStorage';
import { GameSettings } from '../game/types';
import { setSoundEnabled } from '../audio/AudioManager';
import { setHapticsEnabled } from '../audio/HapticManager';
import { AppBannerAd } from '../components/AppBannerAd';

type Props = NativeStackScreenProps<RootStackParamList, 'Settings'>;

interface SettingRowProps {
  label: string;
  description?: string;
  value: boolean;
  onToggle: (v: boolean) => void;
  testID?: string;
}

const SettingRow: React.FC<SettingRowProps> = ({
  label,
  description,
  value,
  onToggle,
  testID,
}) => (
  <View style={styles.settingRow}>
    <View style={styles.settingLabel}>
      <Text style={styles.settingTitle}>{label}</Text>
      {description && <Text style={styles.settingDesc}>{description}</Text>}
    </View>
    <Switch
      testID={testID}
      value={value}
      onValueChange={onToggle}
      thumbColor={value ? THEME.primary : THEME.textMuted}
      trackColor={{ false: THEME.border, true: `${THEME.primary}55` }}
    />
  </View>
);

export const SettingsScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const topInset = Math.max(insets.top, Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) : 12);
  const bottomInset = Math.max(insets.bottom, 16);

  const [settings, setSettings] = useState<GameSettings>({
    soundEnabled: true,
    musicEnabled: true,
    hapticsEnabled: true,
  });

  useEffect(() => {
    loadSettings().then(s => {
      setSettings(s);
      setSoundEnabled(s.soundEnabled);
      setHapticsEnabled(s.hapticsEnabled);
    });
  }, []);

  const updateSetting = async (key: keyof GameSettings, value: boolean) => {
    const next = { ...settings, [key]: value };
    setSettings(next);
    await saveSettings(next);

    if (key === 'soundEnabled') setSoundEnabled(value);
    if (key === 'hapticsEnabled') setHapticsEnabled(value);
  };

  const handlePrivacyPolicy = () => {
    Alert.alert(
      'Privacy Policy',
      'Snake Puzzle does not collect personal data. All progress is stored locally on your device.',
    );
  };

  const handleAbout = () => {
    Alert.alert(
      'About Snake Puzzle',
      'Snake Puzzle v1.0\n\nA challenging tap-to-escape puzzle game.\nSlide snakes off the board to solve each level!\n\nBuilt with React Native.',
    );
  };

  return (
    <View style={[styles.container, { paddingTop: topInset, paddingBottom: bottomInset }]}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
          testID="btn-back-settings"
        >
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>SETTINGS</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Audio section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>AUDIO</Text>

        <View style={styles.sectionCard}>
          <SettingRow
            testID="toggle-sound"
            label="Sound Effects"
            description="Tap, exit, and blocked sounds"
            value={settings.soundEnabled}
            onToggle={v => updateSetting('soundEnabled', v)}
          />
          <View style={styles.divider} />
          <SettingRow
            testID="toggle-music"
            label="Music"
            description="Background music"
            value={settings.musicEnabled}
            onToggle={v => updateSetting('musicEnabled', v)}
          />
          <View style={styles.divider} />
          <SettingRow
            testID="toggle-haptics"
            label="Haptic Feedback"
            description="Vibration on snake interactions"
            value={settings.hapticsEnabled}
            onToggle={v => updateSetting('hapticsEnabled', v)}
          />
        </View>
      </View>

      {/* More section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>MORE</Text>

        <View style={styles.sectionCard}>
          <TouchableOpacity
            style={styles.linkRow}
            onPress={handlePrivacyPolicy}
            testID="btn-privacy"
          >
            <Text style={styles.linkLabel}>Privacy Policy</Text>
            <Text style={styles.linkArrow}>›</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity
            style={styles.linkRow}
            onPress={handleAbout}
            testID="btn-about"
          >
            <Text style={styles.linkLabel}>About</Text>
            <Text style={styles.linkArrow}>›</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Version */}
      <Text style={styles.version}>Snake Puzzle v1.0.0</Text>

      {/* Banner Ad */}
      <View style={{ marginTop: 'auto' }}>
        <AppBannerAd />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.background,
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
  section: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  sectionTitle: {
    color: THEME.textMuted,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: 10,
  },
  sectionCard: {
    backgroundColor: THEME.surfaceElevated,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: THEME.border,
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    justifyContent: 'space-between',
  },
  settingLabel: {
    flex: 1,
  },
  settingTitle: {
    color: THEME.text,
    fontSize: 15,
    fontWeight: '600',
  },
  settingDesc: {
    color: THEME.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    justifyContent: 'space-between',
  },
  linkLabel: {
    color: THEME.text,
    fontSize: 15,
    fontWeight: '500',
  },
  linkArrow: {
    color: THEME.textMuted,
    fontSize: 20,
  },
  divider: {
    height: 1,
    backgroundColor: THEME.border,
    marginHorizontal: 16,
  },
  version: {
    color: THEME.textMuted,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 40,
  },
});
