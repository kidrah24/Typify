export enum AnimationType {
  ROLLING = 'Rolling Text',
  FLICKER = 'Flicker',
  SPLIT = 'Split Typography',
  LIQUID = 'Liquid Text',
  DISPLACEMENT = 'Displacement',
  STEP = 'Looping Step',
  GLITCH = 'Cinema Glitch',
  SHATTER = 'Shattered Glass',
  BOUNCE = 'Pixar Bounce',
  HANDWRITTEN = 'Handwritten Stroke'
}

export enum BackgroundType {
  BLACK = 'Black',
  GREEN = 'Green Screen',
  TRANSPARENT = 'Transparent'
}

export enum ResolutionType {
  SQUARE = '1080x1080',
  LANDSCAPE = '1920x1080',
  PORTRAIT = '1080x1920'
}

export enum ExportFormat {
  MP4 = 'MP4',
  WEBM = 'WebM (Alpha)'
}

export interface AnimationConfig {
  intensity?: number;
  speed?: number;
  blur?: number;
  skew?: number;
  distance?: number;
  rotation?: number;
  viscosity?: number;
  count?: number;
  rgbSplit?: number; // Specific for Glitch
}

export interface GlowConfig {
  enabled: boolean;
  radius: number;
  intensity: number;
  exposure: number;
  chromaticAberration: number;
  color: string;
}

export interface ProjectSettings {
  text: string;
  animationType: AnimationType;
  fontFamily: string;
  fontSize: number;
  color: string;
  background: BackgroundType;
  resolution: ResolutionType;
  duration: number; // in seconds
  fps: number;
  easing: string;
  animationConfig: AnimationConfig;
  glowConfig: GlowConfig;
}

export interface Dimension {
  width: number;
  height: number;
}