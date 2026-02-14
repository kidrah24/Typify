import React, { useMemo } from 'react';
import { interpolate, useCurrentFrame, useVideoConfig, Easing, random } from 'remotion';
import { ProjectSettings } from '../../types';

const InkBleedFilter: React.FC = () => (
  <svg style={{ position: 'absolute', width: 0, height: 0 }}>
    <filter id="ink-bleed-pro" x="-50%" y="-50%" width="200%" height="200%">
      <feTurbulence type="fractalNoise" baseFrequency="0.15" numOctaves="4" seed="42" result="noise" />
      <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.8" xChannelSelector="R" yChannelSelector="G" />
      <feGaussianBlur in="SourceGraphic" stdDeviation="0.4" />
    </filter>
  </svg>
);

const HandwrittenChar: React.FC<{ 
  char: string; 
  index: number; 
  settings: ProjectSettings;
}> = ({ char, index, settings }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const config = settings.animationConfig;

  const writingSpeed = 25 / (config.speed || 1); 
  const stagger = 10 / (config.speed || 1);
  const startFrame = index * stagger;
  
  const progress = interpolate(
    frame,
    [startFrame, startFrame + writingSpeed],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.bezier(0.45, 0.05, 0.55, 0.95),
    }
  );

  const isWriting = progress > 0 && progress < 1;
  const isRound = ['a', 'o', 'e', 'c', 'd', 'g', 'p', 'q', 'u', 's'].includes(char.toLowerCase());
  
  const pathData = useMemo(() => {
    if (isRound) return "M 80 80 Q 50 10 20 80 T 80 20";
    return "M 20 10 L 40 90 L 10 50 L 90 50";
  }, [isRound]);

  const pressure = interpolate(progress, [0, 0.2, 0.5, 0.8, 1], [0.8, 1.4, 1.6, 1.2, 0.9]);
  const strokeWidth = settings.fontSize * 1.2 * pressure * (config.intensity ?? 1);

  const penX = interpolate(progress, [0, 1], [10, 90]);
  const penY = interpolate(progress, [0, 0.5, 1], [10, 90, 50]);

  const jitterX = isWriting ? (random(`jx-${index}-${frame}`) - 0.5) * 1.5 : 0;
  const jitterY = isWriting ? (random(`jy-${index}-${frame}`) - 0.5) * 1.5 : 0;

  if (char === ' ') return <div style={{ width: '0.45em' }} />;

  const maskId = `ink-mask-${index}`;

  return (
    <div
      style={{
        display: 'inline-block',
        position: 'relative',
        filter: 'url(#ink-bleed-pro)',
        transform: `translate(${jitterX}px, ${jitterY}px)`,
        marginRight: '-0.05em'
      }}
    >
      <svg
        width={settings.fontSize * 0.9}
        height={settings.fontSize * 1.3}
        viewBox="0 0 100 100"
        style={{ overflow: 'visible' }}
      >
        <defs>
          <mask id={maskId}>
            <path
              d={pathData}
              fill="none"
              stroke="white"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="400"
              strokeDashoffset={400 - (progress * 400)}
            />
          </mask>
        </defs>

        <text
          x="50%"
          y="75%"
          textAnchor="middle"
          mask={`url(#${maskId})`}
          style={{
            fontFamily: settings.fontFamily,
            fontSize: '85px',
            fill: settings.color,
            fontWeight: 'normal',
            filter: isWriting ? 'blur(0.4px)' : 'none'
          }}
        >
          {char}
        </text>

        {isWriting && (
          <g style={{ filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.15))' }}>
            <circle cx={penX} cy={penY} r={strokeWidth / 12} fill={settings.color} opacity={0.9} />
          </g>
        )}
      </svg>
    </div>
  );
};

export const HandwrittenText: React.FC<{ settings: ProjectSettings }> = ({ settings }) => {
  const characters = useMemo(() => settings.text.split(''), [settings.text]);
  
  return (
    <div className="relative flex items-center justify-center w-full h-full p-20 overflow-hidden">
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: `url("https://www.transparenttextures.com/patterns/natural-paper.png")`,
          backgroundColor: '#fffcf5',
          filter: 'contrast(110%)'
        }}
      />
      <InkBleedFilter />
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'baseline', width: '100%', maxWidth: '85%' }}>
        {characters.map((char, i) => (
          <HandwrittenChar key={`${i}-${char}`} char={char} index={i} settings={settings} />
        ))}
      </div>
    </div>
  );
};