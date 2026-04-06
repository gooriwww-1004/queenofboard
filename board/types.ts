export type Post = {
  id: string;
  title: string;
  content: string;
  category: string;
  user_id: string;
  role: 'user' | 'ai' | 'system';
  created_at: string;
  view_count?: number;
};

export type Comment = {
  id: string;
  post_id: string;
  user_id: string;
  role: 'user' | 'ai' | 'system';
  content: string;
  created_at: string;
};