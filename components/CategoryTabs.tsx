'use client';
const CATEGORIES = ['전체', '공지사항', '자유게시판', 'AI 질문방', '게임방'];

export default function CategoryTabs({
  active,
  onChange,
}: {
  active: string;
  onChange: (c: string) => void;
}) {
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          style={{
            padding: '6px 16px',
            borderRadius: 999,
            border: 'none',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: 14,
            backgroundColor: active === cat ? '#6C63FF' : '#F3F4F6',
            color: active === cat ? '#fff' : '#374151',
            transition: 'all 0.15s',
          }}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
