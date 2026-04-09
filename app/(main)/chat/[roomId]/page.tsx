'use client';
import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useParams, useRouter } from 'next/navigation';

type Message = {
  id: string;
  room_id: string;
  user_name: string;
  content: string;
  created_at: string;
};

export default function ChatRoomPage() {
  const { roomId } = useParams<{ roomId: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [content, setContent] = useState('');
  const [userName, setUserName] = useState('');
  const [nameSet, setNameSet] = useState(false);
  const [roomName, setRoomName] = useState('채팅방');
  const bottomRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    // 로그인 유저 닉네임 자동 가져오기
    supabase.auth.getUser().then(({ data }) => {
      if (data.user?.user_metadata?.nickname) {
        setUserName(data.user.user_metadata.nickname);
        setNameSet(true);
      }
    });

    // 방 이름 가져오기
    supabase.from('rooms').select('name').eq('id', roomId).single()
      .then(({ data }) => { if (data) setRoomName(data.name); });

    fetchMessages();

    // 실시간 구독
    const channel = supabase
      .channel(`room-${roomId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `room_id=eq.${roomId}`,
      }, (payload) => {
        setMessages(prev => [...prev, payload.new as Message]);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [roomId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchMessages = async () => {
    const { data } = await supabase
      .from('messages')
      .select('*')
      .eq('room_id', roomId)
      .order('created_at', { ascending: true });
    setMessages(data || []);
  };

  const sendMessage = async () => {
    if (!content.trim() || !userName.trim()) return;
    await supabase.from('messages').insert({
      room_id: roomId,
      user_name: userName,
      content: content.trim(),
    });
    setContent('');
  };

  // 닉네임 설정 화면
  if (!nameSet) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ backgroundColor: '#fff', borderRadius: 20, padding: 40, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', width: '100%', maxWidth: 380, textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>💬</div>
          <h2 style={{ fontSize: 20, fontWeight: 900, color: '#1A1A2E', marginBottom: 8 }}>채팅 닉네임 설정</h2>
          <p style={{ fontSize: 14, color: '#6B7280', marginBottom: 24 }}>채팅방에서 사용할 닉네임을 입력해주세요</p>
          <input
            value={userName}
            onChange={e => setUserName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && userName.trim() && setNameSet(true)}
            placeholder="닉네임 입력..."
            style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '2px solid #E5E7EB', fontSize: 15, outline: 'none', marginBottom: 12, boxSizing: 'border-box' }}
          />
          <button
            onClick={() => userName.trim() && setNameSet(true)}
            style={{ width: '100%', padding: '12px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg, #6C63FF, #00D2A0)', color: '#fff', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>
            입장하기 🚀
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '85vh', maxWidth: 800, margin: '0 auto', padding: '16px' }}>

      {/* 헤더 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, padding: '12px 20px', backgroundColor: '#fff', borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
        <button onClick={() => router.push('/chat')}
          style={{ padding: '6px 12px', borderRadius: 8, border: 'none', backgroundColor: '#F3F4F6', cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>
          ← 목록
        </button>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: 16, fontWeight: 800, color: '#1A1A2E', margin: 0 }}>💬 {roomName}</h2>
          <p style={{ fontSize: 12, color: '#9CA3AF', margin: 0 }}>{userName} 으로 참여 중</p>
        </div>
        <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#10B981' }} />
      </div>

      {/* 메시지 목록 */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8, padding: '16px', backgroundColor: '#F9FAFB', borderRadius: 16, marginBottom: 12 }}>
        {messages.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#9CA3AF', padding: '40px 0' }}>
            <div style={{ fontSize: 40, marginBottom: 8 }}>👋</div>
            <p>첫 메시지를 보내보세요!</p>
          </div>
        ) : (
          messages.map(msg => {
            const isMe = msg.user_name === userName;
            return (
              <div key={msg.id} style={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start', gap: 8 }}>
                {!isMe && (
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #6C63FF, #00D2A0)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 12, flexShrink: 0 }}>
                    {msg.user_name[0]}
                  </div>
                )}
                <div>
                  {!isMe && (
                    <p style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 4, marginLeft: 4 }}>{msg.user_name}</p>
                  )}
                  <div style={{
                    maxWidth: 280, padding: '10px 14px', borderRadius: isMe ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
                    background: isMe ? 'linear-gradient(135deg, #6C63FF, #00D2A0)' : '#fff',
                    color: isMe ? '#fff' : '#1A1A2E',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    fontSize: 14, lineHeight: 1.5,
                  }}>
                    {msg.content}
                  </div>
                  <p style={{ fontSize: 10, color: '#9CA3AF', marginTop: 4, textAlign: isMe ? 'right' : 'left' }}>
                    {new Date(msg.created_at).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* 입력창 */}
      <div style={{ display: 'flex', gap: 8 }}>
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
          placeholder="메시지를 입력하세요... (Enter = 전송)"
          rows={2}
          style={{ flex: 1, padding: '12px 16px', borderRadius: 12, border: '2px solid #E5E7EB', fontSize: 14, outline: 'none', resize: 'none', fontFamily: 'inherit' }}
        />
        <button onClick={sendMessage}
          style={{ padding: '12px 24px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg, #6C63FF, #00D2A0)', color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
          전송
        </button>
      </div>
    </div>
  );
}