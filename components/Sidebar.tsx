import React from 'react';
import { AnimationType, BackgroundType, ResolutionType, ProjectSettings } from '../types';
import { FONTS } from '../constants';

interface SidebarProps {
  settings: ProjectSettings;
  setSettings: (s: ProjectSettings) => void;
  onDownload: () => void;
  isDownloading: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ settings, setSettings, onDownload, isDownloading }) => {
  const handleChange = (key: keyof ProjectSettings, value: any) => {
    setSettings({ ...settings, [key]: value });
  };

  const handleConfigChange = (key: string, value: number) => {
    setSettings({
      ...settings,
      animationConfig: {
        ...settings.animationConfig,
        [key]: value
      }
    });
  };

  const handleGlowChange = (key: string, value: any) => {
    setSettings({
      ...settings,
      glowConfig: {
        ...settings.glowConfig,
        [key]: value
      }
    });
  };

  const renderEffectParams = () => {
    const config = settings.animationConfig;

    switch (settings.animationType) {
      case AnimationType.GLITCH:
        return (
          <>
            <ParamSlider label="Glitch Force" value={config.intensity ?? 1} min={0.1} max={5} step={0.1} onChange={(v) => handleConfigChange('intensity', v)} />
            <ParamSlider label="RGB Split" value={config.rgbSplit ?? 15} min={0} max={100} step={1} onChange={(v) => handleConfigChange('rgbSplit', v)} />
          </>
        );
      case AnimationType.LIQUID:
        return (
          <>
            <ParamSlider label="Viscosity (Goo)" value={config.viscosity ?? 8} min={2} max={18} step={1} onChange={(v) => handleConfigChange('viscosity', v)} />
            <ParamSlider label="Drip Intensity" value={config.intensity ?? 1} min={0.2} max={3} step={0.1} onChange={(v) => handleConfigChange('intensity', v)} />
          </>
        );
      case AnimationType.HANDWRITTEN:
        return (
          <>
            <ParamSlider label="Write Speed" value={config.speed ?? 1} min={0.1} max={3} step={0.1} onChange={(v) => handleConfigChange('speed', v)} />
            <ParamSlider label="Ink Width" value={config.intensity ?? 1} min={0.5} max={3} step={0.1} onChange={(v) => handleConfigChange('intensity', v)} />
          </>
        );
      case AnimationType.DISPLACEMENT:
        return (
          <>
            <ParamSlider label="Glitch Intensity" value={config.intensity ?? 1} min={0.1} max={5} step={0.1} onChange={(v) => handleConfigChange('intensity', v)} />
            <ParamSlider label="Slice Count" value={config.count ?? 24} min={4} max={64} step={1} onChange={(v) => handleConfigChange('count', v)} />
          </>
        );
      case AnimationType.ROLLING:
        return (
          <>
            <ParamSlider label="Roll Speed" value={config.speed ?? 1} min={0.2} max={3} step={0.1} onChange={(v) => handleConfigChange('speed', v)} />
            <ParamSlider label="Motion Blur" value={config.blur ?? 4} min={0} max={10} step={1} onChange={(v) => handleConfigChange('blur', v)} />
          </>
        );
      case AnimationType.STEP:
        return (
          <>
            <ParamSlider label="Steps per Sec" value={config.speed ?? 12} min={4} max={60} step={1} onChange={(v) => handleConfigChange('speed', v)} />
            <ParamSlider label="Skew Angle" value={config.skew ?? -10} min={-45} max={45} step={1} onChange={(v) => handleConfigChange('skew', v)} />
          </>
        );
      case AnimationType.SPLIT:
        return (
          <>
            <ParamSlider label="Split Distance" value={config.distance ?? 0.8} min={0} max={2} step={0.1} onChange={(v) => handleConfigChange('distance', v)} />
            <ParamSlider label="3D Rotation" value={config.rotation ?? 40} min={0} max={90} step={1} onChange={(v) => handleConfigChange('rotation', v)} />
          </>
        );
      case AnimationType.FLICKER:
        return (
          <>
            <ParamSlider label="Flicker Frequency" value={config.speed ?? 1} min={0.1} max={3} step={0.1} onChange={(v) => handleConfigChange('speed', v)} />
            <ParamSlider label="Chaos Level" value={config.intensity ?? 1} min={0} max={2} step={0.1} onChange={(v) => handleConfigChange('intensity', v)} />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-80 h-full bg-[#111] border-r border-white/10 p-6 flex flex-col gap-6 overflow-y-auto pb-20">
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Text Content</label>
        <textarea
          value={settings.text}
          onChange={(e) => handleChange('text', e.target.value)}
          className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-sm focus:ring-1 focus:ring-blue-500 outline-none h-20 resize-none font-medium"
          placeholder="Enter custom text..."
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Animation Preset</label>
        <select
          value={settings.animationType}
          onChange={(e) => handleChange('animationType', e.target.value as AnimationType)}
          className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-sm focus:ring-1 focus:ring-blue-500 outline-none appearance-none"
        >
          {Object.values(AnimationType).map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-3 p-4 bg-white/5 border border-white/5 rounded-xl">
        <label className="text-xs font-bold text-blue-500 uppercase tracking-wider mb-1">Effect Parameters</label>
        {renderEffectParams()}
      </div>

      {/* Deep Glow Section */}
      <div className="flex flex-col gap-4 p-4 bg-yellow-500/5 border border-yellow-500/10 rounded-xl">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-yellow-500 uppercase tracking-wider">Deep Glow</label>
          <button 
            onClick={() => handleGlowChange('enabled', !settings.glowConfig.enabled)}
            className={`w-10 h-5 rounded-full transition-all relative ${settings.glowConfig.enabled ? 'bg-yellow-500' : 'bg-gray-700'}`}
          >
            <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${settings.glowConfig.enabled ? 'left-6' : 'left-1'}`}></div>
          </button>
        </div>
        
        {settings.glowConfig.enabled && (
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-gray-400 font-medium">Glow Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={settings.glowConfig.color}
                  onChange={(e) => handleGlowChange('color', e.target.value)}
                  className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-none p-0 overflow-hidden"
                />
                <input
                  type="text"
                  value={settings.glowConfig.color}
                  onChange={(e) => handleGlowChange('color', e.target.value)}
                  className="flex-1 bg-black/50 border border-white/10 rounded-lg p-2 text-[10px] focus:ring-1 focus:ring-yellow-500 outline-none uppercase font-mono"
                />
              </div>
            </div>
            <ParamSlider label="Radius" value={settings.glowConfig.radius} min={1} max={100} step={1} onChange={(v) => handleGlowChange('radius', v)} />
            <ParamSlider label="Exposure" value={settings.glowConfig.exposure} min={0.5} max={3} step={0.1} onChange={(v) => handleGlowChange('exposure', v)} />
            <ParamSlider label="Intensity" value={settings.glowConfig.intensity} min={0.1} max={5} step={0.1} onChange={(v) => handleGlowChange('intensity', v)} />
            <ParamSlider label="Chromatic" value={settings.glowConfig.chromaticAberration} min={0} max={2} step={0.1} onChange={(v) => handleGlowChange('chromaticAberration', v)} />
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Font Family</label>
          <select
            value={settings.fontFamily}
            onChange={(e) => handleChange('fontFamily', e.target.value)}
            className="w-full bg-black/50 border border-white/10 rounded-lg p-2 text-xs focus:ring-1 focus:ring-blue-500 outline-none"
          >
            {FONTS.map((font) => (
              <option key={font} value={font}>{font}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Font Size</label>
          <input
            type="number"
            min="50"
            max="500"
            value={settings.fontSize || ''}
            onChange={(e) => {
              const val = Math.max(0, Math.min(500, parseInt(e.target.value) || 0));
              handleChange('fontSize', val);
            }}
            className="w-full bg-black/50 border border-white/10 rounded-lg p-2 text-xs focus:ring-1 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Colors</label>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={settings.color}
            onChange={(e) => handleChange('color', e.target.value)}
            className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-none p-0 overflow-hidden"
          />
          <input
            type="text"
            value={settings.color}
            onChange={(e) => handleChange('color', e.target.value)}
            className="flex-1 bg-black/50 border border-white/10 rounded-lg p-2 text-xs focus:ring-1 focus:ring-blue-500 outline-none uppercase font-mono"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Background</label>
        <div className="grid grid-cols-3 gap-2">
          {Object.values(BackgroundType).map((bg) => (
            <button
              key={bg}
              onClick={() => handleChange('background', bg)}
              className={`py-2 text-[10px] font-bold rounded-lg border transition-all ${
                settings.background === bg 
                  ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/40' 
                  : 'bg-black/30 border-white/10 text-gray-400 hover:border-white/20'
              }`}
            >
              {bg.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={onDownload}
        disabled={isDownloading}
        className={`mt-6 p-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
          isDownloading 
            ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
            : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-900/20 active:scale-95'
        }`}
      >
        {isDownloading ? (
          <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Rendering High-Fidelity</>
        ) : (
          <><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg> Download MP4</>
        )}
      </button>
    </div>
  );
};

const ParamSlider: React.FC<{ label: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void }> = ({ label, value, min, max, step, onChange }) => (
  <div className="flex flex-col gap-1">
    <div className="flex justify-between items-center">
      <span className="text-[10px] text-gray-400 font-medium">{label}</span>
      <span className="text-[10px] text-blue-400 font-mono">{value}</span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500"
    />
  </div>
);