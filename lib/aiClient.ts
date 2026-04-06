const geminiKeys = [
  process.env.GEMINI_API_KEY_1,
  process.env.GEMINI_API_KEY_2,
  process.env.GEMINI_API_KEY_3,
].filter(Boolean) as string[];

const groqKeys = [
  process.env.GROQ_API_KEY_1,
  process.env.GROQ_API_KEY_2,
  process.env.GROQ_API_KEY_3,
].filter(Boolean) as string[];

const deepseekKeys = [
  process.env.DEEPSEEK_API_KEY_1,
  process.env.DEEPSEEK_API_KEY_2,
  process.env.DEEPSEEK_API_KEY_3,
].filter(Boolean) as string[];

// 라운드로빈 카운터
let geminiIdx = 0;
let groqIdx = 0;
let deepseekIdx = 0;

export function getGeminiKey(): string {
  const key = geminiKeys[geminiIdx % geminiKeys.length];
  geminiIdx++;
  return key;
}

export function getGroqKey(): string {
  const key = groqKeys[groqIdx % groqKeys.length];
  groqIdx++;
  return key;
}

export function getDeepSeekKey(): string {
  const key = deepseekKeys[deepseekIdx % deepseekKeys.length];
  deepseekIdx++;
  return key;
}