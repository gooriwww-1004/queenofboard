'use client';
import { useState, useRef, useEffect } from 'react';

type Message = { role: 'user' | 'assistant'; content: string };

export default function AiChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: '안녕하세요! 저는 재미나이예요. 무엇이든 물어보세요! 😊' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg: Message = { role: 'user', content: input };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updated }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.content }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: '오류가 발생했어요. 다시 시도해주세요.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '80vh', maxWidth: 700, margin: '0 auto', padding: 24 }}>
      <h1 style={{ fontSize: 22, fontWeight: 900, marginBottom: 16, color: '#1A1A2E' }}>🤖 AI 채팅 — 재미나이</h1>

      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12, padding: 16, backgroundColor: '#F9FAFB', borderRadius: 16 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
            <div style={{
              maxWidth: '70%', padding: '10px 16px', borderRadius: 16,
              backgroundColor: m.role === 'user' ? '#6C63FF' : '#fff',
              color: m.role === 'user' ? '#fff' : '#1A1A2E',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              fontSize: 14, lineHeight: 1.6,
            }}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{ padding: '10px 16px', borderRadius: 16, backgroundColor: '#fff', fontSize: 14, color: '#9CA3AF' }}>
              입력 중...
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        <textarea
		  value={input}
		  onChange={e => setInput(e.target.value)}
		  onKeyDown={e => {
			if (e.key === 'Enter' && !e.shiftKey) {
			  e.preventDefault();
			  send();
			}
		  }}
		  placeholder="메시지를 입력하세요... (Shift+Enter = 줄바꿈)"
		  rows={3}
		  style={{
			flex: 1, padding: '12px 16px', borderRadius: 12,
			border: '2px solid #E5E7EB', fontSize: 14, outline: 'none',
			resize: 'none', lineHeight: 1.6, fontFamily: 'inherit'
		  }}
		/>
        <button onClick={send} disabled={loading} style={{
          padding: '12px 24px', backgroundColor: '#6C63FF', color: '#fff',
          border: 'none', borderRadius: 12, fontWeight: 700, fontSize: 14, cursor: 'pointer'
        }}>
          전송
        </button>
      </div>
    </div>
  );
}