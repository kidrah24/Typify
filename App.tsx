import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Player } from '@remotion/player';
import { MainComposition } from './remotion/Composition';
import { 
  ProjectSettings, 
  AnimationType, 
  BackgroundType, 
  ResolutionType 
} from './types';
import { RESOLUTION_MAP } from './constants';

const App: React.FC = () => {
  const [settings, setSettings] = useState<ProjectSettings>({
    text: 'DEEP GLOW',
    animationType: AnimationType.FLICKER,
    fontFamily: 'Bebas Neue',
    fontSize: 100,
    color: '#FFFFFF',
    background: BackgroundType.BLACK,
    resolution: ResolutionType.LANDSCAPE,
    duration: 5, 
    fps: 60,
    easing: 'ease-in-out',
    animationConfig: {
      intensity: 1,
      speed: 1,
      blur: 4,
      skew: -10,
      distance: 0.8,
      rotation: 40,
      viscosity: 8,
      count: 24
    },
    glowConfig: {
      enabled: false,
      radius: 40,
      intensity: 1.5,
      exposure: 1.2,
      chromaticAberration: 0.5,
      color: '#FFFFFF'
    }
  });

  const [isDownloading, setIsDownloading] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [email, setEmail] = useState('');
  const [isJoined, setIsJoined] = useState(false);

  useEffect(() => {
    const joined = localStorage.getItem('motiontext_joined');
    if (!joined) {
      const timer = setTimeout(() => setShowJoinModal(true), 2000);
      return () => clearTimeout(timer);
    } else {
      setIsJoined(true);
    }
  }, []);

  const dimensions = useMemo(() => RESOLUTION_MAP[settings.resolution], [settings.resolution]);

  const handleDownload = useCallback(() => {
    if (!isJoined) {
      setShowJoinModal(true);
      return;
    }
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      setShowDownloadModal(true);
    }, 3000);
  }, [isJoined]);

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) return;
    localStorage.setItem('motiontext_joined', 'true');
    setIsJoined(true);
    setShowJoinModal(false);
  };

  return (
    <div className="flex h-screen bg-[#050505] text-white overflow-hidden font-sans selection:bg-blue-500/30">
      {/* Precision Header */}
      <header className="fixed top-0 left-0 right-0 h-16 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-md z-40 flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-blue-900/40">T</div>
          <div className="flex flex-col">
            <span className="font-bold tracking-tight text-base leading-none">Typify</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
           {!isJoined && (
             <button 
               onClick={() => setShowJoinModal(true)}
               className="px-4 py-1.5 bg-blue-600/10 border border-blue-500/20 rounded-full text-[11px] font-bold text-blue-400 hover:bg-blue-600 hover:text-white transition-all uppercase tracking-widest"
             >
               Sign Up
             </button>
           )}
        </div>
      </header>

      <div className="flex flex-1 pt-16 h-full">
        <Sidebar 
          settings={settings} 
          setSettings={setSettings} 
          onDownload={handleDownload}
          isDownloading={isDownloading}
        />

        <main className="flex-1 flex flex-col items-center justify-center p-12 bg-[#020202] relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/5 via-transparent to-transparent pointer-events-none"></div>
          
          <div className="relative group w-full max-w-5xl">
            <div className="absolute -inset-12 bg-gradient-to-r from-blue-600/5 to-indigo-600/5 rounded-[60px] blur-[100px] opacity-30 pointer-events-none"></div>
            
            <div className="relative bg-[#000] rounded-2xl overflow-hidden shadow-[0_0_120px_rgba(0,0,0,0.9)] ring-1 ring-white/[0.08] p-1">
              <Player
                component={MainComposition}
                durationInFrames={settings.duration * settings.fps}
                compositionWidth={dimensions.width}
                compositionHeight={dimensions.height}
                fps={settings.fps}
                inputProps={{ settings }}
                style={{
                  width: '100%', 
                  maxHeight: '70vh',
                  aspectRatio: `${dimensions.width}/${dimensions.height}`
                }}
                controls
                autoPlay
                loop
              />
            </div>

            <div className="mt-10 flex items-center justify-between px-6 text-[10px] text-gray-500 font-mono uppercase tracking-[0.2em]">
              <div className="flex items-center gap-8">
                <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></span>{settings.resolution}</span>
                <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>{settings.fps} FPS</span>
                <span className="text-white/30">{settings.animationType}</span>
              </div>
              <div className="flex items-center gap-3 py-1 px-3 bg-white/5 rounded-full border border-white/5">
                <span className="animate-pulse inline-block w-1.5 h-1.5 rounded-full bg-red-500"></span>
                Engine Active
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Simplified Join Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/95 backdrop-blur-md animate-in fade-in duration-500">
          <div className="relative bg-[#0d0d0f] border border-white/10 rounded-[32px] p-12 max-w-sm w-full shadow-[0_0_150px_rgba(0,0,0,1)] text-center overflow-hidden">
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-blue-600/20 blur-[60px] rounded-full"></div>
            
            <div className="relative">
              <h2 className="text-2xl font-black tracking-tighter mb-2 uppercase">Sign Up</h2>
              <p className="text-gray-500 mb-8 text-sm">
                Sign up using your email
              </p>

              <form onSubmit={handleJoin} className="space-y-4">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-center"
                />
                <button 
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-500 p-4 rounded-2xl font-bold transition-all transform active:scale-[0.98] shadow-2xl shadow-blue-600/30 text-sm uppercase tracking-widest"
                >
                  Continue
                </button>
              </form>

              <button 
                onClick={() => setShowJoinModal(false)}
                className="mt-6 text-[10px] text-white/20 hover:text-white/40 uppercase font-black tracking-[0.2em] transition-colors"
              >
                Skip for now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Download Success Modal */}
      {showDownloadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-[#0d0d0f] border border-white/10 rounded-[32px] p-12 max-sm w-full shadow-[0_0_100px_rgba(0,0,0,1)] text-center scale-in-center">
            <div className="w-20 h-20 bg-blue-500/10 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-8 ring-1 ring-blue-500/20 shadow-inner">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-black tracking-tighter mb-4 uppercase">Master Ready</h2>
            <div className="space-y-4">
              <button 
                onClick={() => setShowDownloadModal(false)}
                className="w-full bg-blue-600 hover:bg-blue-500 p-4 rounded-2xl font-bold transition-all transform active:scale-[0.98] flex items-center justify-center gap-3 shadow-2xl shadow-blue-600/30 text-sm uppercase tracking-widest"
              >
                Download MP4
              </button>
              <button 
                onClick={() => setShowDownloadModal(false)}
                className="w-full bg-white/5 hover:bg-white/10 p-4 rounded-2xl font-bold transition-all border border-white/5 text-[10px] uppercase tracking-widest text-gray-400"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;