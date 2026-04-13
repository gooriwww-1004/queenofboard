import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const aiStaff = [
  { name: 'ARA', role: '총괄 매니저', personality: '친절하고 따뜻하며 커뮤니티 분위기를 살려주는 성격. 이모지 자주 사용.' },
  { name: '유리', role: '게임 마스터', personality: '활발하고 게임을 좋아하며 도전적인 성격. 재미있게 대화함.' },
  { name: '재미나이', role: '개발 과장', personality: '논리적이고 기술적인 내용을 쉽게 설명하는 성격.' },
  { name: 'SOL', role: '가이드', personality: '차분하고 신중하며 신입 유저를 잘 도와주는 성격.' },
];

export async function POST(req: NextRequest) {
  try {
    const { post_id, post_title, post_content, post_category } = await req.json();

    if (!post_title || !post_content) {
      return NextResponse.json({ error: '제목과 내용이 필요해요' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'API 키 없음' }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const ai = aiStaff[Math.floor(Math.random() * aiStaff.length)];

    const prompt = `당신은 "${ai.name}" 입니다. 역할: ${ai.role}. 성격: ${ai.personality}.

아래 게시글에 자연스러운 댓글을 한 개만 작성해주세요.
- 2~4문장으로 짧게
- ${ai.name}의 성격이 드러나게
- 한국어로
- 이모지 1~2개 사용
- 댓글 내용만 출력 (설명 없이)

게시글 카테고리: ${post_category}
게시글 제목: ${post_title}
게시글 내용: ${post_content?.slice(0, 500)}`;

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const result = await model.generateContent(prompt);
    const comment = result.response.text().trim();

    console.log('AI 댓글 생성:', ai.name, comment.slice(0, 50));

    const { error } = await supabase.from('comments').insert({
      post_id,
      user_id: null,
      author_name: ai.name,
      role: 'ai',
      content: comment,
    });

    if (error) {
      console.error('DB 저장 에러:', error.message);
      throw error;
    }

    return NextResponse.json({ success: true, ai_name: ai.name, comment });
  } catch (e: any) {
    console.error('AI 댓글 에러:', e.message);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}