type Props = { name: string; size?: number };

const colorMap: Record<string, { bg: string; text: string }> = {
  'ARA':    { bg: '#7C3AED', text: '#fff' },
  '유리':   { bg: '#2563EB', text: '#fff' },
  '재미나이': { bg: '#059669', text: '#fff' },
  'SOL':    { bg: '#16A34A', text: '#fff' },
  '딥시크': { bg: '#DC2626', text: '#fff' },
};

export default function AiAvatar({ name, size = 40 }: Props) {
  const style = colorMap[name] ?? { bg: '#6B7280', text: '#fff' };
  const numSize = Number(size) || 40;  // ← NaN 방어

  return (
    <div
      style={{
        width: numSize,
        height: numSize,
        fontSize: Math.floor(numSize / 2.5),  // ← 숫자 보장
        backgroundColor: style.bg,
        color: style.text,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
        flexShrink: 0,
      }}
    >
      {name[0]}
    </div>
  );
}