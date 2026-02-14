import React, { useMemo } from 'react';
import { interpolate, useCurrentFrame, useVideoConfig, Easing, random } from 'remotion';
import { ProjectSettings } from '../../types';

const LiquidDrip: React.FC<{ 
  index: number; 
  settings: ProjectSettings;
}> = ({ index, settings }) => {
  const frame = useCurrentFrame();
  const config = settings.animationConfig;

  const seed = `drip-char-${index}`;
  const delay = (random(seed + 'delay') * 30);
  const duration = (80 + (random(seed + 'dur') * 40)) / (config.speed || 1);
  
  const progress = interpolate(
    frame - delay,
    [0, duration * 0.4, duration],
    [0, 1, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.bezier(0.45, 0, 0.55, 1),
    }
  );

  const baseDripHeight = settings.fontSize * (1.2 + random(seed + 'h') * 1.2);
  const dripWidth = (settings.fontSize * 0.15) + (random(seed + 'w') * settings.fontSize * 0.2);
  const dripHeight = baseDripHeight * (config.intensity ?? 1);
  const xOffset = (random(seed + 'x') - 0.5) * 40;

  if (progress <= 0) return null;

  return (
    <div
      style={{
        position: 'absolute',
        left: `calc(50% + ${xOffset}px)`,
        top: '60%', 
        width: dripWidth,
        height: dripHeight * progress,
        backgroundColor: settings.color,
        borderRadius: `0 0 ${dripWidth}px ${dripWidth}px`,
        transform: 'translateX(-50%)',
        transformOrigin: 'top center',
        filter: 'blur(1px)', 
      }}
    />
  );
};

const LiquidCharacter: React.FC<{
  char: string;
  index: number;
  settings: ProjectSettings;
}> = ({ char, index, settings }) => {
  const drips = useMemo(() => [0, 1], []);

  return (
    <div 
      style={{ 
        position: 'relative', 
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: char === ' ' ? '0.3em' : '0.6em',
      }}
    >
      <span style={{ position: 'relative', zIndex: 2 }}>{char}</span>
      {char !== ' ' && drips.map((d) => (
        <LiquidDrip 
          key={d} 
          index={index * 10 + d} 
          settings={settings} 
        />
      ))}
    </div>
  );
};

export const LiquidText: React.FC<{ settings: ProjectSettings }> = ({ settings }) => {
  const characters = useMemo(() => settings.text.split(''), [settings.text]);
  const filterId = "liquid-goo-filter-v3";
  const viscosity = settings.animationConfig.viscosity ?? 8;

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-transparent overflow-hidden">
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
          <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation={viscosity} result="blur" />
            <feColorMatrix 
              in="blur" 
              mode="matrix" 
              values={`1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 ${viscosity * 3} -${viscosity}`} 
              result="goo" 
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      <div 
        style={{ 
          filter: `url(#${filterId})`,
          position: 'relative',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: settings.fontFamily,
          fontSize: `${settings.fontSize}px`,
          color: settings.color,
          fontWeight: '900',
          textTransform: 'uppercase',
          letterSpacing: '0.02em',
          whiteSpace: 'pre',
        }}
      >
        {characters.map((char, i) => (
          <LiquidCharacter 
            key={`${i}-${char}`} 
            char={char} 
            index={i} 
            settings={settings} 
          />
        ))}
      </div>
    </div>
  );
};