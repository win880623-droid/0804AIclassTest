import React, { useState } from 'react';
import { motion } from 'motion/react';
import { FortuneSlipData, DeityInfo } from '../types';
import { MasterChat } from './MasterChat';
import { 
  Volume2, 
  VolumeX, 
  BookmarkCheck, 
  Share2, 
  MessageSquareText, 
  Sparkles, 
  BookOpen, 
  CheckCircle2, 
  XCircle, 
  Flame, 
  RotateCcw,
  Compass,
  Briefcase,
  Heart,
  Coins,
  GraduationCap,
  Activity,
  Plane,
  Users
} from 'lucide-react';

interface FortuneSlipViewProps {
  fortuneSlip: FortuneSlipData;
  deity: DeityInfo;
  onSaveHistory: (slip: FortuneSlipData) => void;
  isSaved: boolean;
  onOpenExportModal: () => void;
  onNewDivination: () => void;
}

export const FortuneSlipView: React.FC<FortuneSlipViewProps> = ({
  fortuneSlip,
  deity,
  onSaveHistory,
  isSaved,
  onOpenExportModal,
  onNewDivination,
}) => {
  const [activeTab, setActiveTab] = useState<'summary' | 'details' | 'story' | 'chat'>('summary');
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Speech Reader using Web Speech API
  const handleRecitePoem = () => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        return;
      }

      window.speechSynthesis.cancel();
      const poemText = `${fortuneSlip.title}。${fortuneSlip.poemLines.join('。')}`;
      const utterance = new SpeechSynthesisUtterance(poemText);
      utterance.lang = 'zh-TW';
      utterance.rate = 0.85; // Slow, dignified pace
      utterance.pitch = 0.9;

      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    } else {
      alert('您的瀏覽器不支援語音朗讀功能');
    }
  };

  return (
    <div className="w-full space-y-8">
      
      {/* Upper Layout Grid: Scroll Card & Interpretation Section */}
      <div className="flex flex-col lg:flex-row gap-8 items-stretch">
        
        {/* The Scroll / Poetry Card */}
        <div className="w-full lg:w-[380px] bg-[#f5f2ed] rounded-sm shadow-[0_0_50px_rgba(0,0,0,0.8)] border-x-[12px] border-[#222] relative overflow-hidden flex flex-col justify-between shrink-0 text-[#1a1a1a] p-8 md:p-10">
          <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-black/10 to-transparent pointer-events-none" />
          
          <div className="flex flex-col items-center text-center">
            {/* Deity & Grade */}
            <div className="text-[#1a1a1a]/60 text-xs tracking-[0.4em] uppercase mb-2 font-serif font-medium">
              【{fortuneSlip.deityName}】聖示
            </div>
            <div className="text-[#8b0000] text-sm tracking-[0.5em] font-serif font-bold uppercase mb-4">
              {fortuneSlip.grade}
            </div>

            <div className="w-[1px] h-8 bg-[#1a1a1a]/20 mb-6" />

            {/* Title */}
            <h2 className="text-[#1a1a1a] text-xl md:text-2xl font-bold tracking-[0.2em] font-serif mb-6">
              {fortuneSlip.title}
            </h2>

            {/* Poem Lines */}
            <div className="space-y-4 my-2">
              {fortuneSlip.poemLines.map((line, idx) => (
                <p
                  key={idx}
                  className="text-[#1a1a1a] text-lg md:text-xl font-medium tracking-[0.25em] font-serif leading-relaxed"
                >
                  {line}
                </p>
              ))}
            </div>

            {/* Cinnabar Seal Stamp Accent */}
            <div className="mt-8">
              <div className="w-12 h-12 border border-[#1a1a1a]/20 rounded-full flex items-center justify-center shadow-xs">
                <div className="w-2 h-2 bg-[#8b0000] rounded-full animate-pulse" />
              </div>
            </div>
          </div>

          {/* Action Row on Scroll */}
          <div className="mt-6 pt-4 border-t border-[#1a1a1a]/10 flex items-center justify-between text-xs">
            <span className="text-[#1a1a1a]/50 text-[10px] tracking-widest uppercase">
              Question: {fortuneSlip.question}
            </span>
            <button
              onClick={handleRecitePoem}
              className={`p-1.5 rounded border transition-all cursor-pointer ${
                isSpeaking
                  ? 'bg-[#8b0000] text-white border-[#8b0000]'
                  : 'bg-black/5 text-[#1a1a1a]/70 border-[#1a1a1a]/20 hover:bg-black/10'
              }`}
              title={isSpeaking ? '停止朗讀' : '語音誦讀籤詩'}
            >
              {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>

          <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
        </div>

        {/* Right Side: AI Interpretation & Insights */}
        <div className="flex-1 bg-white/5 border border-white/10 p-6 md:p-8 rounded-lg backdrop-blur-md flex flex-col justify-between space-y-6">
          
          <div>
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4 mb-6">
              <h3 className="text-[#D4AF37] text-xs md:text-sm uppercase tracking-[0.2em] flex items-center gap-3 font-serif">
                <span className="w-2 h-px bg-[#D4AF37]" /> 智語解析 · AI Interpretation
              </h3>

              {/* Navigation Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto">
                <button
                  onClick={() => setActiveTab('summary')}
                  className={`px-3 py-1.5 text-xs font-serif uppercase tracking-widest transition-all cursor-pointer ${
                    activeTab === 'summary'
                      ? 'bg-[#D4AF37] text-black font-bold'
                      : 'bg-black/40 text-white/60 hover:text-white border border-white/10'
                  }`}
                >
                  核心開示
                </button>
                <button
                  onClick={() => setActiveTab('details')}
                  className={`px-3 py-1.5 text-xs font-serif uppercase tracking-widest transition-all cursor-pointer ${
                    activeTab === 'details'
                      ? 'bg-[#D4AF37] text-black font-bold'
                      : 'bg-black/40 text-white/60 hover:text-white border border-white/10'
                  }`}
                >
                  分項運勢
                </button>
                <button
                  onClick={() => setActiveTab('story')}
                  className={`px-3 py-1.5 text-xs font-serif uppercase tracking-widest transition-all cursor-pointer ${
                    activeTab === 'story'
                      ? 'bg-[#D4AF37] text-black font-bold'
                      : 'bg-black/40 text-white/60 hover:text-white border border-white/10'
                  }`}
                >
                  典故故事
                </button>
                <button
                  onClick={() => setActiveTab('chat')}
                  className={`px-3 py-1.5 text-xs font-serif uppercase tracking-widest transition-all cursor-pointer ${
                    activeTab === 'chat'
                      ? 'bg-[#D4AF37] text-black font-bold'
                      : 'bg-black/40 text-white/60 hover:text-white border border-white/10'
                  }`}
                >
                  大師請益
                </button>
              </div>
            </div>

            {/* Tab Contents */}
            {activeTab === 'summary' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <section>
                  <h4 className="text-xs text-white/40 uppercase tracking-widest mb-2">
                    求問聖意 / Direct Guidance
                  </h4>
                  <p className="text-base md:text-lg leading-relaxed text-[#fcf9f2] font-light">
                    {fortuneSlip.directAnswer}
                  </p>
                </section>

                <section className="pt-4 border-t border-white/10">
                  <h4 className="text-xs text-white/40 uppercase tracking-widest mb-2">
                    總結格局 / Core Essence
                  </h4>
                  <p className="text-sm md:text-base leading-relaxed text-[#e0d8cc]/90 font-light">
                    {fortuneSlip.overallSummary}
                  </p>
                </section>

                <section className="pt-4 border-t border-white/10">
                  <h4 className="text-xs text-[#D4AF37] uppercase tracking-widest mb-2 flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5" /> 破局轉運錦囊 / Actionable Remedy
                  </h4>
                  <p className="text-sm md:text-base leading-relaxed text-[#fcf9f2] font-serif bg-black/30 p-4 border border-[#D4AF37]/20">
                    {fortuneSlip.remedyAdvice}
                  </p>
                </section>
              </motion.div>
            )}

            {activeTab === 'details' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                {/* Dos & Donts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-emerald-950/20 border border-emerald-500/30 text-emerald-200">
                    <div className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-2 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" /> 吉利行事 · 宜 (DOS)
                    </div>
                    <ul className="space-y-1.5 text-xs text-emerald-100/80 font-serif">
                      {fortuneSlip.dos.map((d, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-emerald-400">✦</span>
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 bg-red-950/20 border border-red-500/30 text-red-200">
                    <div className="text-xs font-bold uppercase tracking-widest text-red-400 mb-2 flex items-center gap-2">
                      <XCircle className="w-4 h-4" /> 避開禁忌 · 忌 (DON'TS)
                    </div>
                    <ul className="space-y-1.5 text-xs text-red-100/80 font-serif">
                      {fortuneSlip.donts.map((d, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-red-400">✦</span>
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Categories */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {fortuneSlip.categoryDetails.career && (
                    <div className="p-3.5 bg-black/40 border border-white/10 text-xs text-[#e0d8cc] space-y-1">
                      <span className="text-[#D4AF37] font-serif font-bold tracking-wider block">事業職場</span>
                      <p className="text-white/70 font-light">{fortuneSlip.categoryDetails.career}</p>
                    </div>
                  )}
                  {fortuneSlip.categoryDetails.love && (
                    <div className="p-3.5 bg-black/40 border border-white/10 text-xs text-[#e0d8cc] space-y-1">
                      <span className="text-pink-400 font-serif font-bold tracking-wider block">感情姻緣</span>
                      <p className="text-white/70 font-light">{fortuneSlip.categoryDetails.love}</p>
                    </div>
                  )}
                  {fortuneSlip.categoryDetails.wealth && (
                    <div className="p-3.5 bg-black/40 border border-white/10 text-xs text-[#e0d8cc] space-y-1">
                      <span className="text-yellow-400 font-serif font-bold tracking-wider block">求財理財</span>
                      <p className="text-white/70 font-light">{fortuneSlip.categoryDetails.wealth}</p>
                    </div>
                  )}
                  {fortuneSlip.categoryDetails.health && (
                    <div className="p-3.5 bg-black/40 border border-white/10 text-xs text-[#e0d8cc] space-y-1">
                      <span className="text-emerald-400 font-serif font-bold tracking-wider block">健康身心</span>
                      <p className="text-white/70 font-light">{fortuneSlip.categoryDetails.health}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'story' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <div className="p-5 bg-black/40 border border-white/10 space-y-3">
                  <h4 className="text-[#D4AF37] font-serif font-bold text-base border-b border-white/10 pb-2">
                    歷史典故：【{fortuneSlip.story}】
                  </h4>
                  <p className="text-sm text-[#e0d8cc]/90 leading-relaxed font-serif">
                    {fortuneSlip.storyMeaning}
                  </p>
                </div>
              </motion.div>
            )}

            {activeTab === 'chat' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <MasterChat fortuneSlip={fortuneSlip} />
              </motion.div>
            )}

          </div>

          {/* Bottom Action Controls */}
          <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => onSaveHistory(fortuneSlip)}
                className={`px-4 py-2 text-xs font-serif uppercase tracking-widest border transition-all cursor-pointer ${
                  isSaved
                    ? 'bg-emerald-900/40 text-emerald-300 border-emerald-500/50'
                    : 'bg-white/5 hover:bg-white/10 text-[#e0d8cc] border-white/20'
                }`}
              >
                {isSaved ? '已典藏此籤' : '典藏詩籤'}
              </button>

              <button
                onClick={onOpenExportModal}
                className="px-4 py-2 text-xs font-serif uppercase tracking-widest bg-white/5 hover:bg-white/10 text-[#e0d8cc] border border-white/20 transition-all cursor-pointer"
              >
                生成求籤卡
              </button>
            </div>

            <button
              onClick={onNewDivination}
              className="bg-[#D4AF37] text-black px-6 py-2.5 text-xs font-serif uppercase font-bold tracking-[0.2em] hover:bg-[#c29f2f] transition-all cursor-pointer"
            >
              再次問卜求籤
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
