import React, { useState } from 'react';
import { FortuneSlipData } from '../types';
import { X, Copy, Check, Download, Share2, Sparkles, Flame } from 'lucide-react';

interface FortuneCardExportProps {
  isOpen: boolean;
  onClose: () => void;
  fortuneSlip: FortuneSlipData;
}

export const FortuneCardExport: React.FC<FortuneCardExportProps> = ({
  isOpen,
  onClose,
  fortuneSlip,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const cardText = `【AI 靈籤解籤系統・${fortuneSlip.deityName}】
求問：${fortuneSlip.question}
籤名：${fortuneSlip.title}（${fortuneSlip.grade}）

詩籤內容：
${fortuneSlip.poemLines.join('\n')}

歷史典故：${fortuneSlip.story}
聖意解析：${fortuneSlip.directAnswer}

吉言錦囊：${fortuneSlip.remedyAdvice}
# AI靈籤問卜 #詩籤開示`;

  const handleCopyText = () => {
    navigator.clipboard.writeText(cardText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="w-full max-w-lg bg-[#0a0a0c] border border-white/10 rounded-lg p-6 text-white shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#D4AF37]" />
            <h2 className="font-serif font-bold text-base md:text-lg text-[#fcf9f2] tracking-wider uppercase">
              宮廟詩籤卡 · EXPORT CARD
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-none bg-white/5 hover:bg-white/10 text-white/70 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable/Shareable Stylized Card Frame */}
        <div className="p-6 rounded-sm bg-[#f5f2ed] border-x-[10px] border-[#222] text-[#1a1a1a] shadow-2xl relative space-y-4">
          
          <div className="flex items-center justify-between border-b border-[#1a1a1a]/20 pb-3">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-[#8b0000]" />
              <span className="font-serif font-bold text-sm text-[#1a1a1a]">
                【{fortuneSlip.deityName}】靈籤卡
              </span>
            </div>
            <div className="px-3 py-1 bg-[#8b0000] text-white font-serif font-bold text-xs uppercase tracking-widest">
              {fortuneSlip.grade}
            </div>
          </div>

          <div className="text-center">
            <h3 className="font-serif font-extrabold text-xl text-[#1a1a1a] tracking-widest">
              {fortuneSlip.title}
            </h3>
            <p className="text-xs text-[#1a1a1a]/60 font-serif mt-1">
              問卜事項：「{fortuneSlip.question}」
            </p>
          </div>

          {/* Poem Box */}
          <div className="p-4 bg-black/5 border border-[#1a1a1a]/10 font-serif text-center space-y-1.5 font-bold text-base text-[#1a1a1a]">
            {fortuneSlip.poemLines.map((line, idx) => (
              <p key={idx}>{line}</p>
            ))}
          </div>

          {/* Brief Direct Answer */}
          <div className="p-3 bg-[#8b0000]/5 border border-[#8b0000]/20 text-xs text-[#1a1a1a] font-serif leading-relaxed">
            <span className="font-bold text-[#8b0000]">【開示精要】：</span>
            {fortuneSlip.directAnswer}
          </div>

          <div className="text-[10px] text-center text-[#1a1a1a]/50 font-serif border-t border-[#1a1a1a]/10 pt-2 tracking-widest uppercase">
            AI 靈籤問卜 · 誠心祈求 · 吉祥安泰
          </div>

        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={handleCopyText}
            className="flex-1 py-3 rounded-none bg-white/5 hover:bg-white/10 border border-white/20 text-white font-serif text-xs md:text-sm font-bold flex items-center justify-center gap-2 cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-[#D4AF37]" />}
            <span>{copied ? '已複製文字卡片' : '複製文字內文'}</span>
          </button>

          <button
            onClick={onClose}
            className="px-6 py-3 rounded-none bg-[#D4AF37] hover:bg-[#c29f2f] text-black font-serif font-bold text-xs md:text-sm cursor-pointer uppercase tracking-wider"
          >
            完成
          </button>
        </div>

      </div>
    </div>
  );
};
