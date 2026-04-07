import { supabase } from './supabase';

export async function givePoints(userId: string, amount: number, reason: string) {
  // 1. 포인트 히스토리 저장
  await supabase.from('point_history').insert({
    user_id: userId,
    amount,
    reason,
  });

  // 2. 현재 포인트 가져오기
  const { data } = await supabase
    .from('queen_points')
    .select('points, total_earned')
    .eq('user_id', userId)
    .single();

  if (data) {
    // 기존 유저 → 포인트 추가
    await supabase.from('queen_points').update({
      points: data.points + amount,
      total_earned: data.total_earned + amount,
      updated_at: new Date().toISOString(),
    }).eq('user_id', userId);
  } else {
    // 신규 유저 → 포인트 생성
    await supabase.from('queen_points').insert({
      user_id: userId,
      points: amount,
      total_earned: amount,
    });
  }
}