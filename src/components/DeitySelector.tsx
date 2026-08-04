import React from 'react';
import { DEITIES } from '../data/deities';
import { DeityInfo, DeityId } from '../types';
import { 
  HeartHandshake, 
  Shield, 
  Heart, 
  Coins, 
  GraduationCap, 
  Anchor, 
  Compass, 
  CheckCircle2,
  Sparkles
} from 'lucide-react';

interface DeitySelectorProps {
  selectedDeity: DeityInfo;
  onSelectDeity: (deity: DeityInfo) => void;
}

const getDeityIcon = (iconName: string) => {
  switch (iconName) {
    case 'HeartHandshake': return <HeartHandshake className="w-5 h-5 text-amber-300" />;
    case 'Shield': return <Shield className="w-5 h-5 text-red-300" />;
    case 'Heart': return <Heart className="w-5 h-5 text-pink-300" />;
    case 'Coins': return <Coins className="w-5 h-5 text-yellow-300" />;
    case 'GraduationCap': return <GraduationCap className="w-5 h-5 text-indigo-300" />;
    case 'Anchor': return <Anchor className="w-5 h-5 text-cyan-300" />;
    case 'Compass': return <Compass className="w-5 h-5 text-emerald-300" />;
    default: return <Sparkles className="w-5 h-5 text-amber-300" />;
  }
};

export const DeitySelector: React.FC<DeitySelectorProps> = ({
  selectedDeity,
  onSelectDeity,
}) => {
  return (
    <div className="w-full space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[#D4AF37] font-bold">✦</span>
          <h2 className="text-xs md:text-sm font-serif uppercase tracking-[0.2em] text-[#D4AF37]">
            請選擇欲參拜請示之主尊神明
          </h2>
        </div>
        <span className="text-[11px] text-white/40 tracking-widest font-light">
          SELECT DEITY ({DEITIES.length})
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2">
        {DEITIES.map((deity) => {
          const isSelected = selectedDeity.id === deity.id;
          return (
            <button
              key={deity.id}
              onClick={() => onSelectDeity(deity)}
              className={`relative flex flex-col items-center p-3 rounded-none border text-center transition-all duration-200 focus:outline-none cursor-pointer ${
                isSelected
                  ? 'bg-[#D4AF37]/15 border-[#D4AF37] text-[#fcf9f2] shadow-[0_0_15px_rgba(212,175,55,0.2)]'
                  : 'bg-white/5 border-white/10 hover:border-[#D4AF37]/50 text-white/70 hover:text-white'
              }`}
            >
              {isSelected && (
                <div className="absolute top-1.5 right-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                </div>
              )}

              <div className={`p-2 rounded-none mb-2 border transition-all ${
                isSelected ? 'border-[#D4AF37] bg-[#D4AF37]/20' : 'border-white/10 bg-black/40'
              }`}>
                {getDeityIcon(deity.iconName)}
              </div>

              <span className={`text-xs md:text-sm font-serif tracking-wider ${
                isSelected ? 'text-[#fcf9f2] font-medium' : 'text-[#e0d8cc]/80'
              }`}>
                {deity.name}
              </span>

              <span className="text-[10px] text-[#D4AF37]/70 mt-1 line-clamp-1 font-serif tracking-wider">
                {deity.domain}
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected Deity Banner detail */}
      <div className="p-4 bg-white/5 border border-white/10 rounded-none text-xs text-[#e0d8cc] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg backdrop-blur-md">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-serif font-medium text-[#fcf9f2] text-sm tracking-widest">{selectedDeity.title}</span>
            <span className="text-[10px] px-2 py-0.5 bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 tracking-widest uppercase">
              {selectedDeity.domain}
            </span>
          </div>
          <p className="text-white/60 font-light">{selectedDeity.description}</p>
        </div>
        <div className="italic text-[#D4AF37] font-serif text-[11px] bg-black/40 px-3 py-1.5 border border-[#D4AF37]/20 shrink-0 tracking-wider">
          「{selectedDeity.quote}」
        </div>
      </div>
    </div>
  );
};
