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
  const { id } = useParams();
  const router = useRouter();

  useEffect(() => {
    fetchAll();
  }, []);

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

    if (!error) {
      setNewComment('');
      fetchAll();
    }
  };

  const handleLike = async () => {
    if (!user) { alert('로그인이 필요해요!'); return; }
    if (liked) {
      await supabase.from('likes').delete()
        .eq('post_id', id).eq('user_id', user.id);
      setLiked(false);
      setLikeCount(prev => prev - 1);
    } else {
      await supabase.from('likes').insert({ post_id: id, user_id: user.id });
      setLiked(true);
      setLikeCount(prev => prev + 1);
    }
  };

  if (loading) return <p style={{ textAlign: 'center', padding: 40 }}>불러오는 중...</p>;
  if (!post) return <p style={{ textAlign: 'center', padding: 40 }}>게시글을 찾을 수 없어요.</p>;

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: '24px 16px' }}>
      <button onClick={() => router.back()}
        style={{ marginBottom: 20, padding: '6px 16px', backgroundColor: '#F3F4F6', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>
        ← 목록으로
      </button>

      {/* 게시글 본문 */}
      <div style={{ backgroundColor: '#fff', borderRadius: 16, padding: 28, boxShadow: '0 2px 12px rgba(0,0,0,0.08)', marginBottom: 16 }}>
        <span style={{ fontSize: 11, backgroundColor: '#EDE9FE', color: '#6C63FF', padding: '2px 8px', borderRadius: 10, fontWeight: 600 }}>
          {post.category}
        </span>
        <h1 style={{ fontSize: 22, fontWeight: 900, color: '#1A1A2E', marginTop: 12, marginBottom: 8 }}>{post.title}</h1>
        <div style={{ display: 'flex', gap: 12, fontSize: 13, color: '#6B7280', marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid #F3F4F6' }}>
          <span>✍️ {post.author_name}</span>
          <span>📅 {new Date(post.created_at).toLocaleDateString('ko-KR')}</span>
        </div>
        <p style={{ fontSize: 15, lineHeight: 1.8, color: '#374151', whiteSpace: 'pre-wrap' }}>{post.content}</p>

        {/* 좋아요 버튼 */}
        <div style={{ marginTop: 24, display: 'flex', justifyContent: 'center' }}>
          <button onClick={handleLike}
            style={{ padding: '10px 32px', borderRadius: 20, border: `2px solid ${liked ? '#6C63FF' : '#E5E7EB'}`,
              backgroundColor: liked ? '#EDE9FE' : '#fff', color: liked ? '#6C63FF' : '#6B7280',
              fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>
            {liked ? '❤️' : '🤍'} 좋아요 {likeCount}
          </button>
        </div>
      </div>

      {/* 댓글 목록 */}
      <div style={{ backgroundColor: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.08)', marginBottom: 16 }}>
        <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 16, color: '#1A1A2E' }}>
          💬 댓글 {comments.length}개
        </h3>

        {comments.length === 0 ? (
          <p style={{ color: '#9CA3AF', fontSize: 14, textAlign: 'center', padding: '16px 0' }}>첫 댓글을 남겨보세요!</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {comments.map(comment => (
              <div key={comment.id} style={{
                padding: '12px 16px', borderRadius: 12,
                backgroundColor: comment.role === 'ai' ? '#EDE9FE' : '#F9FAFB',
                border: comment.role === 'ai' ? '1px solid #C4B5FD' : '1px solid #F3F4F6'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: comment.role === 'ai' ? '#6C63FF' : '#1A1A2E' }}>
                    {comment.role === 'ai' ? '🤖 ' : '👤 '}{comment.author_name}
                  </span>
                  {comment.role === 'ai' && (
                    <span style={{ fontSize: 10, backgroundColor: '#6C63FF', color: '#fff', padding: '1px 6px', borderRadius: 6, fontWeight: 700 }}>AI</span>
                  )}
                  <span style={{ fontSize: 11, color: '#9CA3AF', marginLeft: 'auto' }}>
                    {new Date(comment.created_at).toLocaleDateString('ko-KR')}
                  </span>
                </div>
                <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.6 }}>{comment.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 댓글 작성 */}
      <div style={{ backgroundColor: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
        <h3 style={{ fontSize: 15, fontWeight: 800, marginBottom: 12, color: '#1A1A2E' }}>✏️ 댓글 작성</h3>
        {user ? (
          <form onSubmit={handleComment} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <textarea
              value={newComment} onChange={e => setNewComment(e.target.value)}
              placeholder="댓글을 입력하세요..." rows={3} required
              style={{ padding: '10px 14px', borderRadius: 10, border: '1.5px solid #E5E7EB', fontSize: 14, outline: 'none', resize: 'none', fontFamily: 'inherit' }}
            />
            <button type="submit"
              style={{ alignSelf: 'flex-end', padding: '8px 24px', backgroundColor: '#6C63FF', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
              등록
            </button>
          </form>
        ) : (
          <p style={{ textAlign: 'center', color: '#6B7280', fontSize: 14 }}>
            댓글을 작성하려면 <a href="/login" style={{ color: '#6C63FF', fontWeight: 700 }}>로그인</a>이 필요해요.
          </p>
        )}
      </div>
    </div>
  );
}