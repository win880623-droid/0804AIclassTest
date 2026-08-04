import { CategoryType } from '../types';

export interface PresetQuestion {
  category: CategoryType;
  text: string;
  iconName: string;
}

export const PRESET_QUESTIONS: PresetQuestion[] = [
  { category: 'career', text: '近期是否適合跳槽換工作或自行創業？', iconName: 'Briefcase' },
  { category: 'career', text: '當前工作遭遇升遷瓶頸，未來半年職涯走勢如何？', iconName: 'TrendingUp' },
  { category: 'love', text: '與目前的對象是否有發展成正緣的可能？', iconName: 'Heart' },
  { category: 'love', text: '單身許久，今年內是否會有合適的良緣出現？', iconName: 'Sparkles' },
  { category: 'wealth', text: '近期進行的新投資或理財項目是否有獲利機會？', iconName: 'Coins' },
  { category: 'wealth', text: '如何擺脫財務吃緊的困境，正財運何時會轉好？', iconName: 'Wallet' },
  { category: 'studies', text: '即將到來的國家考試/證照/升學考運如何？', iconName: 'GraduationCap' },
  { category: 'health', text: '近來身心疲憊，健康狀況與調理指引為何？', iconName: 'Activity' },
  { category: 'travel', text: '計劃出國遠行/搬家移居，過程是否順利平安？', iconName: 'Plane' },
  { category: 'general', text: '面對目前的重大抉擇，我該堅持還是選擇順其自然？', iconName: 'Compass' }
];
