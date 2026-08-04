import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Helper: Get target model from headers/body or default to gemini-3.6-flash
const getTargetModel = (req?: express.Request): string => {
  const customModel = (req?.headers['x-gemini-model'] as string) || req?.body?.model;
  return customModel?.trim() || 'gemini-3.6-flash';
};

// Initialize Gemini Client
const getGeminiClient = (req?: express.Request) => {
  const customApiKey = (req?.headers['x-gemini-api-key'] as string) || req?.body?.apiKey;
  const apiKey = customApiKey?.trim() || process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error('未檢測到 Gemini API Key。請在頂部選單「設定 API Key」輸入您個人的 Gemini API Key，或設定 GEMINI_API_KEY 環境變數。');
  }
  return new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// API Route: Verify API Key Status (/api/verify-key)
app.post('/api/verify-key', async (req, res) => {
  try {
    const ai = getGeminiClient(req);
    const targetModel = getTargetModel(req);

    // Perform a lightweight model test request with the selected model
    const response = await ai.models.generateContent({
      model: targetModel,
      contents: 'Ping test',
    });

    if (response && response.text) {
      return res.json({
        success: true,
        message: `API Key 驗證成功！已成功連線至【${targetModel}】模型。`,
        testedModel: targetModel,
        availableModels: [
          { id: 'gemini-3.6-flash', name: 'Gemini 3.6 Flash', type: '旗艦極速', desc: '最新世代模型，回應速度極快，兼具高文采與嚴謹結構。' },
          { id: 'gemini-3.1-pro', name: 'Gemini 3.1 Pro', type: '高階深度推理', desc: '適合複雜卦象邏輯推演與古籍詩文深度解析。' },
          { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', type: '經典穩定輕量', desc: '反應靈敏且運作非常穩定。' },
        ],
      });
    }

    throw new Error('模型並未回傳有效回應');
  } catch (error) {
    console.error('API Key Verification Error:', error);
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'API Key 驗證失敗，請檢查 Key 是否正確或權限是否開啟。',
    });
  }
});

// API Route: Fortune Divination Generation (/api/divine)
app.post('/api/divine', async (req, res) => {
  try {
    const { question, category, deityId, deityName, userContext } = req.body;

    if (!question || typeof question !== 'string') {
      return res.status(400).json({ error: '請提供有效的求問問題' });
    }

    const ai = getGeminiClient(req);
    const targetModel = getTargetModel(req);

    const systemInstruction = `你是一位高深精通傳統道教、佛教靈籤典籍與易經象數的宮廟國學大師與解籤宗師。
你的任務是根據使用者所祈求的神明（例如：${deityName || '觀音佛祖'}）以及使用者提出的具體疑問，為其求得一支極具傳統文采、詩意深刻且極具針對性的靈籤。

注意事項：
1. 詩籤（poemLines）必須為經典的四句七言詩，押韻嚴謹、意境深遠，充滿典雅古風。
2. 籤品等級（grade）請根據問題性質與機緣給予（例如：大吉、上上、上吉、中吉、中平、半吉、小吉、末吉、下下）。
3. 典故故事（story）必須包含經典的歷史事件或傳奇典故（如：趙子龍單騎救主、姜太公釣魚、蘇武牧羊、劉備三顧茅廬、薛仁貴征東、蕭何月下追韓信等）。
4. 針對性解答（directAnswer）必須非常具體地回答使用者的疑問：給出極其切中要害、充滿智慧且給人方向的具體解析，切忌含糊其詞。
5. 宜（dos）與 忌（donts）各給出 2~4 條具體可行的行動指引。
6. 破局轉運建議（remedyAdvice）給出指點迷津的心境轉變或具體轉運錦囊。
7. 分項運勢（categoryDetails）需簡短針對事業、愛情、求財、健康、學業、遠行、家庭給出 1~2 句評語。

請嚴格輸出 JSON 格式。`;

    const promptText = `
使用者求問問題：${question}
問卜類別：${category || 'general'}
祈求神明：${deityName || '觀音佛祖'}
使用者資訊：${userContext?.gender ? `性別: ${userContext.gender}` : ''} ${userContext?.birthYear ? `出生年: ${userContext.birthYear}` : ''} ${userContext?.timeframe ? `時間跨度: ${userContext.timeframe}` : ''}

請為使用者生成靈籤與全方位解籤：
`;

    const response = await ai.models.generateContent({
      model: targetModel,
      contents: promptText,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            slipNumber: { type: Type.INTEGER, description: '1 to 100 random fortune stick number' },
            grade: { type: Type.STRING, description: 'Fortune grade like 大吉, 上上, 上吉, 中吉, 中平, 半吉, 下下' },
            title: { type: Type.STRING, description: 'Fortune slip title e.g. 第三十八籤【姜太公釣魚】' },
            poemLines: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Exactly 4 lines of 7-character classical rhymed poem',
            },
            story: { type: Type.STRING, description: 'Name and brief history of the historical allusion/story' },
            storyMeaning: { type: Type.STRING, description: 'Meaning and symbolism of the historical allusion' },
            overallSummary: { type: Type.STRING, description: 'Overall fortune trend summary' },
            directAnswer: { type: Type.STRING, description: 'Direct answer tailored to user question' },
            categoryDetails: {
              type: Type.OBJECT,
              properties: {
                career: { type: Type.STRING },
                love: { type: Type.STRING },
                wealth: { type: Type.STRING },
                health: { type: Type.STRING },
                studies: { type: Type.STRING },
                travel: { type: Type.STRING },
                family: { type: Type.STRING },
              },
            },
            dos: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'List of recommended actions (宜)',
            },
            donts: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'List of forbidden actions (忌)',
            },
            remedyAdvice: { type: Type.STRING, description: 'Mindset / action advice to overcome difficulties or enhance good luck' },
            blessingKeywords: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '3-4 keywords of wisdom e.g. ["沉時務實", "靜待時機", "貴人相助"]',
            },
          },
          required: ['slipNumber', 'grade', 'title', 'poemLines', 'story', 'storyMeaning', 'overallSummary', 'directAnswer', 'dos', 'donts', 'remedyAdvice', 'blessingKeywords'],
        },
      },
    });

    const resultText = response.text || '{}';
    const fortuneData = JSON.parse(resultText);

    res.json({
      success: true,
      data: {
        id: 'slip_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
        timestamp: Date.now(),
        question,
        category: category || 'general',
        deityId: deityId || 'guanyin',
        deityName: deityName || '觀音佛祖',
        userContext,
        ...fortuneData,
      },
    });
  } catch (error) {
    console.error('Divination Error:', error);
    res.status(500).json({
      error: '【AI 運算失敗】本程式 100% 依賴 Gemini AI 模型運作。請確認已設定有效的 GEMINI_API_KEY。',
      details: error instanceof Error ? error.message : String(error),
    });
  }
});

// API Route: AI Real-time Daily Fortune (/api/daily)
app.post('/api/daily', async (req, res) => {
  try {
    const ai = getGeminiClient(req);
    const targetModel = getTargetModel(req);

    const systemInstruction = `你是一位高深精通周易八卦與時節氣場的宮廟靈籤大師。
請為使用者即時算出「今日一籤與晨起運勢開示」。
請輸出 JSON 格式：
- grade: 運勢等級（如 大吉, 上上, 中吉, 半吉, 沉時蓄勢）
- title: 八字四字標題（如 紫氣東來・萬事亨通）
- quote: 一句典雅深刻的古風名言警句（12~20字）
- advice: 今日具體行動心法與宜忌建議（40~60字）
- luckyColor: 幸運色彩（如 朱砂紅 / 帝王黃）
- luckyNumber: 幸運數字（如 3, 8）`;

    const response = await ai.models.generateContent({
      model: targetModel,
      contents: `請即時分析今日（${new Date().toLocaleDateString('zh-TW')}）的晨起天機運勢：`,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            grade: { type: Type.STRING },
            title: { type: Type.STRING },
            quote: { type: Type.STRING },
            advice: { type: Type.STRING },
            luckyColor: { type: Type.STRING },
            luckyNumber: { type: Type.STRING },
          },
          required: ['grade', 'title', 'quote', 'advice', 'luckyColor', 'luckyNumber'],
        },
      },
    });

    const dailyData = JSON.parse(response.text || '{}');
    res.json({ success: true, data: dailyData });
  } catch (error) {
    console.error('Daily Fortune AI Error:', error);
    res.status(500).json({
      error: '【AI 運算失敗】本程式必須連接 Gemini AI 才能即時生成今日運勢。',
      details: error instanceof Error ? error.message : String(error),
    });
  }
});

// API Route: Temple Master Follow-up Chat (/api/chat)
app.post('/api/chat', async (req, res) => {
  try {
    const { question, fortuneSlip, messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: '訊息紀錄無效' });
    }

    const ai = getGeminiClient(req);
    const targetModel = getTargetModel(req);

    const systemInstruction = `你是一位高潔慈祥的宮廟住持解籤宗師（玄學大師）。
使用者剛剛求得了一支靈籤：
求問問題：${question || fortuneSlip?.question || '未提供'}
祈求神尊：${fortuneSlip?.deityName || '宮廟神明'}
籤詩等級：${fortuneSlip?.grade || ''}（${fortuneSlip?.title || ''}）
籤詩內容：${fortuneSlip?.poemLines?.join(' / ') || ''}
歷史典故：${fortuneSlip?.story || ''}
核心解析：${fortuneSlip?.directAnswer || ''}

請以語氣溫和慈祥、語意透徹、富含智慧哲理且切中要害的語氣，回答使用者針對此籤詩提出的追問或心中疑惑。
請用繁體中文回答，適度運用玄學禪意與現實建議，給予溫暖而堅定的指引。`;

    // Convert message log to Gemini chat format
    const contents = messages.map((m: { sender: string; text: string }) => ({
      role: m.sender === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }],
    }));

    const response = await ai.models.generateContent({
      model: targetModel,
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const replyText = response.text || '善哉，請靜心體會詩籤意境，順應時節，必有轉機。';

    res.json({
      success: true,
      reply: replyText,
    });
  } catch (error) {
    console.error('Chat Error:', error);
    res.status(500).json({
      error: '大師開示過程中感應中斷，請重試。',
      details: error instanceof Error ? error.message : String(error),
    });
  }
});

// Setup Vite for development or express static for production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AI Fortune Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
