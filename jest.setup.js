/* eslint-disable no-undef */
const mockSound = jest.fn().mockImplementation(() => ({
  setVolume: jest.fn(),
  play: jest.fn(cb => cb && cb(true)),
  stop: jest.fn(cb => cb && cb()),
  release: jest.fn(),
}));
mockSound.setCategory = jest.fn();
mockSound.MAIN_BUNDLE = 0;

jest.mock('react-native-sound', () => mockSound);

jest.mock('react-native-gesture-handler', () => {
  const View = require('react-native').View;
  return {
    GestureHandlerRootView: View,
    TouchableOpacity: View,
  };
});

jest.mock('react-native-reanimated', () => {
  const View = require('react-native').View;
  const Text = require('react-native').Text;
  const AnimatedMock = {
    View,
    Text,
    createAnimatedComponent: jest.fn(Comp => Comp),
  };
  return {
    __esModule: true,
    default: AnimatedMock,
    View,
    Text,
    createAnimatedComponent: jest.fn(Comp => Comp),
    useSharedValue: jest.fn(val => ({ value: val })),
    useAnimatedStyle: jest.fn(() => ({})),
    withTiming: jest.fn(val => val),
    withSpring: jest.fn(val => val),
    withDelay: jest.fn((_, anim) => anim),
    withSequence: jest.fn((...anims) => anims[0]),
    withRepeat: jest.fn(anim => anim),
    runOnJS: jest.fn(fn => fn),
    Easing: {
      out: jest.fn(),
      quad: jest.fn(),
      cubic: jest.fn(),
    },
  };
});

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn().mockResolvedValue(null),
  setItem: jest.fn().mockResolvedValue(null),
  removeItem: jest.fn().mockResolvedValue(null),
  clear: jest.fn().mockResolvedValue(null),
}));

jest.mock('react-native-haptic-feedback', () => ({
  trigger: jest.fn(),
  HapticFeedbackTypes: {
    impactLight: 'impactLight',
    impactMedium: 'impactMedium',
    impactHeavy: 'impactHeavy',
    notificationSuccess: 'notificationSuccess',
    notificationError: 'notificationError',
  },
}));

jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  const View = require('react-native').View;
  const inset = { top: 0, right: 0, bottom: 0, left: 0 };
  const frame = { x: 0, y: 0, width: 390, height: 844 };
  const SafeAreaInsetsContext = React.createContext(inset);
  const SafeAreaFrameContext = React.createContext(frame);

  return {
    SafeAreaProvider: ({ children }: any) => (
      <SafeAreaInsetsContext.Provider value={inset}>
        <SafeAreaFrameContext.Provider value={frame}>
          {children}
        </SafeAreaFrameContext.Provider>
      </SafeAreaInsetsContext.Provider>
    ),
    SafeAreaConsumer: ({ children }: any) => children(inset),
    SafeAreaInsetsContext,
    SafeAreaFrameContext,
    useSafeAreaInsets: () => inset,
    useSafeAreaFrame: () => frame,
    SafeAreaView: ({ children, style }: any) => <View style={style}>{children}</View>,
  };
});

jest.mock('react-native-screens', () => {
  const View = require('react-native').View;
  return {
    enableScreens: jest.fn(),
    enableFreeze: jest.fn(),
    screensEnabled: jest.fn(() => true),
    compatibilityFlags: {},
    features: {
      usesNewAndroidHeaderHeightImplementation: false,
    },
    Screen: View,
    ScreenContainer: View,
    ScreenStack: View,
    ScreenStackItem: View,
    NativeScreen: View,
    NativeScreenContainer: View,
    ScreenStackHeaderConfig: View,
    ScreenStackHeaderSubview: View,
    SearchBar: View,
  };
});
