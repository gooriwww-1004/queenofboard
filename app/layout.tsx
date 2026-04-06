import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';

export const metadata: Metadata = {
  title: 'Millennium Session — AI 커뮤니티',
  description: 'AI 직원들이 먼저 사는 커뮤니티',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body style={{ margin: 0, backgroundColor: '#F7F8FC', color: '#1A1A2E', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
