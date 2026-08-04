import React, { useState } from 'react';
import { CategoryType, DeityInfo } from '../types';
import { PRESET_QUESTIONS } from '../data/presetQuestions';
import { 
  Briefcase, 
  Heart, 
  Coins, 
  GraduationCap, 
  Activity, 
  Plane, 
  Users, 
  HelpCircle,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Hand
} from 'lucide-react';

interface QuestionInputProps {
  currentDeity: DeityInfo;
  onStartDivination: (question: string, category: CategoryType, userContext: { gender?: string; birthYear?: string; timeframe?: string }) => void;
  isLoading: boolean;
}

const CATEGORY_TAGS: { id: CategoryType; label: string; icon: React.ReactNode }[] = [
  { id: 'career', label: '事業・轉職', icon: <Briefcase className="w-3.5 h-3.5" /> },
  { id: 'love', label: '感情・姻緣', icon: <Heart className="w-3.5 h-3.5" /> },
  { id: 'wealth', label: '財運・理財', icon: <Coins className="w-3.5 h-3.5" /> },
  { id: 'studies', label: '學業・考試', icon: <GraduationCap className="w-3.5 h-3.5" /> },
  { id: 'health', label: '健康・平安', icon: <Activity className="w-3.5 h-3.5" /> },
  { id: 'travel', label: '遠行・遷居', icon: <Plane className="w-3.5 h-3.5" /> },
  { id: 'family', label: '家庭・家和', icon: <Users className="w-3.5 h-3.5" /> },
  { id: 'general', label: '綜合問卜', icon: <HelpCircle className="w-3.5 h-3.5" /> },
];

export const QuestionInput: React.FC<QuestionInputProps> = ({
  currentDeity,
  onStartDivination,
  isLoading,
}) => {
  const [question, setQuestion] = useState('');
  const [category, setCategory] = useState<CategoryType>('general');
  const [showContextDetails, setShowContextDetails] = useState(false);
  const [gender, setGender] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [timeframe, setTimeframe] = useState('近期 3 ~ 6 個月');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    onStartDivination(question.trim(), category, {
      gender: gender || undefined,
      birthYear: birthYear || undefined,
      timeframe,
    });
  };

  const handleSelectPreset = (presetText: string, presetCategory: CategoryType) => {
    setQuestion(presetText);
    setCategory(presetCategory);
  };

  return (
    <div className="w-full bg-white/5 border border-white/10 rounded-lg p-5 md:p-7 shadow-[0_0_50px_rgba(0,0,0,0.5)] backdrop-blur-md space-y-5">
      
      {/* Category selector */}
      <div>
        <label className="block text-xs font-serif uppercase tracking-[0.2em] text-[#D4AF37] mb-2.5">
          選擇祈求類別 · Category Selection
        </label>
        <div className="flex flex-wrap gap-2">
          {CATEGORY_TAGS.map((tag) => {
            const isSelected = category === tag.id;
            return (
              <button
                key={tag.id}
                type="button"
                onClick={() => setCategory(tag.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-none text-xs transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#D4AF37] text-black font-bold uppercase tracking-wider'
                    : 'bg-black/40 text-white/70 hover:text-white border border-white/10 hover:border-[#D4AF37]/40'
                }`}
              >
                {tag.icon}
                <span>{tag.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* Main Question Textarea */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs md:text-sm font-serif tracking-wider text-[#fcf9f2]">
              誠心向【{currentDeity.name}】稟報心中疑惑或所求之事：
            </label>
            <span className="text-[10px] text-white/40 tracking-widest">
              {question.length} / 150
            </span>
          </div>

          <div className="relative">
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value.slice(0, 150))}
              placeholder={`例如：「目前在職涯面臨瓶頸，考慮下半年轉職創業，請示 ${currentDeity.name} 指引吉凶與時機…」`}
              rows={3}
              className="w-full bg-black border border-[#D4AF37]/30 text-white p-4 rounded-none focus:outline-none focus:border-[#D4AF37] focus:border-opacity-100 transition-all placeholder:opacity-30 tracking-widest font-serif text-sm md:text-base leading-relaxed"
            />
          </div>
        </div>

        {/* Preset Prompt Suggestions */}
        <div>
          <span className="text-[11px] font-serif text-[#D4AF37]/80 block mb-2 tracking-wider">
            ✦ 熱門速選靈感（點擊帶入問題）：
          </span>
          <div className="flex flex-wrap gap-1.5">
            {PRESET_QUESTIONS.map((pq, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectPreset(pq.text, pq.category)}
                className="text-[11px] px-2.5 py-1 rounded-none bg-black/40 hover:bg-[#D4AF37]/20 border border-white/10 hover:border-[#D4AF37]/30 text-white/70 hover:text-white transition-colors text-left cursor-pointer"
              >
                {pq.text}
              </button>
            ))}
          </div>
        </div>

        {/* Optional User Context Accordion */}
        <div className="border-t border-white/10 pt-3">
          <button
            type="button"
            onClick={() => setShowContextDetails(!showContextDetails)}
            className="flex items-center gap-1.5 text-xs text-white/60 hover:text-[#D4AF37] transition-colors cursor-pointer"
          >
            {showContextDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            <span>補充求問個人資訊（選填：生辰/時間跨度，能提升 AI 解籤個人化）</span>
          </button>

          {showContextDetails && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3 p-4 rounded-none bg-black/40 border border-white/10 text-xs">
              <div>
                <label className="block text-white/60 mb-1">性別：</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full bg-black border border-white/20 rounded-none p-2 text-white focus:outline-none focus:border-[#D4AF37]"
                >
                  <option value="">不指定</option>
                  <option value="信士（男）">信士（男）</option>
                  <option value="信女（女）">信女（女）</option>
                </select>
              </div>

              <div>
                <label className="block text-white/60 mb-1">出生年份 / 生肖：</label>
                <input
                  type="text"
                  value={birthYear}
                  onChange={(e) => setBirthYear(e.target.value)}
                  placeholder="例如：1995年 / 屬豬"
                  className="w-full bg-black border border-white/20 rounded-none p-2 text-white focus:outline-none focus:border-[#D4AF37] placeholder:opacity-30"
                />
              </div>

              <div>
                <label className="block text-white/60 mb-1">觀察時間跨度：</label>
                <select
                  value={timeframe}
                  onChange={(e) => setTimeframe(e.target.value)}
                  className="w-full bg-black border border-white/20 rounded-none p-2 text-white focus:outline-none focus:border-[#D4AF37]"
                >
                  <option value="近期 1 ~ 3 個月">近期 1 ~ 3 個月</option>
                  <option value="近期 3 ~ 6 個月">近期 3 ~ 6 個月</option>
                  <option value="今年內（未來一年）">今年內（未來一年）</option>
                  <option value="長遠規劃（3~5年）">長遠規劃（3~5年）</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Submit Action Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={!question.trim() || isLoading}
            className={`w-full py-4 rounded-none font-serif font-bold text-sm md:text-base uppercase tracking-[0.2em] shadow-2xl flex items-center justify-center gap-2.5 transition-all duration-300 ${
              question.trim() && !isLoading
                ? 'bg-[#D4AF37] hover:bg-[#c29f2f] text-black active:scale-[0.99] cursor-pointer'
                : 'bg-white/10 text-white/30 border border-white/10 cursor-not-allowed'
            }`}
          >
            <Hand className="w-5 h-5 text-black animate-bounce" />
            <span>誠心合掌・求請靈籤 (ASK ORACLE)</span>
            <Sparkles className="w-5 h-5 text-black" />
          </button>
        </div>

      </form>
    </div>
  );
};
