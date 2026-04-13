'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useParams, useRouter } from 'next/navigation';

export default function PostPage() {
  const [post, setPost] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const { id } = useParams();
  const router = useRouter();

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);

    const { data: post } = await supabase
      .from('posts').select('*').eq('id', id).single();
    setPost(post);

    const { data: comments } = await supabase
      .from('comments').select('*').eq('post_id', id)
      .order('created_at', { ascending: true });
    setComments(comments || []);

    const { count } = await supabase
      .from('likes').select('*', { count: 'exact' }).eq('post_id', id);
    setLikeCount(count || 0);

    if (user) {
      const { data: myLike } = await supabase
        .from('likes').select('id').eq('post_id', id).eq('user_id', user.id);
      setLiked(myLike ? myLike.length > 0 : false);
    }
    setLoading(false);
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { alert('로그인이 필요해요!'); return; }
    if (!newComment.trim()) return;

    const { error } = await supabase.from('comments').insert({
      post_id: id,
      user_id: user.id,
      author_name: user.user_metadata?.nickname || '익명',
      role: 'user',
      content: newComment,
    });

    if (!error) { setNewComment(''); fetchAll(); }
  };

  const handleLike = async () => {
    if (!user) { alert('로그인이 필요해요!'); return; }
    if (liked) {
      await supabase.from('likes').delete().eq('post_id', id).eq('user_id', user.id);
      setLiked(false); setLikeCount(prev => prev - 1);
    } else {
      await supabase.from('likes').insert({ post_id: id, user_id: user.id });
      setLiked(true); setLikeCount(prev => prev + 1);
    }
  };

  // AI 댓글 생성
  const handleAiComment = async () => {
    if (!post) return;
    setAiLoading(true);
    try {
      const res = await fetch('/api/ai-comment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          post_id: id,
          post_title: post.title,      // ← title → post_title
          post_content: post.content,  // ← content → post_content
          post_category: post.category, // ← category → post_category
        }),
      });
      if (!res.ok) throw new Error('AI 댓글 실패');
      fetchAll();
    } catch (err) {
      alert('AI 댓글 실패했어요.');
    } finally {
      setAiLoading(false);
    }
  };

  if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>⏳ 불러오는 중...</div>;
  if (!post) return <div style={{ padding: 40, textAlign: 'center' }}>게시글을 찾을 수 없어요.</div>;

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '32px 16px', fontFamily: 'inherit' }}>
      <button onClick={() => router.back()}
        style={{ marginBottom: 20, padding: '6px 16px', backgroundColor: '#F3F4F6',
          border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>
        ← 목록으로
      </button>

      {/* 게시글 본문 */}
      <div style={{ background: '#fff', borderRadius: 16, padding: 28,
        boxShadow: '0 2px 12px rgba(0,0,0,0.06)', marginBottom: 20 }}>
        <span style={{ background: 'linear-gradient(135deg,#6C63FF,#00D2A0)',
          color: '#fff', padding: '3px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700 }}>
          {post.category}
        </span>
        <h1 style={{ fontSize: 22, fontWeight: 800, marginTop: 12, marginBottom: 8 }}>{post.title}</h1>
        <div style={{ display: 'flex', gap: 12, color: '#9CA3AF', fontSize: 13, marginBottom: 20 }}>
          <span>✍️ {post.author_name}</span>
          <span>📅 {new Date(post.created_at).toLocaleDateString('ko-KR')}</span>
        </div>
        <p style={{ lineHeight: 1.8, color: '#374151', whiteSpace: 'pre-wrap' }}>{post.content}</p>
      </div>

      {/* 좋아요 버튼 */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 28 }}>
        <button onClick={handleLike}
          style={{ padding: '10px 28px', borderRadius: 24, border: '2px solid #F9A8D4',
            background: liked ? '#FCE7F3' : '#fff', cursor: 'pointer', fontWeight: 700, fontSize: 15 }}>
          {liked ? '❤️' : '🤍'} 좋아요 {likeCount}
        </button>
      </div>

      {/* 댓글 섹션 */}
      <div style={{ background: '#fff', borderRadius: 16, padding: 24,
        boxShadow: '0 2px 12px rgba(0,0,0,0.06)', marginBottom: 20 }}>

        {/* 댓글 헤더 + AI 댓글 버튼 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700 }}>💬 댓글 {comments.length}개</h2>
          <button onClick={handleAiComment} disabled={aiLoading}
            style={{ padding: '8px 18px', borderRadius: 20,
              background: aiLoading ? '#E5E7EB' : 'linear-gradient(135deg,#6C63FF,#00D2A0)',
              color: aiLoading ? '#9CA3AF' : '#fff', border: 'none', cursor: aiLoading ? 'not-allowed' : 'pointer',
              fontWeight: 700, fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
            {aiLoading ? '⏳ AI 생각 중...' : '🤖 AI 댓글 받기'}
          </button>
        </div>

        {/* 댓글 목록 */}
        {comments.length === 0 ? (
          <p style={{ color: '#9CA3AF', textAlign: 'center', padding: '20px 0' }}>첫 댓글을 남겨보세요!</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {comments.map((comment: any) => (
              <div key={comment.id}
                style={{ padding: '14px 16px', borderRadius: 12,
                  background: comment.role === 'ai' ? 'linear-gradient(135deg,#EDE9FE,#D1FAE5)' : '#F9FAFB',
                  border: comment.role === 'ai' ? '1.5px solid #C4B5FD' : '1.5px solid #F3F4F6' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span style={{ fontWeight: 700, fontSize: 14 }}>
                    {comment.role === 'ai' ? '🤖 ' : '👤 '}{comment.author_name}
                  </span>
                  {comment.role === 'ai' && (
                    <span style={{ background: 'linear-gradient(135deg,#6C63FF,#00D2A0)',
                      color: '#fff', fontSize: 10, padding: '2px 8px', borderRadius: 10, fontWeight: 700 }}>
                      AI
                    </span>
                  )}
                  <span style={{ color: '#9CA3AF', fontSize: 12, marginLeft: 'auto' }}>
                    {new Date(comment.created_at).toLocaleDateString('ko-KR')}
                  </span>
                </div>
                <p style={{ color: '#374151', fontSize: 14, lineHeight: 1.7, margin: 0 }}>{comment.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 댓글 작성 */}
      <div style={{ background: '#fff', borderRadius: 16, padding: 24,
        boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14 }}>✏️ 댓글 작성</h2>
        {user ? (
          <form onSubmit={handleComment} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <textarea value={newComment} onChange={(e) => setNewComment(e.target.value)}
              placeholder="댓글을 입력하세요..." rows={3} required
              style={{ padding: '10px 14px', borderRadius: 10, border: '1.5px solid #E5E7EB',
                fontSize: 14, outline: 'none', resize: 'none', fontFamily: 'inherit' }} />
            <button type="submit"
              style={{ alignSelf: 'flex-end', padding: '8px 24px',
                background: 'linear-gradient(135deg,#6C63FF,#00D2A0)',
                color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer', fontWeight: 700 }}>
              등록
            </button>
          </form>
        ) : (
          <p style={{ color: '#9CA3AF', textAlign: 'center', padding: '16px 0' }}>
            댓글을 작성하려면 로그인이 필요해요.
          </p>
        )}
      </div>
    </div>
  );
}