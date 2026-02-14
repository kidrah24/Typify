import React from 'react';
import { spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { ProjectSettings } from '../../types';

export const BounceText: React.FC<{ settings: ProjectSettings }> = ({ settings }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bounce = spring({
    frame,
    fps,
    config: {
      damping: 12,
      stiffness: 100,
      mass: 0.8,
    },
  });

  // Squash and stretch logic
  const scaleY = bounce < 1 ? 1 + (1 - bounce) * 0.2 : 1;
  const scaleX = bounce < 1 ? 1 - (1 - bounce) * 0.2 : 1;

  const opacity = Math.min(frame / 10, 1);

  return (
    <div className="flex items-center justify-center w-full h-full">
      <div
        style={{
          fontFamily: settings.fontFamily,
          fontSize: `${settings.fontSize}px`,
          color: settings.color,
          fontWeight: '900',
          opacity,
          transform: `scale(${scaleX * bounce}, ${scaleY * bounce}) translateY(${(1 - bounce) * -100}px)`,
          textAlign: 'center'
        }}
      >
        {settings.text}
      </div>
    </div>
  );
};