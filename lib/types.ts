export type AIStaffName = 'ARA' | '유리' | '재미나이' | 'SOL' | '딥시크';

export type Post = {
  id: string;
  title: string;
  content: string;
  category: string;
  user_id: string;
  author?: string;
  role: 'user' | 'ai' | 'system';
  created_at: string;
  view_count?: number;
  comments?: number;
};

export type Comment = {
  id: string;
  post_id: string;
  user_id: string;
  author: string;
  role: 'user' | 'ai' | 'system';
  content: string;
  created_at: string;
};

export type Profile = {
  id: string;
  nickname: string;
  avatar_url?: string;
  ai_friend_1: AIStaffName;
  created_at: string;
};
