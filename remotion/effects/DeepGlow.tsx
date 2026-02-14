import React from 'react';
import { GlowConfig } from '../../types';
import { hexToRgb } from '../../utils/animation';

interface DeepGlowProps {
  children: React.ReactNode;
  config: GlowConfig;
  color: string;
}

export const DeepGlow: React.FC<DeepGlowProps> = ({ children, config, color }) => {
  if (!config.enabled) return <>{children}</>;

  const filterId = "deep-glow-filter";
  const r = config.radius;
  const exposure = config.exposure;
  const intensity = config.intensity;
  const chromatic = config.chromaticAberration;
  const glowRgb = hexToRgb(config.color) || { r: 255, g: 255, b: 255 };

  const nr = glowRgb.r / 255;
  const ng = glowRgb.g / 255;
  const nb = glowRgb.b / 255;

  return (
    <div className="w-full h-full relative flex items-center justify-center">
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
          <filter id={filterId} x="-200%" y="-200%" width="500%" height="500%" colorInterpolationFilters="sRGB">
            <feOffset in="SourceGraphic" dx="0" dy="0" result="base" />
            
            <feGaussianBlur in="SourceGraphic" stdDeviation={r * 0.1} result="blur1" />
            <feGaussianBlur in="SourceGraphic" stdDeviation={r * 0.25} result="blur2" />
            <feGaussianBlur in="SourceGraphic" stdDeviation={r * 0.5} result="blur3" />
            <feGaussianBlur in="SourceGraphic" stdDeviation={r} result="blur4" />
            
            <feMerge result="mergedBlurs">
              <feMergeNode in="blur1" />
              <feMergeNode in="blur2" />
              <feMergeNode in="blur3" />
              <feMergeNode in="blur4" />
            </feMerge>

            <feColorMatrix 
              in="mergedBlurs" 
              type="matrix" 
              values={`${nr} 0 0 0 0  0 ${ng} 0 0 0  0 0 ${nb} 0 0  0 0 0 1 0`} 
              result="tintedGlow" 
            />

            <feComponentTransfer in="tintedGlow" result="exposedGlow">
              <feFuncR type="linear" slope={exposure * intensity} />
              <feFuncG type="linear" slope={exposure * intensity} />
              <feFuncB type="linear" slope={exposure * intensity} />
              <feFuncA type="linear" slope={intensity} />
            </feComponentTransfer>

            <feOffset in="exposedGlow" dx={-chromatic} dy="0" result="glowR" />
            <feOffset in="exposedGlow" dx={chromatic} dy="0" result="glowB" />
            
            <feColorMatrix in="glowR" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="redChannel" />
            <feColorMatrix in="glowB" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="blueChannel" />
            <feColorMatrix in="exposedGlow" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="greenChannel" />

            <feMerge result="chromaticGlow">
              <feMergeNode in="redChannel" />
              <feMergeNode in="greenChannel" />
              <feMergeNode in="blueChannel" />
            </feMerge>

            <feMerge>
              <feMergeNode in="chromaticGlow" />
              <feMergeNode in="base" />
            </feMerge>
          </filter>
        </defs>
      </svg>
      
      <div style={{ filter: `url(#${filterId})`, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {children}
      </div>
    </div>
  );
};