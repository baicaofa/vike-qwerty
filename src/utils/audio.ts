/**
 * 自定义音频工具
 * 替代 use-sound 库，减少依赖
 */

interface AudioOptions {
  volume?: number;
  playbackRate?: number;
  interrupt?: boolean;
  soundEnabled?: boolean;
  sprite?: Record<string, [number, number]>;
  id?: string;
  onload?: () => void;
  onend?: () => void;
  onplay?: () => void;
  onstop?: () => void;
  onpause?: () => void;
  onvolume?: () => void;
  onrate?: () => void;
  onseek?: () => void;
  onmute?: () => void;
  onunmute?: () => void;
}

interface AudioInstance {
  play: (options?: AudioOptions) => void;
  stop: () => void;
  pause: () => void;
  volume: (value: number) => void;
  rate: (value: number) => void;
  seek: (value: number) => void;
  mute: () => void;
  unmute: () => void;
  isPlaying: () => boolean;
  isMuted: () => boolean;
  destroy: () => void;
}

class AudioManager {
  private audio: HTMLAudioElement | null = null;
  private isLoaded = false;
  private isMuted = false;
  private currentVolume = 1;
  private currentRate = 1;
  private options: AudioOptions = {};

  constructor(private src: string, options: AudioOptions = {}) {
    this.options = options;
    this.currentVolume = options.volume ?? 1;
    this.currentRate = options.playbackRate ?? 1;
  }

  private createAudio(): HTMLAudioElement {
    if (this.audio) {
      return this.audio;
    }

    const audio = new HTMLAudioElement();
    audio.src = this.src;
    audio.preload = 'auto';
    audio.volume = this.currentVolume;
    audio.playbackRate = this.currentRate;

    audio.addEventListener('canplaythrough', () => {
      this.isLoaded = true;
      this.options.onload?.();
    });

    audio.addEventListener('ended', () => {
      this.options.onend?.();
    });

    audio.addEventListener('play', () => {
      this.options.onplay?.();
    });

    audio.addEventListener('pause', () => {
      this.options.onpause?.();
    });

    audio.addEventListener('volumechange', () => {
      this.options.onvolume?.();
    });

    audio.addEventListener('ratechange', () => {
      this.options.onrate?.();
    });

    audio.addEventListener('seeked', () => {
      this.options.onseek?.();
    });

    this.audio = audio;
    return audio;
  }

  play(options: AudioOptions = {}) {
    if (!this.options.soundEnabled && options.soundEnabled !== true) {
      return;
    }

    const audio = this.createAudio();
    
    if (options.interrupt) {
      this.stop();
    }

    if (this.isMuted) {
      audio.muted = true;
    }

    audio.volume = options.volume ?? this.currentVolume;
    audio.playbackRate = options.playbackRate ?? this.currentRate;

    audio.play().catch(error => {
      console.warn('Audio play failed:', error);
    });
  }

  stop() {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
      this.options.onstop?.();
    }
  }

  pause() {
    if (this.audio) {
      this.audio.pause();
      this.options.onpause?.();
    }
  }

  volume(value: number) {
    this.currentVolume = Math.max(0, Math.min(1, value));
    if (this.audio) {
      this.audio.volume = this.currentVolume;
      this.options.onvolume?.();
    }
  }

  rate(value: number) {
    this.currentRate = Math.max(0.1, Math.min(4, value));
    if (this.audio) {
      this.audio.playbackRate = this.currentRate;
      this.options.onrate?.();
    }
  }

  seek(value: number) {
    if (this.audio) {
      this.audio.currentTime = value;
      this.options.onseek?.();
    }
  }

  mute() {
    this.isMuted = true;
    if (this.audio) {
      this.audio.muted = true;
      this.options.onmute?.();
    }
  }

  unmute() {
    this.isMuted = false;
    if (this.audio) {
      this.audio.muted = false;
      this.options.onunmute?.();
    }
  }

  isPlaying(): boolean {
    return this.audio ? !this.audio.paused : false;
  }

  isMuted(): boolean {
    return this.isMuted;
  }

  destroy() {
    if (this.audio) {
      this.audio.pause();
      this.audio.src = '';
      this.audio = null;
    }
  }
}

// 全局音频管理器
const audioInstances = new Map<string, AudioManager>();

/**
 * 创建音频实例
 * @param src - 音频文件路径
 * @param options - 音频选项
 * @returns 音频实例
 */
export function createAudio(src: string, options: AudioOptions = {}): AudioInstance {
  const id = options.id || src;
  
  if (audioInstances.has(id)) {
    const instance = audioInstances.get(id)!;
    return {
      play: (opts) => instance.play(opts),
      stop: () => instance.stop(),
      pause: () => instance.pause(),
      volume: (value) => instance.volume(value),
      rate: (value) => instance.rate(value),
      seek: (value) => instance.seek(value),
      mute: () => instance.mute(),
      unmute: () => instance.unmute(),
      isPlaying: () => instance.isPlaying(),
      isMuted: () => instance.isMuted(),
      destroy: () => {
        instance.destroy();
        audioInstances.delete(id);
      }
    };
  }

  const instance = new AudioManager(src, options);
  audioInstances.set(id, instance);

  return {
    play: (opts) => instance.play(opts),
    stop: () => instance.stop(),
    pause: () => instance.pause(),
    volume: (value) => instance.volume(value),
    rate: (value) => instance.rate(value),
    seek: (value) => instance.seek(value),
    mute: () => instance.mute(),
    unmute: () => instance.unmute(),
    isPlaying: () => instance.isPlaying(),
    isMuted: () => instance.isMuted(),
    destroy: () => {
      instance.destroy();
      audioInstances.delete(id);
    }
  };
}

/**
 * 自定义 useSound hook
 * @param src - 音频文件路径
 * @param options - 音频选项
 * @returns [play, stop, pause, volume, rate, seek, mute, unmute, isPlaying, isMuted, destroy]
 */
export function useSound(src: string, options: AudioOptions = {}) {
  const audio = createAudio(src, options);

  return [
    audio.play,
    audio.stop,
    audio.pause,
    audio.volume,
    audio.rate,
    audio.seek,
    audio.mute,
    audio.unmute,
    audio.isPlaying,
    audio.isMuted,
    audio.destroy
  ] as const;
}

/**
 * 播放音效
 * @param src - 音频文件路径
 * @param options - 音频选项
 */
export function playSound(src: string, options: AudioOptions = {}) {
  const audio = createAudio(src, options);
  audio.play(options);
}

/**
 * 停止所有音频
 */
export function stopAllSounds() {
  audioInstances.forEach(instance => instance.stop());
}

/**
 * 设置全局音频开关
 * @param enabled - 是否启用音频
 */
export function setGlobalAudioEnabled(enabled: boolean) {
  audioInstances.forEach(instance => {
    if (!enabled) {
      instance.stop();
    }
  });
}

export default useSound;