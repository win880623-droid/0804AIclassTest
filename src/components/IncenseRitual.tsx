import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { DeityInfo } from '../types';
import { soundFx } from '../utils/soundEffects';
import { Flame, Sparkles } from 'lucide-react';

interface IncenseRitualProps {
  currentDeity: DeityInfo;
  question: string;
  onProceedToShaking: () => void;
}

export const IncenseRitual: React.FC<IncenseRitualProps> = ({
  currentDeity,
  question,
  onProceedToShaking,
}) => {
  const [incenseLit, setIncenseLit] = useState(false);
  const [praying, setPraying] = useState(false);

  useEffect(() => {
    // Play bell sound on mount
    soundFx.playTempleBell();
  }, []);

  const handleLightIncense = () => {
    soundFx.playWoodenFish();
    setIncenseLit(true);
    setPraying(true);

    setTimeout(() => {
      soundFx.playWoodenFish();
    }, 600);

    setTimeout(() => {
      soundFx.playWoodenFish();
      setPraying(false);
    }, 1200);
  };

  return (
    <div className="w-full bg-white/5 border border-white/10 rounded-lg p-6 md:p-10 text-center shadow-[0_0_50px_rgba(0,0,0,0.5)] backdrop-blur-md relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md mx-auto space-y-6 relative z-10">
        
        {/* Title */}
        <div>
          <span className="text-xs font-serif uppercase tracking-[0.2em] text-[#D4AF37] block mb-1">
            第一階段 · 清心奉香儀式 (INCENSE RITUAL)
          </span>
          <h2 className="text-lg md:text-xl font-serif font-bold tracking-wider text-[#fcf9f2]">
            點燃三柱清香，向【{currentDeity.name}】誠心稟報
          </h2>
        </div>

        {/* Question Card Box */}
        <div className="p-4 rounded-none bg-black/40 border border-white/10 text-xs md:text-sm text-white/80 font-serif tracking-wider">
          「信眾求問：{question}」
        </div>

        {/* Incense Burner Visual */}
        <div className="py-6 flex flex-col items-center justify-center">
          
          {/* Incense Smoke Particles if lit */}
          {incenseLit && (
            <div className="flex justify-center gap-3 h-20 mb-1">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0.2, y: 10, scaleX: 0.8 }}
                  animate={{ 
                    opacity: [0.3, 0.8, 0.2, 0],
                    y: [-10, -50, -80],
                    scaleX: [1, 1.5, 2]
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    delay: i * 0.4,
                    ease: "easeOut"
                  }}
                  className="w-1.5 bg-gradient-to-t from-[#D4AF37]/60 via-amber-100/40 to-transparent rounded-full blur-[1px]"
                />
              ))}
            </div>
          )}

          {/* Incense Sticks */}
          <div className="flex justify-center items-end gap-3 h-28 relative">
            {[0, 1, 2].map((i) => (
              <div key={i} className="relative flex flex-col items-center">
                {/* Glowing embers tip */}
                {incenseLit && (
                  <motion.div
                    animate={{ scale: [1, 1.3, 1], opacity: [0.8, 1, 0.8] }}
                    transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                    className="w-2.5 h-2.5 bg-[#D4AF37] rounded-full shadow-[0_0_12px_#D4AF37] -mb-1 z-10"
                  />
                )}
                {/* Stick */}
                <div className={`w-1 rounded-t ${incenseLit ? 'h-24 bg-gradient-to-b from-amber-700 to-amber-900' : 'h-28 bg-stone-700'}`} />
              </div>
            ))}
          </div>

          {/* Incense Burner Pot */}
          <div className="w-36 h-16 bg-black border border-[#D4AF37]/40 rounded-none flex flex-col items-center justify-center shadow-2xl relative">
            <div className="w-full h-1 bg-[#D4AF37]/30" />
            <span className="text-[10px] font-serif text-[#D4AF37] tracking-[0.2em] uppercase mt-1">
              奉香吉祥 · SACRED BURNER
            </span>
          </div>

        </div>

        {/* Action button */}
        {!incenseLit ? (
          <button
            onClick={handleLightIncense}
            className="w-full py-3.5 rounded-none bg-[#D4AF37] hover:bg-[#c29f2f] text-black font-serif font-bold text-sm md:text-base uppercase tracking-[0.2em] shadow-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Flame className="w-5 h-5 text-black animate-pulse" />
            <span>點燃三柱香・淨心祈禱</span>
          </button>
        ) : (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            <p className="text-xs text-[#D4AF37] font-serif tracking-widest">
              ✦ 香煙繚繞，神威已通感。請準備搖動籤筒抽求靈籤。
            </p>
            <button
              onClick={() => {
                soundFx.playCylinderShake();
                onProceedToShaking();
              }}
              className="w-full py-4 rounded-none bg-[#D4AF37] hover:bg-[#c29f2f] text-black font-serif font-bold text-sm md:text-base uppercase tracking-[0.2em] shadow-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Sparkles className="w-5 h-5 text-black" />
              <span>進一步・搖動籤筒求籤 (SHAKE CYLINDER)</span>
            </button>
          </motion.div>
        )}

      </div>
    </div>
  );
};
