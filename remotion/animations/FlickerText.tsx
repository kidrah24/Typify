import React, { useMemo } from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, random, Easing } from 'remotion';
import { ProjectSettings } from '../../types';

const FlickerChar: React.FC<{
  char: string;
  index: number;
  settings: ProjectSettings;
}> = ({ char, index, settings }) => {
  const frame = useCurrentFrame();
  const config = settings.animationConfig;

  const randomOffset = useMemo(() => random(`offset-${index}`) * 15, [index]);
  const speed = config.speed ?? 1;
  const revealDuration = 45 / speed; 
  const stagger = 3 / speed; 
  const startFrame = index * stagger + randomOffset;

  const progress = interpolate(
    frame,
    [startFrame, startFrame + revealDuration],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.bezier(0.33, 1, 0.68, 1),
    }
  );

  const seed = `flicker-${index}-${frame}`;
  const rOpacity = random(seed + 'op');
  const rGlitch = random(seed + 'gl');
  const rScale = random(seed + 'sc');

  const flickerOpacity = useMemo(() => {
    if (progress === 0) return 0;
    const chaos = config.intensity ?? 1;
    const baseThreshold = 1 - progress;
    const noise = (random(`chaos-${index}-${Math.floor(frame / 2)}`) - 0.5) * 0.3 * chaos;
    const threshold = Math.max(0, Math.min(1, baseThreshold + noise));
    
    if (progress > 0.98) return rOpacity > 0.99 ? 0 : 1;
    return rOpacity > threshold ? 1 : 0;
  }, [progress, rOpacity, frame, index, config.intensity]);

  const isGlitching = rGlitch > 0.85 && flickerOpacity > 0;
  const jitterX = isGlitching ? (random(seed + 'ji') - 0.5) * (settings.fontSize * 0.15) : 0;
  const jitterY = isGlitching ? (random(seed + 'y') - 0.5) * (settings.fontSize * 0.05) : 0;
  
  const scale = flickerOpacity > 0 && progress < 1 ? 1 + (rScale - 0.5) * 0.2 : 1;

  const textShadow = useMemo(() => {
    if (!isGlitching) return 'none';
    const dist = rGlitch * 8;
    return `${dist}px 0 0 rgba(255,0,0,0.7), ${-dist}px 0 0 rgba(0,255,255,0.7)`;
  }, [isGlitching, rGlitch]);

  if (char === ' ') return <div style={{ width: '0.35em' }} />;

  return (
    <div
      style={{
        display: 'inline-block',
        position: 'relative',
        opacity: flickerOpacity,
        transform: `translate3d(${jitterX}px, ${jitterY}px, 0) scale(${scale})`,
        textShadow,
        fontFamily: settings.fontFamily,
        fontSize: `${settings.fontSize}px`,
        color: settings.color,
        fontWeight: '900',
        lineHeight: 1,
        margin: '0 0.01em',
        filter: isGlitching ? `brightness(${1.5 + rGlitch})` : 'none',
      }}
    >
      {char}
    </div>
  );
};

export const FlickerText: React.FC<{ settings: ProjectSettings }> = ({ settings }) => {
  const characters = useMemo(() => settings.text.toUpperCase().split(''), [settings.text]);

  return (
    <div className="flex items-center justify-center w-full h-full p-12 overflow-hidden bg-transparent">
      <div className="flex flex-wrap justify-center items-center" style={{ width: '100%', maxWidth: '92%', textAlign: 'center' }}>
        {characters.map((char, i) => (
          <FlickerChar key={`${i}-${char}`} char={char} index={i} settings={settings} />
        ))}
      </div>
    </div>
  );
};