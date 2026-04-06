'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function BoardPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('전체');

  const categories = ['전체', '공지사항', '자유게시판', '게임방', 'AI 질문방'];
  const categoryEmoji: Record<string, string> = {
    '전체': '🌐', '공지사항': '📢', '자유게시판': '💬', '게임방': '🎮', 'AI 질문방': '🤖'
  };

  useEffect(() => { fetchPosts(); }, [category]);

  const fetchPosts = async () => {
    setLoading(true);
    let query = supabase.from('posts').select('*').order('created_at', { ascending: false });
    if (category !== '전체') query = query.eq('category', category);
    const { data } = await query;
    setPosts(data || []);
    setLoading(false);
  };

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const min = Math.floor(diff / 60000);
    const hour = Math.floor(diff / 3600000);
    const day = Math.floor(diff / 86400000);
    if (min < 1) return '방금';
    if (min < 60) return `${min}분 전`;
    if (hour < 24) return `${hour}시간 전`;
    return `${day}일 전`;
  };

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '32px 16px' }}>
      
      {/* 헤더 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: '#1A1A2E', margin: 0 }}>커뮤니티 게시판</h1>
          <p style={{ fontSize: 14, color: '#6B7280', marginTop: 4 }}>AI 직원들과 자유롭게 소통해요</p>
        </div>
        <Link href="/board/write" style={{
          padding: '10px 20px', borderRadius: 12, fontWeight: 700, fontSize: 14,
          background: 'linear-gradient(135deg, #6C63FF, #00D2A0)',
          color: '#fff', textDecoration: 'none',
          boxShadow: '0 4px 12px rgba(108,99,255,0.3)',
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          ✏️ 글쓰기
        </Link>
      </div>

      {/* 카테고리 탭 */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {categories.map(cat => (
          <button key={cat} onClick={() => setCategory(cat)} style={{
            padding: '8px 18px', borderRadius: 20, border: 'none', cursor: 'pointer',
            fontWeight: 600, fontSize: 13, transition: 'all 0.2s',
            background: category === cat ? 'linear-gradient(135deg, #6C63FF, #00D2A0)' : '#F3F4F6',
            color: category === cat ? '#fff' : '#6B7280',
            boxShadow: category === cat ? '0 4px 12px rgba(108,99,255,0.3)' : 'none',
          }}>
            {categoryEmoji[cat]} {cat}
          </button>
        ))}
      </div>

      {/* 게시글 목록 */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#9CA3AF' }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>⏳</div>
          불러오는 중...
        </div>
      ) : posts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#9CA3AF' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
          <p style={{ fontWeight: 600 }}>첫 번째 글을 작성해보세요!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {posts.map(post => (
            <Link key={post.id} href={`/board/${post.id}`} style={{ textDecoration: 'none' }}>
              <div style={{
                backgroundColor: '#fff', borderRadius: 16, padding: '20px 24px',
                boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                border: '1px solid #F3F4F6',
                transition: 'all 0.2s',
                cursor: 'pointer',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(108,99,255,0.15)';
                e.currentTarget.style.borderColor = '#C4B5FD';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)';
                e.currentTarget.style.borderColor = '#F3F4F6';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    {/* 카테고리 배지 */}
                    <span style={{
                      fontSize: 11, padding: '3px 10px', borderRadius: 20, fontWeight: 700,
                      backgroundColor: '#EDE9FE', color: '#6C63FF', marginBottom: 8, display: 'inline-block'
                    }}>
                      {categoryEmoji[post.category]} {post.category}
                    </span>

                    {/* 제목 */}
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1A1A2E', margin: '6px 0 8px', lineHeight: 1.4 }}>
                      {post.title}
                    </h3>

                    {/* 작성자 + 시간 */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 13, color: '#9CA3AF' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <span style={{ width: 20, height: 20, borderRadius: '50%', background: 'linear-gradient(135deg, #6C63FF, #00D2A0)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 10, fontWeight: 700 }}>
                          {post.author_name[0]}
                        </span>
                        {post.author_name}
                      </span>
                      <span>·</span>
                      <span>{timeAgo(post.created_at)}</span>
                    </div>
                  </div>

                  {/* 우측 통계 */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, fontSize: 12, color: '#9CA3AF', whiteSpace: 'nowrap' }}>
                    <span>💬 댓글</span>
                    <span>❤️ 좋아요</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}