import React, { useState, useEffect } from 'react';
import { X, Key, Eye, EyeOff, ExternalLink, Check, Trash2, ShieldCheck, Loader2, CheckCircle2, AlertCircle, Activity, Cpu, Sparkles } from 'lucide-react';
import {
  getCustomApiKey,
  setCustomApiKey,
  removeCustomApiKey,
  getCustomModel,
  setCustomModel,
  SUPPORTED_MODELS,
} from '../utils/apiKey';
import { soundFx } from '../utils/soundEffects';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeyUpdated?: () => void;
}

interface AvailableModelInfo {
  id: string;
  name: string;
  type: string;
  desc: string;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  onClose,
  onKeyUpdated,
}) => {
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [selectedModel, setSelectedModel] = useState('gemini-3.6-flash');
  const [showKey, setShowKey] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
    availableModels?: AvailableModelInfo[];
  } | null>(null);

  useEffect(() => {
    if (isOpen) {
      setApiKeyInput(getCustomApiKey());
      setSelectedModel(getCustomModel());
      setSavedSuccess(false);
      setTestResult(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTestKey = async () => {
    if (!apiKeyInput.trim()) {
      setTestResult({
        success: false,
        message: '請先輸入 Gemini API Key 再進行測試驗證。',
      });
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    try {
      soundFx.playWoodenFish();
      const res = await fetch('/api/verify-key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-gemini-api-key': apiKeyInput.trim(),
          'x-gemini-model': selectedModel,
        },
      });

      const data = await res.json();
      if (res.ok && data.success) {
        soundFx.playTempleBell();
        setTestResult({
          success: true,
          message: data.message || `API Key 驗證成功！可正常連線 Gemini 模型。`,
          availableModels: data.availableModels,
        });
      } else {
        setTestResult({
          success: false,
          message: data.error || '驗證失敗：API Key 無效或無法連線 Gemini API。',
        });
      }
    } catch (err) {
      console.error('Verify Key Error:', err);
      setTestResult({
        success: false,
        message: '網路連線異常或伺服器無法處理驗證，請再試一次。',
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    soundFx.playTempleBell();
    setCustomApiKey(apiKeyInput);
    setCustomModel(selectedModel);
    setSavedSuccess(true);
    if (onKeyUpdated) onKeyUpdated();
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  const handleClear = () => {
    soundFx.playWoodenFish();
    removeCustomApiKey();
    setApiKeyInput('');
    setSelectedModel('gemini-3.6-flash');
    setCustomModel('gemini-3.6-flash');
    setTestResult(null);
    if (onKeyUpdated) onKeyUpdated();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="w-full max-w-lg bg-[#0a0a0c] border border-white/10 rounded-lg p-6 text-white shadow-2xl space-y-5 relative max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 sticky top-0 bg-[#0a0a0c] z-10 pt-1">
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-[#D4AF37]" />
            <h2 className="font-serif font-bold text-base text-[#fcf9f2] tracking-wider uppercase">
              設定與驗證 Gemini API Key
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 bg-white/5 hover:bg-white/10 text-white/70 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Info */}
        <div className="p-3.5 bg-white/5 border border-white/10 text-xs text-white/80 space-y-2 leading-relaxed">
          <div className="flex items-center gap-1.5 font-bold text-[#D4AF37] font-serif">
            <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
            <span>100% 由您的 Gemini AI 模型運作</span>
          </div>
          <p>
            貼上您的 <strong>Gemini API Key</strong> 後，可點擊「測試驗證 Key」由系統連線測試所選之 Gemini 模型，確認金鑰可正常使用並查看可用的模型選項。
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSave} className="space-y-5">
          <div>
            <label className="block text-xs font-serif text-[#D4AF37] mb-1.5 uppercase tracking-wider">
              您的 Gemini API Key
            </label>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKeyInput}
                onChange={(e) => {
                  setApiKeyInput(e.target.value);
                  setTestResult(null);
                }}
                placeholder="貼上 AI Studio 取得的 AIzaSy..."
                className="w-full bg-black border border-white/20 rounded-none pl-3 pr-10 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#D4AF37] font-mono"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/50 hover:text-white cursor-pointer"
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Model Selection */}
          <div className="space-y-2">
            <label className="flex items-center gap-1.5 text-xs font-serif text-[#D4AF37] uppercase tracking-wider">
              <Cpu className="w-4 h-4 text-[#D4AF37]" />
              <span>選擇 AI 運算模型 (Gemini Model)</span>
            </label>
            <div className="grid grid-cols-1 gap-2">
              {SUPPORTED_MODELS.map((model) => {
                const isSelected = selectedModel === model.id;
                return (
                  <div
                    key={model.id}
                    onClick={() => {
                      soundFx.playWoodenFish();
                      setSelectedModel(model.id);
                    }}
                    className={`p-3 border text-left cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-[#D4AF37]/15 border-[#D4AF37] text-white shadow-lg'
                        : 'bg-white/5 border-white/10 hover:border-white/30 text-white/70'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                            isSelected ? 'border-[#D4AF37] bg-[#D4AF37]' : 'border-white/30'
                          }`}
                        >
                          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-black" />}
                        </div>
                        <span className="font-serif font-bold text-xs text-[#fcf9f2]">
                          {model.name}
                        </span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 bg-black/60 border border-white/15 text-[#D4AF37] font-serif">
                        {model.tag}
                      </span>
                    </div>
                    <p className="text-[11px] text-white/60 mt-1.5 font-light leading-relaxed pl-5">
                      {model.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Test Action & Result Display */}
          <div className="space-y-2 pt-1">
            <button
              type="button"
              onClick={handleTestKey}
              disabled={isTesting}
              className="w-full py-2.5 bg-white/10 hover:bg-white/15 border border-white/20 text-white font-serif text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              {isTesting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 text-[#D4AF37] animate-spin" />
                  <span>連線 Gemini AI 模型測試中…</span>
                </>
              ) : (
                <>
                  <Activity className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>測試驗證 Key 與當前模型 ({selectedModel})</span>
                </>
              )}
            </button>

            {testResult && (
              <div
                className={`p-3.5 border text-xs font-serif leading-relaxed space-y-2.5 ${
                  testResult.success
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                    : 'bg-[#8b0000]/30 border-[#8b0000] text-red-200'
                }`}
              >
                <div className="flex items-start gap-2">
                  {testResult.success ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <div className="font-bold">{testResult.success ? '【連線驗證成功】' : '【連線驗證失敗】'}</div>
                    <div className="mt-0.5">{testResult.message}</div>
                  </div>
                </div>

                {/* Show details of supported models when success */}
                {testResult.success && testResult.availableModels && (
                  <div className="pt-2 border-t border-emerald-500/30 text-[11px] space-y-1.5">
                    <div className="flex items-center gap-1 text-[#D4AF37] font-bold">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>此 API Key 支援的可呼叫模型一覽：</span>
                    </div>
                    <div className="space-y-1 pl-1">
                      {testResult.availableModels.map((m) => (
                        <div key={m.id} className="flex items-start justify-between gap-2 text-white/90 bg-black/40 p-1.5 border border-emerald-500/20">
                          <div>
                            <span className="font-bold text-[#D4AF37]">{m.name}</span>
                            <span className="text-white/60 text-[10px] ml-1.5">({m.type})</span>
                            <p className="text-[10px] text-white/50">{m.desc}</p>
                          </div>
                          <span className="text-[10px] text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 shrink-0">
                            即可調用
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Tutorial Link & Clear */}
          <div className="flex items-center justify-between text-xs pt-1">
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#D4AF37] hover:underline flex items-center gap-1 font-serif text-[11px]"
            >
              <span>免費申請 Gemini API Key (Google AI Studio)</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            {getCustomApiKey() && (
              <button
                type="button"
                onClick={handleClear}
                className="text-red-400 hover:text-red-300 flex items-center gap-1 text-[11px] font-serif cursor-pointer"
              >
                <Trash2 className="w-3 h-3" />
                <span>清除 Key 與設定</span>
              </button>
            )}
          </div>

          {/* Save Button */}
          <button
            type="submit"
            className="w-full py-3 bg-[#D4AF37] hover:bg-[#c29f2f] text-black font-serif font-bold text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg"
          >
            {savedSuccess ? (
              <>
                <Check className="w-4 h-4 text-black" />
                <span>設定已成功儲存</span>
              </>
            ) : (
              <span>儲存金鑰與所選 AI 模型</span>
            )}
          </button>
        </form>

      </div>
    </div>
  );
};
