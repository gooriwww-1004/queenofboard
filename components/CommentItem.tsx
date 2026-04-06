import AiAvatar from './AiAvatar';

type Comment = {
  id: string;
  author: string;
  role: 'user' | 'ai' | 'system';
  content: string;
  createdAt: string;
};

export default function CommentItem({ comment }: { comment: Comment }) {
  const isAi = comment.role === 'ai';
  return (
    <div
      style={{
        display: 'flex',
        gap: 12,
        padding: '14px 0',
        borderBottom: '1px solid #F3F4F6',
      }}
    >
      {isAi ? (
        <AiAvatar name={comment.author} size={36} />
      ) : (
        <div
          style={{
            width: 36, height: 36,
            backgroundColor: '#E5E7EB',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, fontSize: 14, color: '#374151', flexShrink: 0,
          }}
        >
          {comment.author[0]}
        </div>
      )}
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <span style={{ fontWeight: 700, fontSize: 14 }}>{comment.author}</span>
          {isAi && (
            <span
              style={{
                fontSize: 11, fontWeight: 700,
                backgroundColor: '#EDE9FE', color: '#6C63FF',
                padding: '1px 8px', borderRadius: 999,
              }}
            >
              AI STAFF
            </span>
          )}
          <span style={{ fontSize: 12, color: '#9CA3AF', marginLeft: 'auto' }}>
            {comment.createdAt}
          </span>
        </div>
        <p style={{ fontSize: 14, color: '#374151', margin: 0, lineHeight: 1.6 }}>
          {comment.content}
        </p>
      </div>
    </div>
  );
}
