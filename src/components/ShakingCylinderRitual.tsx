import React, { useState } from 'react';
import { motion } from 'motion/react';
import { DeityInfo } from '../types';
import { soundFx } from '../utils/soundEffects';
import { RefreshCw, Sparkles, Hand } from 'lucide-react';

interface ShakingCylinderProps {
  currentDeity: DeityInfo;
  onStickDrawn: (stickNumber: number) => void;
}

export const ShakingCylinderRitual: React.FC<ShakingCylinderProps> = ({
  currentDeity,
  onStickDrawn,
}) => {
  const [isShaking, setIsShaking] = useState(false);
  const [drawnStickNum, setDrawnStickNum] = useState<number | null>(null);

  const handleStartShaking = () => {
    if (isShaking) return;

    setIsShaking(true);
    setDrawnStickNum(null);

    // Play shaking sounds
    soundFx.playCylinderShake();
    const interval = setInterval(() => {
      soundFx.playCylinderShake();
    }, 450);

    // After 2.2 seconds, stick pops out!
    setTimeout(() => {
      clearInterval(interval);
      soundFx.playWoodenFish();
      const randomStick = Math.floor(Math.random() * 100) + 1;
      setDrawnStickNum(randomStick);
      setIsShaking(false);
    }, 2200);
  };

  return (
    <div className="w-full bg-white/5 border border-white/10 rounded-lg p-6 md:p-10 text-center shadow-[0_0_50px_rgba(0,0,0,0.5)] backdrop-blur-md relative overflow-hidden">
      
      <div className="max-w-md mx-auto space-y-6 relative z-10">
        
        <div>
          <span className="text-xs font-serif uppercase tracking-[0.2em] text-[#D4AF37] block mb-1">
            第二階段 · 虔誠搖籤筒 (DRAWING STICK)
          </span>
          <h2 className="text-lg md:text-xl font-serif font-bold tracking-wider text-[#fcf9f2]">
            請連續搖動籤筒，直至靈籤跳出
          </h2>
        </div>

        {/* Cylinder Animation Stage */}
        <div className="py-8 flex flex-col items-center justify-center min-h-[220px]">
          
          <motion.div
            animate={
              isShaking
                ? {
                    rotate: [-8, 8, -10, 10, -5, 5, 0],
                    y: [0, -12, 0, -8, 0],
                  }
                : {}
            }
            transition={
              isShaking
                ? { duration: 0.4, repeat: 5, ease: 'easeInOut' }
                : {}
            }
            className="relative"
          >
            {/* Pop out stick if drawn */}
            {drawnStickNum !== null && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: -80, opacity: 1 }}
                transition={{ duration: 0.6, type: 'spring', stiffness: 120 }}
                className="absolute left-1/2 -translate-x-1/2 top-0 w-8 h-36 bg-[#f5f2ed] border-2 border-[#D4AF37] shadow-2xl flex flex-col items-center justify-start pt-2 font-serif text-black font-bold text-xs rounded-none"
              >
                <span>第</span>
                <span className="text-sm font-extrabold my-0.5 text-[#8b0000]">{drawnStickNum}</span>
                <span>籤</span>
              </motion.div>
            )}

            {/* Cylinder Container */}
            <div className="w-32 h-44 bg-black rounded-none border-2 border-[#D4AF37]/60 shadow-2xl flex flex-col items-center justify-start p-2 relative">
              {/* Bamboo Stick Tops */}
              <div className="w-full flex justify-center gap-1 overflow-hidden h-10 border-b border-white/10">
                {[...Array(12)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1.5 h-12 bg-[#D4AF37]/80 rounded-t-none opacity-80"
                    style={{ transform: `rotate(${(i - 6) * 3}deg)` }}
                  />
                ))}
              </div>

              {/* Gold Label on Cylinder */}
              <div className="mt-6 px-3 py-1 bg-[#D4AF37]/10 rounded-none border border-[#D4AF37]/40 text-[#D4AF37] font-serif font-bold text-xs uppercase tracking-widest">
                {currentDeity.name} 靈籤
              </div>
            </div>
          </motion.div>

        </div>

        {/* Drawn stick result confirmation button */}
        {drawnStickNum !== null ? (
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="space-y-4">
            <div className="p-4 rounded-none bg-black/40 border border-[#D4AF37]/40 text-[#fcf9f2] font-serif text-xs md:text-sm tracking-wider">
              ✦ 已求得【第 {drawnStickNum} 籤】！接下來進行「擲盃請示」確認神意。
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleStartShaking}
                className="w-1/3 py-3 rounded-none bg-black hover:bg-white/10 border border-white/20 text-white/70 font-serif text-xs flex items-center justify-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>重新搖籤</span>
              </button>

              <button
                onClick={() => onStickDrawn(drawnStickNum)}
                className="w-2/3 py-3.5 rounded-none bg-[#D4AF37] hover:bg-[#c29f2f] text-black font-serif font-bold text-xs md:text-sm uppercase tracking-[0.2em] shadow-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>進一步・擲盃確認</span>
                <Sparkles className="w-4 h-4 text-black" />
              </button>
            </div>
          </motion.div>
        ) : (
          <button
            onClick={handleStartShaking}
            disabled={isShaking}
            className={`w-full py-4 rounded-none font-serif font-bold text-sm md:text-base uppercase tracking-[0.2em] shadow-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
              isShaking
                ? 'bg-black text-[#D4AF37] border border-[#D4AF37]/40'
                : 'bg-[#D4AF37] hover:bg-[#c29f2f] text-black'
            }`}
          >
            <Hand className={`w-5 h-5 ${isShaking ? 'animate-spin' : 'animate-bounce'}`} />
            <span>{isShaking ? '虔誠搖晃籤筒中…' : '開始搖動籤筒 (SHAKE)'}</span>
          </button>
        )}

      </div>
    </div>
  );
};
