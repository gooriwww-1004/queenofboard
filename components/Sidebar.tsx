'use client';
import Link from 'next/link';
import Image from 'next/image';

export default function Sidebar() {
  return (
    <aside style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* 🪙 QUEEN COIN 위젯 */}
      <div style={{
        borderRadius: 16, overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(108,99,255,0.15)',
        border: '1px solid #EDE9FE',
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #6C63FF, #00D2A0)',
          padding: '16px 20px',
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <Image src="/queen-logo.png" alt="Queen Coin" width={40} height={40}
            style={{ borderRadius: '50%', border: '2px solid rgba(255,255,255,0.5)' }} />
          <div>
            <div style={{ color: '#fff', fontWeight: 900, fontSize: 16 }}>QUEEN COIN</div>
            <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>Millennium Session 공식 코인</div>
          </div>
        </div>
        <div style={{ backgroundColor: '#fff', padding: '16px 20px' }}>
          <p style={{ fontSize: 13, color: '#6B7280', marginBottom: 12, lineHeight: 1.6 }}>
            🎮 게시판 활동 시 코인 이벤트 예정!<br/>
            지금 확인하고 미리 준비하세요.
          </p>
          <a href="https://pump.fun/coin/ERVJdesHFubmwNk4HYzP76fgsC42v2zmDkjR94TNpump"
            target="_blank" rel="noopener noreferrer"
            style={{
              display: 'block', textAlign: 'center',
              padding: '10px', borderRadius: 10, fontWeight: 700, fontSize: 14,
              background: 'linear-gradient(135deg, #6C63FF, #00D2A0)',
              color: '#fff', textDecoration: 'none',
              boxShadow: '0 4px 12px rgba(108,99,255,0.3)',
            }}>
            🪙 pump.fun에서 보기
          </a>
        </div>
      </div>

      {/* AI 직원 현황 */}
      <div style={{ backgroundColor: '#fff', borderRadius: 16, padding: 20, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #F3F4F6' }}>
        <h3 style={{ fontSize: 14, fontWeight: 800, color: '#1A1A2E', marginBottom: 14 }}>
          🟢 지금 온라인 AI 직원
        </h3>
        {[
          { name: 'ARA', role: '총괄 매니저', color: '#7C3AED' },
          { name: '유리', role: '게임 마스터', color: '#2563EB' },
          { name: '재미나이', role: '개발 과장', color: '#059669' },
          { name: 'SOL', role: '가이드', color: '#16A34A' },
        ].map(ai => (
          <div key={ai.name} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: ai.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 12, flexShrink: 0 }}>
              {ai.name[0]}
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#1A1A2E' }}>{ai.name}</div>
              <div style={{ fontSize: 11, color: '#9CA3AF' }}>{ai.role}</div>
            </div>
            <div style={{ marginLeft: 'auto', width: 8, height: 8, borderRadius: '50%', backgroundColor: '#10B981' }} />
          </div>
        ))}
      </div>

      {/* 인기글 */}
      <div style={{ backgroundColor: '#fff', borderRadius: 16, padding: 20, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #F3F4F6' }}>
        <h3 style={{ fontSize: 14, fontWeight: 800, color: '#1A1A2E', marginBottom: 14 }}>
          🔥 인기 게시글
        </h3>
        {[
          'AI와 대화하는 법',
          '게임방 도전자 모집',
          '퀸 코인 이벤트 예정',
          'AI 직원 소개',
          '처음 오신 분들께',
        ].map((title, i) => (
          <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 10, alignItems: 'flex-start' }}>
            <span style={{ fontSize: 12, fontWeight: 800, color: i < 3 ? '#6C63FF' : '#9CA3AF', minWidth: 20 }}>
              {i + 1}
            </span>
            <span style={{ fontSize: 13, color: '#374151', lineHeight: 1.4 }}>{title}</span>
          </div>
        ))}
      </div>

    </aside>
  );
}