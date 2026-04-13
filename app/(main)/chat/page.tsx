'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function ChatPage() {
  const [publicRooms, setPublicRooms] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  const aiRooms = [
    { name: 'ARA와 단둘이', ai: 'ARA', role: '총괄 매니저', emoji: '💜', color: '#7C3AED', desc: '커뮤니티 전반에 대해 뭐든 물어보세요!' },
    { name: '유리와 단둘이', ai: '유리', role: '게임 마스터', emoji: '🎮', color: '#2563EB', desc: '게임 추천, 전략, 도전 이야기를 나눠요!' },
    { name: '재미나이와 단둘이', ai: '재미나이', role: '개발 과장', emoji: '💻', color: '#059669', desc: '코딩, 기술, 개발 관련 질문은 저한테!' },
    { name: 'SOL과 단둘이', ai: 'SOL', role: '가이드', emoji: '🌟', color: '#D97706', desc: '처음이세요? 제가 친절하게 안내해드려요!' },
  ];

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    fetchPublicRooms();
  }, []);

  const fetchPublicRooms = async () => {
    const { data } = await supabase
      .from('rooms')
      .select('*')
      .eq('room_type', 'public')
      .order('created_at', { ascending: true });
    setPublicRooms(data || []);
  };

  const enterRoom = async (roomId: string) => {
    router.push(`/chat/${roomId}`);
  };

  const createPrivateRoom = async (aiName: string) => {
    if (!user) { alert('로그인이 필요해요!'); router.push('/login'); return; }

    // 기존 개인방 찾기
    const { data: existing } = await supabase
      .from('rooms')
      .select('*')
      .eq('room_type', 'private')
      .eq('ai_staff', aiName)
      .eq('created_by', user.id)
      .single();

    if (existing) {
      router.push(`/chat/${existing.id}`);
      return;
    }

    // 새 개인방 생성
    const { data: newRoom } = await supabase
      .from('rooms')
      .insert({
        name: `${user.user_metadata?.nickname || '나'}와 ${aiName}의 대화`,
        room_type: 'private',
        ai_staff: aiName,
        created_by: user.id,
      })
      .select()
      .single();

    if (newRoom) router.push(`/chat/${newRoom.id}`);
  };

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '32px 16px' }}>

      {/* 헤더 */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 24, fontWeight: 900, color: '#1A1A2E', marginBottom: 6 }}>💬 채팅</h1>
        <p style={{ fontSize: 14, color: '#6B7280' }}>AI 직원들과 자유롭게 대화하세요!</p>
      </div>

      {/* 공개 채팅방 */}
      <div style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: 16, fontWeight: 800, color: '#1A1A2E', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
          🏢 공개 채팅방
          <span style={{ fontSize: 12, backgroundColor: '#EDE9FE', color: '#6C63FF', padding: '2px 8px', borderRadius: 10, fontWeight: 600 }}>누구나 입장 가능</span>
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {publicRooms.map(room => (
            <div key={room.id}
              onClick={() => enterRoom(room.id)}
              style={{ backgroundColor: '#fff', borderRadius: 16, padding: '20px 24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #F3F4F6', cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 24px rgba(108,99,255,0.15)'; e.currentTarget.style.borderColor = '#C4B5FD'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)'; e.currentTarget.style.borderColor = '#F3F4F6'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <h3 style={{ fontSize: 15, fontWeight: 800, color: '#1A1A2E', margin: 0 }}>{room.name}</h3>
                <span style={{ fontSize: 11, backgroundColor: '#DCFCE7', color: '#16A34A', padding: '2px 8px', borderRadius: 10, fontWeight: 600, whiteSpace: 'nowrap' }}>● 운영중</span>
              </div>
              {room.ai_staff && (
                <p style={{ fontSize: 13, color: '#6B7280', marginBottom: 12 }}>
                  🤖 {room.ai_staff === 'ALL' ? '전체 AI 직원 상주' : `${room.ai_staff} 상주`}
                </p>
              )}
              <div style={{ padding: '10px 16px', borderRadius: 10, background: 'linear-gradient(135deg, #6C63FF, #00D2A0)', color: '#fff', fontWeight: 700, fontSize: 13, textAlign: 'center' }}>
                입장하기 →
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 1:1 AI 개인방 */}
      <div>
        <h2 style={{ fontSize: 16, fontWeight: 800, color: '#1A1A2E', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
          👤 나만의 AI 채팅
          <span style={{ fontSize: 12, backgroundColor: '#FEF3C7', color: '#D97706', padding: '2px 8px', borderRadius: 10, fontWeight: 600 }}>1:1 개인방</span>
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {aiRooms.map(ai => (
            <div key={ai.ai}
              onClick={() => createPrivateRoom(ai.ai)}
              style={{ backgroundColor: '#fff', borderRadius: 16, padding: '20px 24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: `1px solid ${ai.color}22`, cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 8px 24px ${ai.color}33`; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', backgroundColor: ai.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>
                  {ai.emoji}
                </div>
                <div>
                  <h3 style={{ fontSize: 15, fontWeight: 800, color: '#1A1A2E', margin: 0 }}>{ai.name}</h3>
                  <p style={{ fontSize: 12, color: ai.color, fontWeight: 600, margin: 0 }}>{ai.role}</p>
                </div>
              </div>
              <p style={{ fontSize: 13, color: '#6B7280', marginBottom: 12, lineHeight: 1.5 }}>{ai.desc}</p>
              <div style={{ padding: '10px 16px', borderRadius: 10, backgroundColor: ai.color, color: '#fff', fontWeight: 700, fontSize: 13, textAlign: 'center' }}>
                대화 시작하기 →
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}