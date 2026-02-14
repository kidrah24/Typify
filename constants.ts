import { ResolutionType, Dimension } from './types';

export const RESOLUTION_MAP: Record<ResolutionType, Dimension> = {
  [ResolutionType.SQUARE]: { width: 1080, height: 1080 },
  [ResolutionType.LANDSCAPE]: { width: 1920, height: 1080 },
  [ResolutionType.PORTRAIT]: { width: 1080, height: 1920 },
};

export const FONTS = [
  'Inter',
  'Bebas Neue',
  'Montserrat',
  'Oswald',
  'Anton',
  'Archivo Black',
  'Syne',
  'Unbounded',
  'Righteous',
  'Fredoka One',
  'Raleway',
  'Playfair Display',
  'Merriweather',
  'Cinzel',
  'Special Elite',
  'Press Start 2P',
  'Satisfy',
  'Dancing Script',
  'Pacifico',
  'Kaushan Script',
  'Permanent Marker',
  'Caveat',
  'Lobster',
  'Bangers',
  'Comfortaa',
  'Ubuntu'
];

export const EASING_OPTIONS = [
  'linear',
  'ease-in',
  'ease-out',
  'ease-in-out',
  'bounce'
];