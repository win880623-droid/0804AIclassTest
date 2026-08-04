import React from 'react';
import { Volume2, VolumeX, History, Sparkles, RefreshCw, Key } from 'lucide-react';
import { DeityInfo } from '../types';

interface HeaderProps {
  currentDeity: DeityInfo;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenHistory: () => void;
  onReset: () => void;
  onOpenDailyModal: () => void;
  onOpenApiKeyModal: () => void;
  hasCustomApiKey: boolean;
  historyCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentDeity,
  soundEnabled,
  onToggleSound,
  onOpenHistory,
  onReset,
  onOpenDailyModal,
  onOpenApiKeyModal,
  hasCustomApiKey,
  historyCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#0a0a0c]/90 backdrop-blur-md border-b border-[#D4AF37]/20 px-4 py-3.5 text-[#e0d8cc] shadow-2xl">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        
        {/* Brand & Logo */}
        <button 
          onClick={onReset}
          className="flex items-center gap-3.5 group text-left focus:outline-none cursor-pointer"
        >
          <div className="w-9 h-9 border border-[#D4AF37] rotate-45 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-[#D4AF37]/10 transition-all">
            <span className="-rotate-45 text-[#D4AF37] font-bold text-xs tracking-tighter">AI</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-lg md:text-xl font-light tracking-[0.2em] text-[#fcf9f2]">
                靈犀 · 萬象詩籤
              </h1>
              <span className="text-[9px] px-1.5 py-0.5 rounded-none bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 tracking-widest uppercase">
                Oracle
              </span>
            </div>
            <p className="text-[10px] tracking-[0.3em] uppercase opacity-50 hidden sm:block">
              Universal AI Oracle System
            </p>
          </div>
        </button>

        {/* Current Active Deity Badge */}
        <div className="hidden md:flex items-center gap-2.5 px-3.5 py-1.5 rounded-none bg-white/5 border border-[#D4AF37]/30 text-xs text-[#e0d8cc]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-ping" />
          <span className="text-white/40 uppercase tracking-widest text-[10px]">主尊神明</span>
          <span className="text-[#D4AF37] font-serif italic text-sm">{currentDeity.name}</span>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          
          {/* API Key Setting Button */}
          <button
            onClick={onOpenApiKeyModal}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-none border text-xs font-serif tracking-widest transition-all cursor-pointer ${
              hasCustomApiKey
                ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#D4AF37]'
                : 'bg-white/5 hover:bg-[#D4AF37]/10 border-white/20 text-white/80'
            }`}
            title="設定個人 Gemini API Key"
          >
            <Key className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="hidden sm:inline">
              {hasCustomApiKey ? '已設 API KEY' : '設定 API KEY'}
            </span>
          </button>

          {/* Daily Fortune Button */}
          <button
            onClick={onOpenDailyModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-none bg-white/5 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/30 text-[#fcf9f2] text-xs font-serif tracking-widest transition-all cursor-pointer"
            title="今日一籤"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="hidden sm:inline">今日一籤</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            className={`p-2 rounded-none border transition-all cursor-pointer ${
              soundEnabled
                ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#D4AF37]'
                : 'bg-white/5 border-white/10 text-white/40'
            }`}
            title={soundEnabled ? '音效：開啟' : '音效：靜音'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* History */}
          <button
            onClick={onOpenHistory}
            className="relative p-2 rounded-none bg-white/5 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/30 text-[#e0d8cc] transition-all cursor-pointer"
            title="籤詩典藏"
          >
            <History className="w-4 h-4 text-[#D4AF37]" />
            {historyCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#8b0000] text-[#fcf9f2] font-bold text-[9px] rounded-full flex items-center justify-center border border-[#D4AF37]">
                {historyCount > 9 ? '9+' : historyCount}
              </span>
            )}
          </button>

          {/* Reset/New Draw */}
          <button
            onClick={onReset}
            className="p-2 rounded-none bg-white/5 hover:bg-[#8b0000]/40 border border-[#8b0000]/50 text-[#e0d8cc] transition-all cursor-pointer"
            title="重新求籤"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

        </div>

      </div>
    </header>
  );
};
