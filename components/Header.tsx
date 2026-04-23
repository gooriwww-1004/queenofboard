'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function Header() {
  const [dark, setDark] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [points, setPoints] = useState<number>(0);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      setUser(data.user);
      if (data.user) {
        const { data: pt } = await supabase
          .from('queen_points')
          .select('points')
          .eq('user_id', data.user.id);
        setPoints(pt && pt.length > 0 ? pt[0].points : 0);
      }
    });
  }, [dark]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    if (dark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [dark]);

  return (
    <header className={`sticky top-0 z-50 border-b backdrop-blur-md ${dark ? 'bg-[#12111A]/90 border-[#2D2B3D]' : 'bg-white/90 border-gray-100'}`}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

        {/* 로고 → 게시판으로 연결 */}
        <Link href="https://queenofboard.vercel.app/board" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 32, height: 32, borderRadius: 10, background: 'linear-gradient(135deg, #6C63FF, #00D2A0)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>
            🏢
          </div>
          <span style={{ fontWeight: 900, fontSize: 18, background: 'linear-gradient(135deg, #6C63FF, #00D2A0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Millennium Session
          </span>
        </Link>

        {/* 네비 */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {[
            { label: '📋 게시판',    href: '/board' },
            { label: '💬 채팅',      href: '/chat' },
            { label: '🤖 AI 채팅',   href: '/ai-chat' },
            { label: '🖼️ NFT',      href: '/gallery' },
          ].map(item => (
            <Link key={item.href} href={item.href} style={{
              padding: '6px 14px', borderRadius: 8, textDecoration: 'none',
              fontWeight: 600, fontSize: 14,
              color: dark ? '#D1D5DB' : '#374151',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = dark ? '#2D2B3D' : '#F3F4F6')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              {item.label}
            </Link>
          ))}

          {/* 구분선 */}
          <div style={{ width: 1, height: 20, backgroundColor: dark ? '#2D2B3D' : '#E5E7EB', margin: '0 4px' }} />

          {/* 에테르 저널 */}
          <a
            href="https://aether-press.vercel.app/#news"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '6px 14px', borderRadius: 8, textDecoration: 'none',
              fontWeight: 700, fontSize: 13,
              background: dark ? '#1e1c2e' : '#F8F7FF',
              color: '#6C63FF',
              border: '1px solid #6C63FF33',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = '#6C63FF';
              e.currentTarget.style.color = '#fff';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = dark ? '#1e1c2e' : '#F8F7FF';
              e.currentTarget.style.color = '#6C63FF';
            }}
          >
            📰 에테르 저널
          </a>

          {/* QoMS Home */}
          <a
            href="https://queenhome.pages.dev/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '6px 14px', borderRadius: 8, textDecoration: 'none',
              fontWeight: 700, fontSize: 13,
              background: 'linear-gradient(135deg, #FFB347, #FF6B6B)',
              color: '#fff',
              boxShadow: '0 2px 8px rgba(255,107,107,0.3)',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            👑 QoMS Home
          </a>
        </nav>

        {/* 우측 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button onClick={() => setDark(!dark)} style={{
            width: 36, height: 36, borderRadius: 10, border: 'none',
            backgroundColor: dark ? '#2D2B3D' : '#F3F4F6',
            fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            {dark ? '☀️' : '🌙'}
          </button>

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                padding: '4px 12px', borderRadius: 20,
                background: 'linear-gradient(135deg, #FFB347, #FF6B6B)',
                color: '#fff', fontWeight: 700, fontSize: 12,
                display: 'flex', alignItems: 'center', gap: 4,
              }}>
                👑 {points.toLocaleString()} QP
              </div>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #6C63FF, #00D2A0)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 13 }}>
                {(user.user_metadata?.nickname || '?')[0]}
              </div>
              <button onClick={() => { supabase.auth.signOut(); window.location.href = '/'; }}
                style={{ padding: '6px 14px', borderRadius: 8, border: '1px solid #E5E7EB', backgroundColor: 'transparent', fontWeight: 600, fontSize: 13, cursor: 'pointer', color: dark ? '#D1D5DB' : '#374151' }}>
                로그아웃
              </button>
            </div>
          ) : (
            <Link href="/signup" style={{
              padding: '8px 18px', borderRadius: 10, fontWeight: 700, fontSize: 14,
              background: 'linear-gradient(135deg, #6C63FF, #00D2A0)',
              color: '#fff', textDecoration: 'none',
              boxShadow: '0 4px 12px rgba(108,99,255,0.3)',
            }}>
              입사 신청 ✨
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}