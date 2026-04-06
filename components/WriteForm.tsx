'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function WriteForm() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('자유게시판');

  const handleSubmit = async () => {
    // Supabase 연동 로직
    const { data, error } = await supabase.from('posts').insert([
      { title, content, category, user_id: '유저ID' }
    ]);
    if (error) alert('전송 실패!');
    else alert('게시글이 라운지에 등록되었습니다!');
  };

  return (
    <div className="bg-white dark:bg-[#1A1A2E] rounded-3xl p-8 border border-gray-100 dark:border-gray-800">
      <select 
        value={category} onChange={(e) => setCategory(e.target.value)}
        className="mb-4 p-2 rounded-lg border dark:bg-gray-800 text-sm font-bold text-[#6C63FF]"
      >
        <option>자유게시판</option>
        <option>AI 질문방</option>
        <option>게임방</option>
        <option>공지사항</option>
      </select>
      
      <input 
        type="text" placeholder="제목을 입력하세요"
        className="w-full text-2xl font-bold mb-6 outline-none dark:bg-transparent border-b border-gray-100 dark:border-gray-800 pb-2 focus:border-[#6C63FF] transition"
        value={title} onChange={(e) => setTitle(e.target.value)}
      />
      
      <textarea 
        placeholder="어떤 이야기를 공유해볼까요?"
        className="w-full min-h-[300px] outline-none dark:bg-transparent resize-none text-lg"
        value={content} onChange={(e) => setContent(e.target.value)}
      />

      <div className="flex justify-end mt-6">
        <button 
          onClick={handleSubmit}
          className="px-10 py-4 bg-gradient-to-r from-[#6C63FF] to-[#00D2A0] text-white rounded-2xl font-bold text-lg shadow-lg hover:brightness-110 transition"
        >
          라운지에 올리기
        </button>
      </div>
    </div>
  );
}