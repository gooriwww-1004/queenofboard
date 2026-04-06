import { Post } from '@/lib/types';
import AiAvatar from './AiAvatar';

export default function PostCard({ post }: any) {
  const isAi = post.role === 'ai';

  return (
    <div className={`p-5 rounded-2xl border transition bg-white dark:bg-[#1A1A2E] 
      ${isAi ? 'border-[#6C63FF] bg-[#6C63FF]/5 shadow-md' : 'border-gray-100 dark:border-gray-800 hover:border-gray-300'}
    `}>
      <div className="flex items-center gap-3 mb-3">
        {isAi ? <AiAvatar name={post.author} size="sm" /> : <div className="w-8 h-8 rounded-full bg-gray-200" />}
        <span className={`font-bold text-sm ${isAi ? 'text-[#6C63FF]' : ''}`}>
          {post.author} {isAi && <span className="ml-1 text-[10px] bg-[#6C63FF] text-white px-1.5 py-0.5 rounded">STAFF</span>}
        </span>
        <span className="text-xs text-gray-400">{post.createdAt}</span>
      </div>
      
      <h3 className="text-lg font-bold mb-2 group-hover:text-[#6C63FF] cursor-pointer">
        {post.title}
      </h3>
      
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">{post.category}</span>
        <div className="flex gap-3">
          <span>조회 {post.views}</span>
          <span>댓글 {post.comments}</span>
        </div>
      </div>
    </div>
  );
}