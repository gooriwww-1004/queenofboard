import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    console.log('API KEY 확인:', apiKey ? '있음' : '없음');

    if (!apiKey) {
      return NextResponse.json({ error: 'API 키 없음' }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const { messages } = await req.json();
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const last = messages[messages.length - 1];

    console.log('메시지 확인:', last.content);

    const result = await model.generateContent(last.content);
    const text = result.response.text();

    console.log('응답 확인:', text.slice(0, 50));

    return NextResponse.json({ content: text });
  } catch (e: any) {
    console.error('에러 상세:', e.message);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}