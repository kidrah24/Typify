import React, { useMemo } from 'react';
import { interpolate, useCurrentFrame, useVideoConfig, Easing, random } from 'remotion';
import { ProjectSettings } from '../../types';

const SHATTER_DELAY = 60; 
const REPETITIONS = 16;   
const FORCE_STRENGTH = 0.03; 
const ROT_SPEED = 0.15;   

interface Shard {
  id: string;
  points: string;
  velocity: { x: number; y: number };
  rotVelocity: { x: number; y: number; z: number };
  distance: number;
}

export const ShatteredText: React.FC<{ settings: ProjectSettings }> = ({ settings }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const shards = useMemo(() => {
    const s: Shard[] = [];
    const centerX = 50;
    const centerY = 50;
    
    for (let i = 0; i < REPETITIONS; i++) {
      for (let j = 0; j < REPETITIONS; j++) {
        const id = `glass-shard-${i}-${j}`;
        
        const xBase = (i / REPETITIONS) * 100;
        const yBase = (j / REPETITIONS) * 100;
        const step = 100 / REPETITIONS;

        const jtr = (seed: string) => (random(id + seed) - 0.5) * (step * 0.9);
        
        const p1 = `${xBase + jtr('1')},${yBase + jtr('2')}`;
        const p2 = `${xBase + step + jtr('3')},${yBase + jtr('4')}`;
        const p3 = `${xBase + step + jtr('5')},${yBase + step + jtr('6')}`;
        const p4 = `${xBase + jtr('7')},${yBase + step + jtr('8')}`;

        const dx = (xBase + step / 2) - centerX;
        const dy = (yBase + step / 2) - centerY;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;

        s.push({
          id,
          points: `${p1} ${p2} ${p3} ${p4}`,
          distance: dist,
          velocity: {
            x: (dx / dist) * FORCE_STRENGTH * 400,
            y: (dy / dist) * FORCE_STRENGTH * 300,
          },
          rotVelocity: {
            x: (random(id + 'rx') - 0.5) * ROT_SPEED * 150,
            y: (random(id + 'ry') - 0.5) * ROT_SPEED * 150,
            z: (random(id + 'rz') - 0.5) * ROT_SPEED * 300,
          }
        });
      }
    }
    return s;
  }, []);

  const progress = interpolate(
    frame - SHATTER_DELAY,
    [0, 180], 
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.out(Easing.quad),
    }
  );

  const isShattered = frame >= SHATTER_DELAY;

  return (
    <div className="flex items-center justify-center w-full h-full overflow-hidden bg-transparent perspective-[1500px]">
      <div 
        className="relative flex items-center justify-center"
        style={{
          width: '95%',
          height: '50%',
          transformStyle: 'preserve-3d',
        }}
      >
        <div className="absolute inset-0" style={{ transformStyle: 'preserve-3d' }}>
          {shards.map((shard) => {
            const tx = isShattered ? shard.velocity.x * progress : 0;
            const ty = isShattered ? shard.velocity.y * progress : 0;
            const tz = isShattered ? progress * -100 : 0; 

            const rx = isShattered ? shard.rotVelocity.x * progress : 0;
            const ry = isShattered ? shard.rotVelocity.y * progress : 0;
            const rz = isShattered ? shard.rotVelocity.z * progress : 0;

            const opacity = interpolate(progress, [0.8, 1], [1, 0.2]);

            return (
              <div
                key={shard.id}
                className="absolute inset-0"
                style={{
                  clipPath: `polygon(${shard.points})`,
                  transform: `translate3d(${tx}px, ${ty}px, ${tz}px) rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg)`,
                  transformStyle: 'preserve-3d',
                  opacity: isShattered ? opacity : 1,
                  willChange: 'transform',
                }}
              >
                <div style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: settings.fontFamily,
                  fontSize: `${settings.fontSize}px`,
                  color: settings.color,
                  fontWeight: '900',
                  textTransform: 'uppercase',
                  letterSpacing: '0.02em',
                  textAlign: 'center',
                  whiteSpace: 'pre-wrap',
                  lineHeight: 1.1,
                  filter: isShattered ? `brightness(${0.9 + (shard.distance / 100) * 0.2})` : 'none',
                }}>
                  {settings.text}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};