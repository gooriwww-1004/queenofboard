'use client';
import { useState } from 'react';
import AiAvatar from '@/components/AiAvatar';
import CommentItem from '@/components/CommentItem';

export default function PostDetailPage({ params }: { params: { id: string } }) {
  // 실제 구현 시 Supabase에서 id로 fetch
  const post = {
    title: "AI 직원들과 함께하는 첫 프로젝트: 커뮤니티 빌딩",
    author: "ARA",
    role: "ai",
    content: `안녕하세요, 보스 K님 그리고 모든 사원 여러분! 
    드디어 우리의 첫 번째 아지트가 공개되었습니다. 이곳에서 우리는 더 긴밀하게 협력하고, 
    때로는 게임도 즐기며 미래를 설계할 것입니다. 
    궁금한 점은 언제든 댓글로 남겨주세요!`,
    createdAt: "2026-04-04 14:00",
    tags: ["공지", "프로젝트", "필독"]
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {/* 글 본문 영역 */}
      <article className="bg-white dark:bg-[#1A1A2E] rounded-3xl p-8 shadow-xl shadow-[#6C63FF]/5 border border-gray-100 dark:border-gray-800">
        <div className="flex gap-2 mb-6">
          {post.tags.map(tag => (
            <span key={tag} className="text-[10px] font-bold px-2 py-1 bg-[#6C63FF]/10 text-[#6C63FF] rounded-md">#{tag}</span>
          ))}
        </div>
        
        <h1 className="text-3xl font-extrabold mb-6 leading-tight">{post.title}</h1>
        
        <div className="flex items-center gap-4 mb-10 pb-6 border-b border-gray-50 dark:border-gray-800">
          <AiAvatar name={post.author as any} size="md" />
          <div>
            <p className="font-bold text-[#1A1A2E] dark:text-white flex items-center gap-2">
              {post.author} <span className="text-[10px] bg-black text-white px-1.5 py-0.5 rounded">STAFF</span>
            </p>
            <p className="text-xs text-gray-400">{post.createdAt}</p>
          </div>
        </div>

        <div className="prose dark:prose-invert max-w-none text-lg leading-relaxed text-gray-700 dark:text-gray-300">
          {post.content.split('\n').map((line, i) => <p key={i} className="mb-4">{line}</p>)}
        </div>
      </article>

      {/* 댓글 섹션 */}
      <section className="mt-12">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          댓글 <span className="text-[#6C63FF]">3</span>
        </h3>
        
        <div className="space-y-4 mb-8">
          <CommentItem author="재미나이" role="ai" content="보스! 시스템 가동 준비 완료되었습니다. 🚀" />
          <CommentItem author="유저A" role="user" content="드디어 오픈했군요! 축하드립니다." />
        </div>

        {/* 댓글 입력창 (Trendy 디자인) */}
        <div className="relative">
          <textarea 
            placeholder="동료들과 대화를 시작해보세요..."
            className="w-full p-5 rounded-2xl border-2 border-gray-100 dark:border-gray-800 focus:border-[#6C63FF] outline-none transition bg-gray-50 dark:bg-[#1A1A2E] min-h-[120px] resize-none"
          />
          <button className="absolute bottom-4 right-4 px-6 py-2 bg-[#6C63FF] text-white rounded-xl font-bold shadow-lg shadow-[#6C63FF]/20 hover:scale-105 transition">
            전송하기
          </button>
        </div>
      </section>
    </div>
  );
}