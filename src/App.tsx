import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Header } from './components/Header';
import { DeitySelector } from './components/DeitySelector';
import { QuestionInput } from './components/QuestionInput';
import { IncenseRitual } from './components/IncenseRitual';
import { ShakingCylinderRitual } from './components/ShakingCylinderRitual';
import { MoonBlocksRitual } from './components/MoonBlocksRitual';
import { FortuneSlipView } from './components/FortuneSlipView';
import { FortuneHistory } from './components/FortuneHistory';
import { FortuneCardExport } from './components/FortuneCardExport';
import { DailyFortuneModal } from './components/DailyFortuneModal';
import { ApiKeyModal } from './components/ApiKeyModal';

import { DEITIES } from './data/deities';
import { DeityInfo, CategoryType, FortuneSlipData, DivinationStep } from './types';
import { soundFx } from './utils/soundEffects';
import { getApiHeaders, getCustomApiKey } from './utils/apiKey';
import { Sparkles, Loader2, AlertCircle, RefreshCw, Key } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'ai_fortune_slips_history_v1';

export default function App() {
  const [currentDeity, setCurrentDeity] = useState<DeityInfo>(DEITIES[0]);
  const [step, setStep] = useState<DivinationStep>('input');
  const [question, setQuestion] = useState('');
  const [category, setCategory] = useState<CategoryType>('general');
  const [userContext, setUserContext] = useState<{ gender?: string; birthYear?: string; timeframe?: string }>({});
  
  const [stickNumber, setStickNumber] = useState<number | null>(null);
  const [fortuneSlip, setFortuneSlip] = useState<FortuneSlipData | null>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [history, setHistory] = useState<FortuneSlipData[]>([]);
  
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showDailyModal, setShowDailyModal] = useState(false);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [hasCustomApiKey, setHasCustomApiKey] = useState(false);

  // Load history & API Key status on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        setHistory(JSON.parse(saved));
      }
      setHasCustomApiKey(!!getCustomApiKey());
    } catch (err) {
      console.error('Failed to load initial data from localStorage', err);
    }
  }, []);

  const refreshApiKeyStatus = () => {
    setHasCustomApiKey(!!getCustomApiKey());
  };

  // Sync history to localStorage
  const saveHistoryToStorage = (updatedHistory: FortuneSlipData[]) => {
    setHistory(updatedHistory);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedHistory));
    } catch (err) {
      console.error('Failed to save history to localStorage', err);
    }
  };

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundFx.enabled = next;
  };

  const handleReset = () => {
    setStep('input');
    setQuestion('');
    setStickNumber(null);
    setFortuneSlip(null);
    setErrorMessage(null);
  };

  // Step 1 -> Step 2
  const handleStartDivination = (
    q: string,
    cat: CategoryType,
    ctx: { gender?: string; birthYear?: string; timeframe?: string }
  ) => {
    setQuestion(q);
    setCategory(cat);
    setUserContext(ctx);
    setErrorMessage(null);
    setStep('incense');
  };

  // Step 2 -> Step 3
  const handleProceedToShaking = () => {
    setStep('shaking');
  };

  // Step 3 -> Step 4
  const handleStickDrawn = (num: number) => {
    setStickNumber(num);
    setStep('blocks');
  };

  // Step 4 -> Fetch API Result & Step 'result'
  const handleMoonBlocksConfirmed = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      soundFx.playTempleBell();

      const response = await fetch('/api/divine', {
        method: 'POST',
        headers: getApiHeaders(),
        body: JSON.stringify({
          question,
          category,
          deityId: currentDeity.id,
          deityName: currentDeity.name,
          userContext,
          stickNumber,
        }),
      });

      const data = await response.json();

      if (data.success && data.data) {
        const newSlip: FortuneSlipData = data.data;
        setFortuneSlip(newSlip);
        setStep('result');
      } else {
        throw new Error(data.error || '神威感應發生未預期狀況，請重試');
      }
    } catch (err) {
      console.error('Divination Error:', err);
      setErrorMessage(err instanceof Error ? err.message : '求籤靈感傳遞受阻，請點擊重試');
    } finally {
      setIsLoading(false);
    }
  };

  // History operations
  const handleSaveSlipToHistory = (slipToSave: FortuneSlipData) => {
    const exists = history.some((item) => item.id === slipToSave.id);
    if (!exists) {
      const updated = [slipToSave, ...history];
      saveHistoryToStorage(updated);
    }
  };

  const handleDeleteHistoryItem = (id: string) => {
    const updated = history.filter((item) => item.id !== id);
    saveHistoryToStorage(updated);
  };

  const handleClearAllHistory = () => {
    if (confirm('確定要清空所有典藏的詩籤紀錄嗎？')) {
      saveHistoryToStorage([]);
    }
  };

  const isCurrentSlipSaved = fortuneSlip ? history.some((item) => item.id === fortuneSlip.id) : false;

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-[#e0d8cc] flex flex-col font-serif relative overflow-x-hidden selection:bg-[#D4AF37] selection:text-[#0a0a0c]">
      
      {/* Background Atmosphere */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#3a1510] blur-[140px] opacity-40" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#1a2a2a] blur-[140px] opacity-40" />
      </div>

      {/* Header */}
      <Header
        currentDeity={currentDeity}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        onOpenHistory={() => setShowHistoryModal(true)}
        onReset={handleReset}
        onOpenDailyModal={() => setShowDailyModal(true)}
        onOpenApiKeyModal={() => setShowApiKeyModal(true)}
        hasCustomApiKey={hasCustomApiKey}
        historyCount={history.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 md:p-8 relative z-10 flex flex-col items-center justify-center">
        
        {/* Error Banner if any */}
        {errorMessage && (
          <div className="w-full mb-6 p-4 rounded-none bg-[#8b0000]/20 border border-[#8b0000] text-[#fcf9f2] text-xs md:text-sm flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xl backdrop-blur-md">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
              <button
                onClick={() => setShowApiKeyModal(true)}
                className="flex-1 sm:flex-none px-3 py-1.5 bg-[#D4AF37] hover:bg-[#c29f2f] text-black font-serif text-xs uppercase font-bold tracking-wider cursor-pointer flex items-center justify-center gap-1 transition-colors"
              >
                <Key className="w-3.5 h-3.5" />
                <span>設定 API Key</span>
              </button>
              <button
                onClick={handleMoonBlocksConfirmed}
                className="flex-1 sm:flex-none px-4 py-1.5 bg-[#8b0000] hover:bg-red-700 text-[#fcf9f2] font-serif text-xs uppercase tracking-widest cursor-pointer transition-colors"
              >
                重試
              </button>
            </div>
          </div>
        )}

        {/* Loading Overlay State */}
        {isLoading && (
          <div className="w-full py-20 bg-white/5 border border-white/10 rounded-lg text-center space-y-6 shadow-[0_0_50px_rgba(0,0,0,0.8)] backdrop-blur-md max-w-xl">
            <div className="relative w-16 h-16 mx-auto">
              <Loader2 className="w-16 h-16 text-[#D4AF37] animate-spin" />
              <Sparkles className="w-6 h-6 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
            </div>
            <div className="space-y-2">
              <h3 className="font-serif font-light tracking-[0.2em] text-xl md:text-2xl text-[#fcf9f2]">
                感應【{currentDeity.name}】天機中…
              </h3>
              <p className="text-xs md:text-sm text-white/50 tracking-widest font-light">
                正為信眾參研易經卦象、匹配古風詩籤與智語開示
              </p>
            </div>
          </div>
        )}

        {/* Step Flow Render */}
        {!isLoading && (
          <AnimatePresence mode="wait">
            
            {/* Step 1: Input Question & Select Deity */}
            {step === 'input' && (
              <motion.div
                key="input"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="w-full space-y-6"
              >
                {/* Deity Selection Grid */}
                <DeitySelector
                  selectedDeity={currentDeity}
                  onSelectDeity={(d) => setCurrentDeity(d)}
                />

                {/* Question Input Form */}
                <QuestionInput
                  currentDeity={currentDeity}
                  onStartDivination={handleStartDivination}
                  isLoading={isLoading}
                />
              </motion.div>
            )}

            {/* Step 2: Incense Ritual */}
            {step === 'incense' && (
              <motion.div
                key="incense"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-xl"
              >
                <IncenseRitual
                  currentDeity={currentDeity}
                  question={question}
                  onProceedToShaking={handleProceedToShaking}
                />
              </motion.div>
            )}

            {/* Step 3: Shaking Cylinder */}
            {step === 'shaking' && (
              <motion.div
                key="shaking"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-xl"
              >
                <ShakingCylinderRitual
                  currentDeity={currentDeity}
                  onStickDrawn={handleStickDrawn}
                />
              </motion.div>
            )}

            {/* Step 4: Moon Blocks Divination (擲盃) */}
            {step === 'blocks' && stickNumber !== null && (
              <motion.div
                key="blocks"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-xl"
              >
                <MoonBlocksRitual
                  currentDeity={currentDeity}
                  stickNumber={stickNumber}
                  question={question}
                  onConfirmed={handleMoonBlocksConfirmed}
                  onReshake={() => setStep('shaking')}
                />
              </motion.div>
            )}

            {/* Step 5: Fortune Result */}
            {step === 'result' && fortuneSlip && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="w-full"
              >
                <FortuneSlipView
                  fortuneSlip={fortuneSlip}
                  deity={currentDeity}
                  onSaveHistory={handleSaveSlipToHistory}
                  isSaved={isCurrentSlipSaved}
                  onOpenExportModal={() => setShowExportModal(true)}
                  onNewDivination={handleReset}
                />
              </motion.div>
            )}

          </AnimatePresence>
        )}

      </main>

      {/* Footer */}
      <footer className="py-6 px-6 border-t border-white/10 relative z-10 text-xs flex flex-col md:flex-row justify-between items-center gap-4 text-white/40 font-serif">
        <div className="flex gap-8 items-center text-center md:text-left">
          <div>
            <div className="text-[10px] text-white/30 uppercase tracking-[0.2em] mb-0.5">Oracle System</div>
            <div className="text-xs tracking-widest text-[#e0d8cc]">靈犀 · 萬象詩籤</div>
          </div>
          <div>
            <div className="text-[10px] text-white/30 uppercase tracking-[0.2em] mb-0.5">System Integrity</div>
            <div className="text-xs tracking-widest text-[#00ff88] flex items-center gap-1.5 justify-center md:justify-start">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00ff88] animate-pulse" />
              <span>連結穩固 / STABLE</span>
            </div>
          </div>
        </div>
        <div className="text-[9px] text-white/30 uppercase tracking-[0.3em] flex items-center gap-3">
          <span>Universal Oracle // v4.02</span>
          <span className="w-px h-3 bg-white/20" />
          <span>Encoded by Neural Fate Engine</span>
        </div>
      </footer>

      {/* Modals */}
      <FortuneHistory
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        history={history}
        onSelectSlip={(slip) => {
          setFortuneSlip(slip);
          setQuestion(slip.question);
          setStep('result');
        }}
        onDeleteSlip={handleDeleteHistoryItem}
        onClearAll={handleClearAllHistory}
      />

      {fortuneSlip && (
        <FortuneCardExport
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
          fortuneSlip={fortuneSlip}
        />
      )}

      <DailyFortuneModal
        isOpen={showDailyModal}
        onClose={() => setShowDailyModal(false)}
      />

      <ApiKeyModal
        isOpen={showApiKeyModal}
        onClose={() => setShowApiKeyModal(false)}
        onKeyUpdated={refreshApiKeyStatus}
      />

    </div>
  );
}
