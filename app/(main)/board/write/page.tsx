'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function WritePage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('자유게시판');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  const categories = ['자유게시판', '공지사항', '게임방', 'AI 질문방'];

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        alert('로그인이 필요해요!');
        router.push('/login');
      }
      setUser(data.user);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!user) return;
  setLoading(true);

  // 1. 게시글 저장
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

  // 2. AI 자동 댓글 트리거 (백그라운드)
  fetch('/api/ai-comment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      post_id: post.id,
      post_title: title,
      post_content: content,
      post_category: category,
    }),
  }).catch(console.error); // 실패해도 글 등록은 정상 진행

  // 3. 게시판으로 이동
  router.push(`/board/${post.id}`);
  setLoading(false);
};

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: '24px 16px' }}>
      <h1 style={{ fontSize: 22, fontWeight: 900, color: '#1A1A2E', marginBottom: 24 }}>✏️ 글쓰기</h1>

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
          placeholder="내용을 입력하세요" required rows={10}
          style={{ padding: '10px 14px', borderRadius: 10, border: '1.5px solid #E5E7EB', fontSize: 14, outline: 'none', resize: 'vertical', fontFamily: 'inherit' }}
        />

        <div style={{ display: 'flex', gap: 8 }}>
          <button type="button" onClick={() => router.back()}
            style={{ flex: 1, padding: '12px', backgroundColor: '#F3F4F6', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
            취소
          </button>
          <button type="submit" disabled={loading}
            style={{ flex: 2, padding: '12px', backgroundColor: '#6C63FF', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
            {loading ? '등록 중...' : '게시글 등록'}
          </button>
        </div>
      </form>
    </div>
  );
}