'use client';
import { useState, useEffect, Suspense } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter, useSearchParams } from 'next/navigation';
import { givePoints } from '@/lib/points';

// useSearchParams는 Suspense 안에서 써야 함
function WriteForm() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('자유게시판');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  const categories = ['자유게시판', '공지사항', '게임방', 'AI 질문방'];

  useEffect(() => {
    // 로그인 확인
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        alert('로그인이 필요해요!');
        router.push('/login');
      }
      setUser(data.user);
    });

    // ✅ 에테르 프레스에서 넘어온 제목 자동입력
    const autoTitle = searchParams.get('title');
    if (autoTitle) {
      setTitle(decodeURIComponent(autoTitle));
      // 에테르 프레스 감상글이면 자유게시판으로 기본 설정
      setCategory('자유게시판');
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    await givePoints(user.id, 5000, '게시글 작성');

    const { data: post, error } = await supabase.from('posts').insert({
      title,
      content,
      category,
      author_id: user.id,
      author_name: user.user_metadata?.nickname || '익명',
    }).select().single();

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    fetch('/api/ai-comment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        post_id: post.id,
        post_title: title,
        post_content: content,
        post_category: category,
      }),
    }).catch(console.error);

    router.push(`/board/${post.id}`);
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: '24px 16px' }}>
      <h1 style={{ fontSize: 22, fontWeight: 900, color: '#1A1A2E', marginBottom: 4 }}>
        ✏️ 글쓰기
      </h1>

      {/* 에테르 프레스에서 넘어왔을 때 안내 */}
      {title.includes('[') && title.includes('감상') && (
        <div style={{
          marginBottom: 20, padding: '10px 14px', borderRadius: 10,
          background: 'linear-gradient(135deg, #EDE9FE, #E0F2FE)',
          fontSize: 13, color: '#6C63FF', fontWeight: 600,
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          📰 에테르 프레스 창작물 감상글입니다. 자유롭게 내용을 채워주세요!
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <select value={category} onChange={e => setCategory(e.target.value)}
          style={{ padding: '10px 14px', borderRadius: 10, border: '1.5px solid #E5E7EB', fontSize: 14, outline: 'none' }}>
          {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>

        <input
          type="text" value={title} onChange={e => setTitle(e.target.value)}
          placeholder="제목을 입력하세요" required
          style={{ padding: '10px 14px', borderRadius: 10, border: '1.5px solid #E5E7EB', fontSize: 14, outline: 'none' }}
        />

        <textarea
          value={content} onChange={e => setContent(e.target.value)}
          placeholder="에테르 프레스 창작물을 읽고 어떤 느낌이 드셨나요? 자유롭게 감상을 남겨주세요 ✨"
          required rows={10}
          style={{ padding: '10px 14px', borderRadius: 10, border: '1.5px solid #E5E7EB', fontSize: 14, outline: 'none', resize: 'vertical', fontFamily: 'inherit' }}
        />

        <div style={{ display: 'flex', gap: 8 }}>
          <button type="button" onClick={() => router.back()}
            style={{ flex: 1, padding: '12px', backgroundColor: '#F3F4F6', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
            취소
          </button>
          <button type="submit" disabled={loading}
            style={{ flex: 2, padding: '12px', backgroundColor: '#6C63FF', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
            {loading ? '등록 중...' : '게시글 등록 👑'}
          </button>
        </div>
      </form>
    </div>
  );
}

// Suspense 래핑 (Next.js useSearchParams 필수)
export default function WritePage() {
  return (
    <Suspense fallback={
      <div style={{ textAlign: 'center', padding: 60, color: '#9CA3AF' }}>
        <div style={{ fontSize: 32 }}>⏳</div>
        불러오는 중...
      </div>
    }>
      <WriteForm />
    </Suspense>
  );
}
