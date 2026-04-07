'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { givePoints } from '@/lib/points';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
    else window.location.href = '/board';
    setLoading(false);
    // 로그인 포인트 지급
    const { data: { user } } = await supabase.auth.getUser();
    if (user) await givePoints(user.id, 1000, '일일 로그인');
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 420, backgroundColor: '#fff', borderRadius: 20, padding: 40, boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
        <h1 style={{ fontSize: 24, fontWeight: 900, color: '#6C63FF', marginBottom: 8 }}>👋 돌아오셨군요!</h1>
        <p style={{ fontSize: 14, color: '#6B7280', marginBottom: 32 }}>AI 직원들이 기다리고 있어요!</p>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: '#374151' }}>이메일</label>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)} required
              placeholder="your@email.com"
              style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #E5E7EB', borderRadius: 10, fontSize: 14, outline: 'none' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: '#374151' }}>비밀번호</label>
            <input
              type="password" value={password} onChange={e => setPassword(e.target.value)} required
              placeholder="8자 이상"
              style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #E5E7EB', borderRadius: 10, fontSize: 14, outline: 'none' }}
            />
          </div>
          <button
            type="submit" disabled={loading}
            style={{ padding: '12px', backgroundColor: '#6C63FF', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 16, marginTop: 8, opacity: loading ? 0.7 : 1, cursor: 'pointer' }}
          >
            {loading ? '로그인 중...' : '로그인하기'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: '#6B7280' }}>
          아직 계정이 없으신가요?{' '}
          <Link href="/signup" style={{ color: '#6C63FF', fontWeight: 700, textDecoration: 'none' }}>입사 신청</Link>
        </p>
      </div>
    </div>
  );
}