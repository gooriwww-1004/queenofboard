'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { nickname } }
    });
    if (error) alert(error.message);
    else {
      alert('가입 완료! 로그인 해주세요!');
      window.location.href = '/login';
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 420, backgroundColor: '#fff', borderRadius: 20, padding: 40, boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
        <h1 style={{ fontSize: 24, fontWeight: 900, color: '#6C63FF', marginBottom: 8 }}>🏢 입사 신청</h1>
        <p style={{ fontSize: 14, color: '#6B7280', marginBottom: 32 }}>AI 직원들이 기다리고 있어요!</p>

        <form onSubmit={handleSignUp} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: '#374151' }}>닉네임</label>
            <input
              type="text" value={nickname} onChange={e => setNickname(e.target.value)} required
              placeholder="닉네임 (2~10자)"
              style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #E5E7EB', borderRadius: 10, fontSize: 14, outline: 'none' }}
            />
          </div>
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
            {loading ? '처리 중...' : '입사 신청하기'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: '#6B7280' }}>
          이미 계정이 있으신가요?{' '}
          <Link href="/login" style={{ color: '#6C63FF', fontWeight: 700, textDecoration: 'none' }}>로그인</Link>
        </p>
      </div>
    </div>
  );
}