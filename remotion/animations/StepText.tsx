import React, { useMemo } from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { ProjectSettings } from '../../types';

export const StepText: React.FC<{ settings: ProjectSettings }> = ({ settings }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const config = settings.animationConfig;

  const stepsPerSecond = config.speed ?? 12;
  const framesPerStep = Math.max(1, fps / stepsPerSecond);
  const steppedFrame = Math.floor(frame / framesPerStep);

  const rowHeight = settings.fontSize * 1.15;
  const pixelsPerStep = settings.fontSize * 0.15; 
  
  const verticalShift = (steppedFrame * pixelsPerStep) % rowHeight;

  const repeatedText = useMemo(() => {
    const base = settings.text.toUpperCase() + "  •  ";
    return new Array(12).fill(base).join("");
  }, [settings.text]);

  const rowCount = Math.ceil((height * 2) / rowHeight) + 4;
  const rows = useMemo(() => Array.from({ length: rowCount }), [rowCount]);
  
  const skewAngle = config.skew ?? -10;

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-transparent overflow-hidden">
      <div 
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          transform: `rotate(-8deg) skewX(${skewAngle}deg) scale(1.2)`,
          width: '250%', 
          fontFamily: settings.fontFamily,
          fontSize: `${settings.fontSize}px`,
          color: settings.color,
          fontWeight: '900',
          lineHeight: 1.1,
          whiteSpace: 'nowrap',
          textTransform: 'uppercase',
          willChange: 'transform',
        }}
      >
        <div 
          style={{
            display: 'flex',
            flexDirection: 'column',
            transform: `translate3d(0, ${-verticalShift}px, 0)`,
          }}
        >
          {rows.map((_, i) => {
            const isEven = i % 2 === 0;
            const horizontalOffset = isEven ? -settings.fontSize * 0.5 : 0;
            
            return (
              <div
                key={i}
                style={{
                  height: rowHeight,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: `translateX(${horizontalOffset}px)`,
                  opacity: interpolate(frame % framesPerStep, [0, 1], [0.95, 1]),
                }}
              >
                {repeatedText}
              </div>
            );
          })}
        </div>
      </div>
      
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          background: `repeating-linear-gradient(0deg, transparent, transparent 1px, #fff 2px)`,
          backgroundSize: '100% 3px'
        }}
      />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/20 via-transparent to-black/20" />
    </div>
  );
};