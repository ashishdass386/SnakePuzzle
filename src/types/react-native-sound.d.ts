/**
 * Type declarations for react-native-sound.
 * Created manually since @types/react-native-sound is not published.
 */

declare module 'react-native-sound' {
  type SoundCallback = (error: Error | null) => void;

  class Sound {
    static MAIN_BUNDLE: string;
    static DOCUMENT: string;
    static LIBRARY: string;
    static CACHES: string;
    static setCategory(
      category: string,
      mixWithOthers?: boolean,
    ): void;

    constructor(
      filename: string,
      basePath: string | null,
      onLoad?: SoundCallback,
    );

    play(callback?: (success: boolean) => void): this;
    pause(callback?: () => void): this;
    stop(callback?: () => void): this;
    release(): void;
    setVolume(value: number): this;
    setLoop(value: boolean): this;
    getDuration(): number;
    isLoaded(): boolean;
    setSpeed(value: number): this;
    getCurrentTime(callback: (time: number, isPlaying: boolean) => void): void;
  }

  export = Sound;
}
