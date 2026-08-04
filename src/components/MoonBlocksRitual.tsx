import React, { useState } from 'react';
import { motion } from 'motion/react';
import { DeityInfo } from '../types';
import { soundFx } from '../utils/soundEffects';
import { CheckCircle2, RotateCcw, Sparkles, AlertCircle } from 'lucide-react';

interface MoonBlocksRitualProps {
  currentDeity: DeityInfo;
  stickNumber: number;
  question: string;
  onConfirmed: () => void;
  onReshake: () => void;
}

type BlockResult = 'sheng' | 'xiao' | 'yin' | null;

export const MoonBlocksRitual: React.FC<MoonBlocksRitualProps> = ({
  currentDeity,
  stickNumber,
  question,
  onConfirmed,
  onReshake,
}) => {
  const [isTossing, setIsTossing] = useState(false);
  const [result, setResult] = useState<BlockResult>(null);
  const [shengCount, setShengCount] = useState(0);

  const handleTossBlocks = () => {
    if (isTossing) return;

    setIsTossing(true);
    setResult(null);

    // Play clack sound
    soundFx.playMoonBlocksClack();

    setTimeout(() => {
      soundFx.playMoonBlocksClack();
    }, 450);

    setTimeout(() => {
      setIsTossing(false);
      // High probability of Sheng Bao (75%) for smooth UX, but allows realistic variation
      const rand = Math.random();
      let outcome: BlockResult = 'sheng';

      if (rand < 0.75) {
        outcome = 'sheng';
      } else if (rand < 0.9) {
        outcome = 'xiao';
      } else {
        outcome = 'yin';
      }

      setResult(outcome);

      if (outcome === 'sheng') {
        soundFx.playTempleBell();
        setShengCount((prev) => prev + 1);
      } else {
        soundFx.playWoodenFish();
      }
    }, 1200);
  };

  return (
    <div className="w-full bg-white/5 border border-white/10 rounded-lg p-6 md:p-10 text-center shadow-[0_0_50px_rgba(0,0,0,0.5)] backdrop-blur-md relative overflow-hidden">
      
      <div className="max-w-md mx-auto space-y-6 relative z-10">
        
        <div>
          <span className="text-xs font-serif uppercase tracking-[0.2em] text-[#D4AF37] block mb-1">
            第三階段 · 擲盃請示聖意 (TOSS BLOCKS)
          </span>
          <h2 className="text-lg md:text-xl font-serif font-bold tracking-wider text-[#fcf9f2]">
            請向【{currentDeity.name}】擲盃，請示第 {stickNumber} 籤是否為聖意？
          </h2>
        </div>

        {/* Status Badge */}
        <div className="p-3.5 rounded-none bg-black/40 border border-white/10 text-xs text-white/80 font-serif flex items-center justify-between tracking-wider">
          <span>求得靈籤：第 {stickNumber} 籤</span>
          <span className="text-[#D4AF37] font-bold">
            聖盃累積：{shengCount} 次
          </span>
        </div>

        {/* Moon Blocks Animation Stage */}
        <div className="py-6 flex flex-col items-center justify-center min-h-[180px]">
          
          <div className="flex justify-center items-center gap-6 relative">
            
            {/* Block Left */}
            <motion.div
              animate={
                isTossing
                  ? {
                      rotate: [0, 360, 720, 1080],
                      y: [-20, -80, 0],
                      x: [-10, -30, -10],
                    }
                  : {}
              }
              transition={{ duration: 1.1, ease: 'easeOut' }}
              className={`w-20 h-10 rounded-full border border-[#D4AF37] shadow-xl flex items-center justify-center font-serif text-xs font-bold text-white ${
                result === 'xiao' || (result === 'sheng' && true)
                  ? 'bg-[#8b0000]' // Flat side
                  : 'bg-black shadow-inner' // Curved side
              }`}
            >
              {isTossing ? '翻轉中' : result === 'sheng' || result === 'xiao' ? '陽（平）' : '陰（凸）'}
            </motion.div>

            {/* Block Right */}
            <motion.div
              animate={
                isTossing
                  ? {
                      rotate: [0, -360, -720, -1080],
                      y: [-20, -80, 0],
                      x: [10, 30, 10],
                    }
                  : {}
              }
              transition={{ duration: 1.1, ease: 'easeOut' }}
              className={`w-20 h-10 rounded-full border border-[#D4AF37] shadow-xl flex items-center justify-center font-serif text-xs font-bold text-white ${
                result === 'sheng'
                  ? 'bg-black shadow-inner' // Curved side
                  : result === 'xiao'
                  ? 'bg-[#8b0000]' // Flat side
                  : 'bg-black shadow-inner' // Curved side
              }`}
            >
              {isTossing ? '翻轉中' : result === 'sheng' ? '陰（凸）' : result === 'xiao' ? '陽（平）' : '陰（凸）'}
            </motion.div>

          </div>

          {/* Outcome Description Text */}
          {result && !isTossing && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
              {result === 'sheng' && (
                <div className="p-4 rounded-none bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 font-serif space-y-1">
                  <div className="flex items-center justify-center gap-1.5 font-bold text-sm md:text-base text-emerald-300">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span>【聖盃】神威應允！</span>
                  </div>
                  <p className="text-xs text-emerald-200/80">
                    一平一凸，尊神特別應允此籤，神意確實，即刻可為您解籤！
                  </p>
                </div>
              )}

              {result === 'xiao' && (
                <div className="p-4 rounded-none bg-black/40 border border-[#D4AF37]/40 text-[#fcf9f2] font-serif space-y-1">
                  <div className="flex items-center justify-center gap-1.5 font-bold text-sm md:text-base text-[#D4AF37]">
                    <Sparkles className="w-5 h-5 text-[#D4AF37]" />
                    <span>【笑盃】神明微笑</span>
                  </div>
                  <p className="text-xs text-white/70">
                    雙平（兩陽），代表神明微笑或所求問題尚不夠清晰，請再誠心擲盃一次。
                  </p>
                </div>
              )}

              {result === 'yin' && (
                <div className="p-4 rounded-none bg-red-950/40 border border-red-500/40 text-red-200 font-serif space-y-1">
                  <div className="flex items-center justify-center gap-1.5 font-bold text-sm md:text-base text-red-300">
                    <AlertCircle className="w-5 h-5 text-red-400" />
                    <span>【陰盃】未獲應允</span>
                  </div>
                  <p className="text-xs text-red-200/80">
                    雙凸（兩陰），代表此籤未合神意，可重新擲盃請示，或重新搖籤求取新籤。
                  </p>
                </div>
              )}
            </motion.div>
          )}

        </div>

        {/* Action buttons */}
        <div className="space-y-3">
          {result === 'sheng' ? (
            <button
              onClick={onConfirmed}
              className="w-full py-4 rounded-none bg-[#D4AF37] hover:bg-[#c29f2f] text-black font-serif font-bold text-sm md:text-base uppercase tracking-[0.2em] shadow-2xl flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Sparkles className="w-5 h-5 text-black" />
              <span>揭示靈籤・解開妙理 (REVEAL ORACLE)</span>
            </button>
          ) : (
            <div className="flex gap-2.5">
              <button
                onClick={onReshake}
                className="w-1/2 py-3.5 rounded-none bg-black hover:bg-white/10 border border-white/20 text-white/80 font-serif text-xs md:text-sm flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4 text-white/60" />
                <span>重新搖籤</span>
              </button>

              <button
                onClick={handleTossBlocks}
                disabled={isTossing}
                className="w-1/2 py-3.5 rounded-none bg-[#D4AF37] hover:bg-[#c29f2f] text-black font-serif font-bold text-xs md:text-sm uppercase tracking-wider shadow-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-black" />
                <span>{isTossing ? '擲盃請示中…' : '再次擲盃請示'}</span>
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
