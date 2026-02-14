import React from 'react';
import { AnimationType, BackgroundType, ProjectSettings } from '../types';
import { RollingText } from './animations/RollingText';
import { FlickerText } from './animations/FlickerText';
import { StepText } from './animations/StepText';
import { SplitText } from './animations/SplitText';
import { DisplacementText } from './animations/DisplacementText';
import { LiquidText } from './animations/LiquidText';
import { GlitchText } from './animations/GlitchText';
import { ShatteredText } from './animations/ShatterText';
import { HandwrittenText } from './animations/HandwrittenText';
import { BounceText } from './animations/BounceText';
import { DeepGlow } from './effects/DeepGlow';

const getBackgroundColor = (type: BackgroundType) => {
  switch (type) {
    case BackgroundType.BLACK: return '#000000';
    case BackgroundType.GREEN: return '#00ff00';
    case BackgroundType.TRANSPARENT: return 'transparent';
    default: return '#000000';
  }
};

export const MainComposition: React.FC<{ settings: ProjectSettings }> = ({ settings }) => {
  const renderAnimation = () => {
    switch (settings.animationType) {
      case AnimationType.ROLLING:
        return <RollingText settings={settings} />;
      case AnimationType.FLICKER:
        return <FlickerText settings={settings} />;
      case AnimationType.STEP:
        return <StepText settings={settings} />;
      case AnimationType.SPLIT:
        return <SplitText settings={settings} />;
      case AnimationType.DISPLACEMENT:
        return <DisplacementText settings={settings} />;
      case AnimationType.LIQUID:
        return <LiquidText settings={settings} />;
      case AnimationType.GLITCH:
        return <GlitchText settings={settings} />;
      case AnimationType.SHATTER:
        return <ShatteredText settings={settings} />;
      case AnimationType.HANDWRITTEN:
        return <HandwrittenText settings={settings} />;
      case AnimationType.BOUNCE:
        return <BounceText settings={settings} />;
      default:
        return (
          <div 
            className="flex items-center justify-center w-full h-full text-white/50 italic text-center p-10"
            style={{ 
                fontFamily: settings.fontFamily,
                fontSize: `${settings.fontSize}px`
            }}
          >
            {settings.animationType} Preset Placeholder
          </div>
        );
    }
  };

  return (
    <div 
      className="w-full h-full"
      style={{ backgroundColor: getBackgroundColor(settings.background) }}
    >
      <DeepGlow config={settings.glowConfig} color={settings.color}>
        {renderAnimation()}
      </DeepGlow>
    </div>
  );
};