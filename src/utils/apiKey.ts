const API_KEY_STORAGE_KEY = 'user_gemini_api_key';
const SELECTED_MODEL_STORAGE_KEY = 'user_gemini_selected_model';

export const SUPPORTED_MODELS = [
  {
    id: 'gemini-3.6-flash',
    name: 'Gemini 3.6 Flash',
    desc: '最新旗艦高速模型，回應極速且對易經文采掌握精準（預設推薦）',
    tag: '推薦首選',
  },
  {
    id: 'gemini-3.1-pro',
    name: 'Gemini 3.1 Pro',
    desc: '高階邏輯推理模型，擅長深度解析卦意與玄學命理靈感細節',
    tag: '深度解籤',
  },
  {
    id: 'gemini-2.5-flash',
    name: 'Gemini 2.5 Flash',
    desc: '經典輕量速算模型，反應極快且運作穩定',
    tag: '穩定快速',
  },
];

export function getCustomApiKey(): string {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem(API_KEY_STORAGE_KEY) || '';
}

export function setCustomApiKey(key: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(API_KEY_STORAGE_KEY, key.trim());
}

export function removeCustomApiKey(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(API_KEY_STORAGE_KEY);
}

export function getCustomModel(): string {
  if (typeof window === 'undefined') return 'gemini-3.6-flash';
  return localStorage.getItem(SELECTED_MODEL_STORAGE_KEY) || 'gemini-3.6-flash';
}

export function setCustomModel(modelId: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SELECTED_MODEL_STORAGE_KEY, modelId);
}

export function getApiHeaders(additionalHeaders: Record<string, string> = {}): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...additionalHeaders,
  };
  const key = getCustomApiKey();
  if (key) {
    headers['x-gemini-api-key'] = key;
  }
  const model = getCustomModel();
  if (model) {
    headers['x-gemini-model'] = model;
  }
  return headers;
}
