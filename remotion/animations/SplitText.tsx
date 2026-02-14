import React, { useMemo } from 'react';
import { interpolate, useCurrentFrame, useVideoConfig, Easing } from 'remotion';
import { ProjectSettings } from '../../types';

export const SplitText: React.FC<{ settings: ProjectSettings }> = ({ settings }) => {
  const frame = useCurrentFrame();
  const config = settings.animationConfig;

  const startFrame = 30; 
  const openDuration = 90; 
  
  const progress = interpolate(
    frame - startFrame,
    [0, openDuration],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.bezier(0.25, 0.1, 0.25, 1), 
    }
  );

  const translateY = progress * (settings.fontSize * (config.distance ?? 0.8));
  const rotateX = progress * (config.rotation ?? 40);
  const opacity = interpolate(progress, [0, 0.2, 0.9, 1], [1, 1, 0, 0]);
  const entryOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });
  const containerHeight = settings.fontSize * 1.5;

  const commonStyles: React.CSSProperties = {
    fontFamily: settings.fontFamily,
    fontSize: `${settings.fontSize}px`,
    color: settings.color,
    fontWeight: '900',
    textAlign: 'center',
    textTransform: 'uppercase',
    lineHeight: 1,
    whiteSpace: 'nowrap',
    position: 'absolute',
    width: '100%',
    left: 0,
    top: 0,
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: opacity * entryOpacity,
    willChange: 'transform, opacity',
  };

  return (
    <div className="flex items-center justify-center w-full h-full bg-transparent perspective-[1000px]">
      <div 
        style={{ 
          position: 'relative', 
          width: '100%', 
          height: containerHeight,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <div
          style={{
            ...commonStyles,
            clipPath: 'inset(0 0 50% 0)',
            transform: `translateY(${-translateY}px) rotateX(${rotateX}deg)`,
            transformOrigin: 'bottom center',
          }}
        >
          {settings.text}
        </div>

        <div
          style={{
            ...commonStyles,
            clipPath: 'inset(50% 0 0 0)',
            transform: `translateY(${translateY}px) rotateX(${-rotateX}deg)`,
            transformOrigin: 'top center',
          }}
        >
          {settings.text}
        </div>
      </div>
    </div>
  );
};