import React, { useMemo } from 'react';
import { interpolate, useCurrentFrame, useVideoConfig, Easing, random } from 'remotion';
import { ProjectSettings } from '../../types';

const GlitchLayer: React.FC<{ 
  settings: ProjectSettings; 
  color: string; 
  offsetX: number; 
  offsetY: number;
  opacity: number;
  sliceProgress: number[];
  sliceCount: number;
}> = ({ settings, color, offsetX, offsetY, opacity, sliceProgress, sliceCount }) => {
  return (
    <div 
      className="absolute inset-0 flex items-center justify-center"
      style={{
        opacity,
        color,
        transform: `translate(${offsetX}px, ${offsetY}px)`,
        filter: `drop-shadow(0 0 15px ${color}66)`,
      }}
    >
      {Array.from({ length: sliceCount }).map((_, i) => {
        const top = (i / sliceCount) * 100;
        const bottom = 100 - ((i + 1) / sliceCount) * 100;
        const sliceShift = sliceProgress[i] || 0;

        return (
          <div
            key={i}
            className="absolute inset-0 flex items-center justify-center"
            style={{
              clipPath: `inset(${top}% 0 ${bottom}% 0)`,
              transform: `translateX(${sliceShift}px)`,
              fontFamily: settings.fontFamily,
              fontSize: `${settings.fontSize}px`,
              fontWeight: '900',
              textTransform: 'uppercase',
              lineHeight: 1,
              whiteSpace: 'nowrap',
            }}
          >
            {settings.text}
          </div>
        );
      })}
    </div>
  );
};

export const DisplacementText: React.FC<{ settings: ProjectSettings }> = ({ settings }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const config = settings.animationConfig;
  const sliceCount = config.count ?? 24;

  const entrance = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });
  const exit = interpolate(frame, [settings.duration * fps - 30, settings.duration * fps], [1, 0], { extrapolateLeft: 'clamp' });
  const globalOpacity = entrance * exit;

  const scanPos = (frame % (fps * 2)) / (fps * 2);

  const sliceDisplacement = useMemo(() => {
    return Array.from({ length: sliceCount }).map((_, i) => {
      const seed = `slice-${i}-${Math.floor(frame / 2)}`;
      const sliceY = i / sliceCount;
      const distToScan = Math.abs(sliceY - scanPos);
      const scanInfluence = distToScan < 0.15 ? interpolate(distToScan, [0, 0.15], [1, 0]) : 0;
      
      const jitter = (random(seed) - 0.5) * settings.fontSize * 0.1;
      const beamPush = (random(seed + 'beam') - 0.5) * settings.fontSize * 0.4 * scanInfluence;
      
      return (jitter + beamPush) * (config.intensity ?? 1);
    });
  }, [frame, scanPos, settings.fontSize, sliceCount, config.intensity]);

  const glitchIntensity = interpolate(random(`intensity-${Math.floor(frame / 3)}`), [0, 1], [1, 5]) * (config.intensity ?? 1);

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-transparent overflow-hidden">
      <GlitchLayer settings={settings} color="#00ffff" offsetX={-glitchIntensity * 2} offsetY={0} opacity={globalOpacity * 0.6} sliceProgress={sliceDisplacement.map(d => d * 1.2)} sliceCount={sliceCount} />
      <GlitchLayer settings={settings} color="#ff0044" offsetX={glitchIntensity * 2} offsetY={0} opacity={globalOpacity * 0.6} sliceProgress={sliceDisplacement.map(d => d * -1.2)} sliceCount={sliceCount} />
      <GlitchLayer settings={settings} color={settings.color} offsetX={0} offsetY={0} opacity={globalOpacity} sliceProgress={sliceDisplacement} sliceCount={sliceCount} />
    </div>
  );
};