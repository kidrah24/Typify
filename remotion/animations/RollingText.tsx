import React, { useMemo } from 'react';
import { interpolate, useCurrentFrame, useVideoConfig, Easing } from 'remotion';
import { ProjectSettings } from '../../types';

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%";

const RollingLetter: React.FC<{ 
  char: string, 
  index: number, 
  settings: ProjectSettings 
}> = ({ char, index, settings }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const config = settings.animationConfig;
  
  const stagger = 1.0; 
  const rollDuration = (fps * 1.0) / (config.speed || 1); 
  const startFrame = index * stagger;
  
  const reelLength = 12;
  const reel = useMemo(() => {
    if (char === ' ') return [' '];
    const chars = [];
    for (let i = 0; i < reelLength - 1; i++) {
      chars.push(ALPHABET[Math.floor(Math.random() * ALPHABET.length)]);
    }
    chars.push(char); 
    return chars;
  }, [char]);

  const progress = interpolate(
    frame,
    [startFrame, startFrame + rollDuration],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.bezier(0.2, 1, 0.3, 1), 
    }
  );

  const height = settings.fontSize * 1.1;
  const translateY = -progress * (height * (reelLength - 1));
  
  const maxBlur = config.blur ?? 4;
  const blurAmount = interpolate(
    progress,
    [0, 0.2, 0.5, 0.8, 1],
    [0, maxBlur * 0.7, maxBlur, maxBlur * 0.5, 0]
  );

  if (char === ' ') {
    return <div style={{ width: '0.3em', flexShrink: 0 }} />;
  }

  return (
    <div 
      style={{
        height: height,
        position: 'relative',
        display: 'inline-flex',
        flexDirection: 'column',
        flexShrink: 0,
        overflow: 'hidden',
        filter: `blur(${blurAmount}px)`,
        transform: 'translateZ(0)',
      }}
    >
      <div style={{ visibility: 'hidden', height: 0, overflow: 'hidden' }}>{char}</div>
      <div style={{ visibility: 'hidden', pointerEvents: 'none' }}>{char}</div>

      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          transform: `translate3d(0, ${translateY}px, 0)`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          lineHeight: `${height}px`,
          willChange: 'transform',
        }}
      >
        {reel.map((r, i) => (
          <div key={i} style={{ height: height, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', textAlign: 'center' }}>{r}</div>
        ))}
      </div>
    </div>
  );
};

export const RollingText: React.FC<{ settings: ProjectSettings }> = ({ settings }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const config = settings.animationConfig;

  const upperText = useMemo(() => settings.text.toUpperCase(), [settings.text]);
  const characters = useMemo(() => upperText.split(''), [upperText]);
  
  const fontSizeScale = settings.fontSize;
  const wordHeight = fontSizeScale * 1.1;
  const gapBetweenLines = fontSizeScale * 0.4;
  const totalStepHeight = wordHeight + gapBetweenLines;

  const loopStartFrame = fps * 1.2;
  const loopDuration = (fps * 3.5) / (config.speed || 1); 
  
  const loopProgress = frame < loopStartFrame ? 0 : interpolate(
    (frame - loopStartFrame) % loopDuration,
    [0, loopDuration],
    [0, -totalStepHeight],
    { easing: Easing.linear }
  );

  return (
    <div className="flex items-center justify-center w-full h-full overflow-hidden bg-transparent">
      <div 
        style={{
          height: wordHeight * 2.5,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: settings.fontFamily,
          fontSize: `${fontSizeScale}px`,
          color: settings.color,
          fontWeight: '900',
          letterSpacing: '-0.05em',
          maskImage: 'linear-gradient(to bottom, transparent, black 25%, black 75%, transparent)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 25%, black 75%, transparent)',
        }}
      >
        <div 
          style={{
            transform: `translate3d(0, ${loopProgress}px, 0)`,
            display: 'flex',
            flexDirection: 'column',
            gap: `${gapBetweenLines}px`,
            willChange: 'transform',
          }}
        >
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'row', gap: 0, height: wordHeight, justifyContent: 'center', alignItems: 'center', whiteSpace: 'nowrap', width: 'max-content' }}>
              {characters.map((char, charIdx) => (
                <RollingLetter key={`${i}-${charIdx}`} char={char} index={charIdx} settings={settings} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};