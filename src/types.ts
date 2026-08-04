export type DeityId = 'guanyin' | 'guansheng' | 'mazu' | 'yuelao' | 'wenchang' | 'caishen' | 'zhuge';

export type CategoryType = 'career' | 'love' | 'wealth' | 'health' | 'studies' | 'travel' | 'family' | 'general';

export type FortuneGrade = '大吉' | '上上' | '上吉' | '中吉' | '中平' | '半吉' | '小吉' | '末吉' | '下下';

export interface DeityInfo {
  id: DeityId;
  name: string;
  title: string;
  domain: string;
  description: string;
  elementColor: string;
  bgGradient: string;
  accentBorder: string;
  iconName: string;
  blessings: string[];
  quote: string;
}

export interface FortuneSlipData {
  id: string;
  timestamp: number;
  question: string;
  category: CategoryType;
  deityId: DeityId;
  deityName: string;
  userContext?: {
    gender?: string;
    birthYear?: string;
    timeframe?: string;
  };
  slipNumber: number; // 1 ~ 100
  grade: FortuneGrade;
  title: string; // e.g. "第三十八籤【趙子龍救阿斗】"
  poemLines: string[]; // 4 lines of classical poem
  story: string; // Historical allusion title & background
  storyMeaning: string; // Meaning of the historical story
  overallSummary: string; // Core summary / trend
  directAnswer: string; // Direct response to user's question
  categoryDetails: {
    career?: string;
    love?: string;
    wealth?: string;
    health?: string;
    studies?: string;
    travel?: string;
    family?: string;
  };
  dos: string[]; // 宜
  donts: string[]; // 忌
  remedyAdvice: string; // 破局轉運建議
  blessingKeywords: string[]; // Key wisdom tags
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'master';
  text: string;
  timestamp: number;
}

export type DivinationStep = 
  | 'input'           // Asking question & selecting deity
  | 'incense'         // Lighting incense / praying
  | 'shaking'         // Shaking fortune cylinder
  | 'blocks'          // Throwing Moon blocks (擲筊)
  | 'result'          // Viewing the fortune slip & analysis
  | 'history';        // Viewing saved fortune history
