import React, { useMemo } from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, random } from 'remotion';
import { ProjectSettings } from '../../types';

const GlitchLayer: React.FC<{ 
  settings: ProjectSettings; 
  color: string; 
  layerId: string;
  globalProgress: number;
}> = ({ settings, color, layerId, globalProgress }) => {
  const frame = useCurrentFrame();
  const config = settings.animationConfig;
  const intensity = config.intensity ?? 1;
  const rgbSplit = config.rgbSplit ?? 15;

  const seed = `${layerId}-${frame}`;
  
  const isGlitching = random(seed + 'active') > 0.85;
  const offsetX = isGlitching ? (random(seed + 'x') - 0.5) * rgbSplit * intensity : 0;
  const offsetY = isGlitching ? (random(seed + 'y') - 0.5) * (rgbSplit / 2) * intensity : 0;

  const filterId = `glitch-filter-${layerId}`;
  
  const freqX = 0.001; 
  const freqY = 0.4 + (random(seed + 'freq') * 0.2);

  return (
    <>
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
          <filter id={filterId}>
            <feTurbulence 
              type="fractalNoise" 
              baseFrequency={`${freqX} ${freqY}`} 
              numOctaves="2" 
              seed={random(seed + 'noise') * 100} 
              result="noise" 
            />
            <feDisplacementMap 
              in="SourceGraphic" 
              in2="noise" 
              scale={isGlitching ? 40 * intensity : 2} 
              xChannelSelector="R" 
              yChannelSelector="G" 
            />
          </filter>
        </defs>
      </svg>

      <div
        style={{
          position: 'absolute',
          color,
          transform: `translate3d(${offsetX}px, ${offsetY}px, 0)`,
          filter: `url(#${filterId})`,
          fontFamily: settings.fontFamily,
          fontSize: `${settings.fontSize}px`,
          fontWeight: '900',
          textTransform: 'uppercase',
          textAlign: 'center',
          mixBlendMode: 'screen',
          whiteSpace: 'nowrap',
          opacity: isGlitching ? 0.8 : 0.4,
        }}
      >
        {settings.text}
      </div>
    </>
  );
};

export const GlitchText: React.FC<{ settings: ProjectSettings }> = ({ settings }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const config = settings.animationConfig;
  
  const globalFlickerSeed = `flicker-${Math.floor(frame / 2)}`;
  const globalOpacity = random(globalFlickerSeed) > 0.05 ? 1 : 0.2;

  const showWipe = random(globalFlickerSeed + 'wipe') > 0.93;
  const wipeY = interpolate(frame % 30, [0, 30], [-100, 200]);

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-transparent overflow-hidden">
      <div 
        className="relative flex items-center justify-center"
        style={{ 
          opacity: globalOpacity,
          width: '100%',
          height: '100%'
        }}
      >
        <GlitchLayer settings={settings} color="#ff0044" layerId="red" globalProgress={frame} />
        <GlitchLayer settings={settings} color="#00ffff" layerId="cyan" globalProgress={frame} />
        
        <div
          style={{
            position: 'relative',
            color: settings.color,
            fontFamily: settings.fontFamily,
            fontSize: `${settings.fontSize}px`,
            fontWeight: '900',
            textTransform: 'uppercase',
            textAlign: 'center',
            whiteSpace: 'nowrap',
            zIndex: 10,
          }}
        >
          {settings.text}
        </div>

        {showWipe && (
          <div 
            className="absolute left-0 w-full h-4 bg-white/20 blur-md pointer-events-none"
            style={{ top: `${wipeY}%` }}
          />
        )}
      </div>

      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.05]"
        style={{
          background: `repeating-linear-gradient(90deg, transparent, transparent 2px, #fff 3px)`,
          backgroundSize: '4px 100%'
        }}
      />
    </div>
  );
};