import React, { useState, useRef, useEffect } from 'react';
import { FortuneSlipData, ChatMessage } from '../types';
import { Send, Bot, User, Sparkles, Loader2 } from 'lucide-react';
import { getApiHeaders } from '../utils/apiKey';

interface MasterChatProps {
  fortuneSlip: FortuneSlipData;
}

export const MasterChat: React.FC<MasterChatProps> = ({ fortuneSlip }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'master',
      text: `阿彌陀佛 / 福生無量。我是觀音宮住持解籤宗師。信眾求得【${fortuneSlip.title}】，心中有何尚未解開的疑惑、時間點或現實抉擇，皆可在此向貧僧細細請益。`,
      timestamp: Date.now(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: 'user_' + Date.now(),
      sender: 'user',
      text: inputText.trim(),
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: getApiHeaders(),
        body: JSON.stringify({
          question: fortuneSlip.question,
          fortuneSlip,
          messages: [...messages, userMsg].map((m) => ({
            sender: m.sender,
            text: m.text,
          })),
        }),
      });

      const data = await response.json();

      if (data.success && data.reply) {
        const masterReply: ChatMessage = {
          id: 'master_' + Date.now(),
          sender: 'master',
          text: data.reply,
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, masterReply]);
      } else {
        throw new Error(data.error || '大師開示獲取失敗');
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages((prev) => [
        ...prev,
        {
          id: 'error_' + Date.now(),
          sender: 'master',
          text: '善哉，大師刻正為信眾誦經祈福，請稍後重試追問。',
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickQuestion = (text: string) => {
    setInputText(text);
  };

  return (
    <div className="w-full rounded-xl bg-amber-950/60 border border-amber-500/20 p-4 space-y-4 shadow-inner">
      
      {/* Header Info */}
      <div className="flex items-center gap-2 pb-3 border-b border-amber-500/20 text-xs text-amber-300">
        <Bot className="w-4 h-4 text-amber-400" />
        <span className="font-serif font-bold">宮廟解籤大師隨堂線上請益：</span>
        <span className="text-amber-200/70">針對此籤詩進行深層剖析與現實建議</span>
      </div>

      {/* Messages List Container */}
      <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-2.5 text-xs md:text-sm ${
              msg.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.sender === 'master' && (
              <div className="w-7 h-7 rounded-full bg-amber-800 border border-amber-400/50 flex items-center justify-center shrink-0 text-amber-200 mt-0.5">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`p-3 rounded-2xl max-w-[82%] leading-relaxed font-sans ${
                msg.sender === 'user'
                  ? 'bg-amber-600 text-amber-950 font-medium rounded-tr-none'
                  : 'bg-amber-900/80 border border-amber-500/20 text-amber-100 rounded-tl-none font-serif'
              }`}
            >
              {msg.text}
            </div>

            {msg.sender === 'user' && (
              <div className="w-7 h-7 rounded-full bg-amber-700 border border-amber-300 flex items-center justify-center shrink-0 text-amber-100 mt-0.5">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-amber-300/80 font-serif italic py-1">
            <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
            <span>解籤大師正在為您卜算參研細節…</span>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Quick Prompts */}
      <div className="flex flex-wrap gap-1.5 pt-2 border-t border-amber-500/20">
        <span className="text-[11px] text-amber-400/70 font-serif block w-full">
          💡 快速向大師追問：
        </span>
        {[
          '大師，這個籤詩代表我應該主動還是靜觀其變？',
          '這支籤反映出最關鍵的時間點大概會落在哪個月份？',
          '若照詩籤指引，我現實中最需要調整的心態是什麼？',
        ].map((q, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleQuickQuestion(q)}
            className="text-[11px] px-2.5 py-1 rounded bg-amber-900/40 hover:bg-amber-800/60 border border-amber-500/20 text-amber-200/80 text-left transition-colors"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSendMessage} className="flex gap-2 pt-1">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="向解籤大師輸入您的疑惑，例如：這支籤對這兩個月的影響..."
          className="flex-1 bg-amber-950 border border-amber-500/30 rounded-xl px-3.5 py-2.5 text-xs md:text-sm text-amber-100 placeholder-amber-400/40 focus:outline-none focus:border-amber-400"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isLoading}
          className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-amber-950 font-serif font-bold text-xs md:text-sm shadow-md flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
        >
          <Send className="w-3.5 h-3.5" />
          <span>請益</span>
        </button>
      </form>
    </div>
  );
};
