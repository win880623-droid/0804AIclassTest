import React, { useState } from 'react';
import { FortuneSlipData } from '../types';
import { X, Search, Trash2, ExternalLink, Calendar, BookmarkCheck, Flame } from 'lucide-react';

interface FortuneHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  history: FortuneSlipData[];
  onSelectSlip: (slip: FortuneSlipData) => void;
  onDeleteSlip: (id: string) => void;
  onClearAll: () => void;
}

export const FortuneHistory: React.FC<FortuneHistoryProps> = ({
  isOpen,
  onClose,
  history,
  onSelectSlip,
  onDeleteSlip,
  onClearAll,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filteredHistory = history.filter((item) => {
    const term = searchTerm.toLowerCase();
    return (
      item.question.toLowerCase().includes(term) ||
      item.title.toLowerCase().includes(term) ||
      item.deityName.toLowerCase().includes(term) ||
      item.poemLines.some((line) => line.toLowerCase().includes(term))
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-2xl bg-[#0a0a0c] border border-white/10 rounded-lg p-6 text-white shadow-2xl space-y-4 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <BookmarkCheck className="w-5 h-5 text-[#D4AF37]" />
            <h2 className="font-serif font-bold text-base md:text-lg text-[#fcf9f2] tracking-wider uppercase">
              靈籤典藏歷史 · ORACLE HISTORY ({history.length})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-none bg-white/5 hover:bg-white/10 text-white/70 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#D4AF37] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="搜尋關鍵字（問題、神尊、籤名或詩句）..."
            className="w-full bg-black border border-white/20 rounded-none pl-10 pr-3.5 py-2.5 text-xs md:text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#D4AF37]"
          />
        </div>

        {/* Slips List */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {filteredHistory.length === 0 ? (
            <div className="text-center py-12 text-white/40 font-serif text-xs md:text-sm tracking-wider">
              {history.length === 0 ? '目前尚未典藏任何詩籤，求籤後可保存於此。' : '未找到符合關鍵字的詩籤紀錄。'}
            </div>
          ) : (
            filteredHistory.map((item) => (
              <div
                key={item.id}
                className="p-4 bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] px-2 py-0.5 bg-[#D4AF37] text-black font-serif font-bold tracking-wider uppercase">
                      {item.grade}
                    </span>
                    <span className="font-serif font-bold text-sm text-[#fcf9f2] tracking-wider">
                      {item.title}
                    </span>
                    <span className="text-[11px] text-[#D4AF37]/80 font-serif">
                      ({item.deityName})
                    </span>
                  </div>

                  <p className="text-xs text-white/70 font-serif line-clamp-1 tracking-wider">
                    求問：{item.question}
                  </p>

                  <div className="flex items-center gap-2 text-[10px] text-white/40 pt-1">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(item.timestamp).toLocaleString('zh-TW')}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      onSelectSlip(item);
                      onClose();
                    }}
                    className="px-3 py-1.5 bg-[#D4AF37] hover:bg-[#c29f2f] text-black font-serif font-bold text-xs uppercase tracking-wider flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>查看完整詩籤</span>
                  </button>

                  <button
                    onClick={() => onDeleteSlip(item.id)}
                    className="p-1.5 bg-black hover:bg-red-950 text-red-400 border border-white/10 transition-colors cursor-pointer"
                    title="刪除"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {history.length > 0 && (
          <div className="pt-3 border-t border-white/10 flex justify-between items-center text-xs">
            <button
              onClick={onClearAll}
              className="text-red-400/80 hover:text-red-300 flex items-center gap-1 font-serif cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>清空所有紀錄</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white/10 text-white hover:bg-white/20 font-serif cursor-pointer"
            >
              關閉
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
