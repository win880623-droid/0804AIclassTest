import React, { useState, useEffect } from 'react';
import { X, Sun, RefreshCw, Loader2, AlertCircle } from 'lucide-react';
import { soundFx } from '../utils/soundEffects';
import { getApiHeaders } from '../utils/apiKey';

interface DailyFortuneModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface DailyData {
  grade: string;
  title: string;
  quote: string;
  advice: string;
  luckyColor: string;
  luckyNumber: string;
}

export const DailyFortuneModal: React.FC<DailyFortuneModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [dailyData, setDailyData] = useState<DailyData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDailyFortune = async () => {
    setIsLoading(true);
    setError(null);
    try {
      soundFx.playTempleBell();
      const res = await fetch('/api/daily', { 
        method: 'POST',
        headers: getApiHeaders(),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setDailyData(data.data);
      } else {
        throw new Error(data.error || '無法取得 AI 今日運勢');
      }
    } catch (err) {
      console.error('Fetch Daily Fortune Error:', err);
      setError(err instanceof Error ? err.message : '取得 AI 運勢失敗，請確認已設定 GEMINI_API_KEY');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && !dailyData && !isLoading) {
      fetchDailyFortune();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="w-full max-w-md bg-[#0a0a0c] border border-white/10 rounded-lg p-6 text-white shadow-2xl space-y-5">
        
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <Sun className="w-5 h-5 text-[#D4AF37]" />
            <h2 className="font-serif font-bold text-base text-[#fcf9f2] tracking-wider uppercase">
              今日一籤 · AI REALTIME WISDOM
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-none bg-white/5 hover:bg-white/10 text-white/70 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Card */}
        {isLoading ? (
          <div className="p-10 rounded-none bg-white/5 border border-white/10 text-white text-center space-y-4">
            <Loader2 className="w-8 h-8 text-[#D4AF37] animate-spin mx-auto" />
            <p className="text-xs text-white/70 font-serif tracking-widest">
              Gemini AI 正在感應今日天機氣場…
            </p>
          </div>
        ) : error ? (
          <div className="p-6 rounded-none bg-[#8b0000]/20 border border-[#8b0000] text-red-200 text-center space-y-3">
            <AlertCircle className="w-8 h-8 text-red-400 mx-auto" />
            <p className="text-xs font-serif leading-relaxed">{error}</p>
            <button
              onClick={fetchDailyFortune}
              className="px-4 py-1.5 bg-[#8b0000] text-white text-xs font-serif uppercase tracking-widest cursor-pointer"
            >
              重試 AI 運算
            </button>
          </div>
        ) : dailyData ? (
          <div className="p-6 rounded-none bg-white/5 border border-white/10 text-white text-center space-y-4 shadow-xl">
            <div className="inline-block px-4 py-1.5 bg-[#8b0000] text-white font-serif font-bold text-xs uppercase tracking-widest">
              今日運勢：【{dailyData.grade}】
            </div>

            <h3 className="font-serif font-bold text-lg text-[#D4AF37] tracking-wider">
              {dailyData.title}
            </h3>

            <p className="italic font-serif text-[#fcf9f2] text-sm bg-black/40 p-4 border border-white/10 tracking-widest">
              「{dailyData.quote}」
            </p>

            <p className="text-xs text-white/70 leading-relaxed font-light">
              {dailyData.advice}
            </p>

            <div className="grid grid-cols-2 gap-2 text-xs pt-3 border-t border-white/10 text-[#D4AF37] font-serif uppercase tracking-wider">
              <div>幸運色彩：{dailyData.luckyColor}</div>
              <div>開運數字：{dailyData.luckyNumber}</div>
            </div>
          </div>
        ) : null}

        {/* Footer */}
        <div className="flex justify-between items-center gap-2 pt-2">
          <button
            onClick={fetchDailyFortune}
            disabled={isLoading}
            className="px-4 py-2.5 bg-black hover:bg-white/10 text-white/70 border border-white/20 text-xs font-serif flex items-center gap-1.5 cursor-pointer uppercase tracking-wider"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#D4AF37] ${isLoading ? 'animate-spin' : ''}`} />
            <span>AI 即時重算今日籤</span>
          </button>

          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-[#D4AF37] hover:bg-[#c29f2f] text-black font-serif font-bold text-xs cursor-pointer uppercase tracking-wider"
          >
            領取今日吉意
          </button>
        </div>

      </div>
    </div>
  );
};
