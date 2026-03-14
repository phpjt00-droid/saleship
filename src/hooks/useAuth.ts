import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

export const useAuth = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. 현재 세션 확인
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // 유저 메타데이터에서 닉네임 등을 가져옴
        setUser({
          id: session.user.id,
          email: session.user.email,
          nickname: session.user.user_metadata?.nickname || session.user.email?.split('@')[0],
        });
      }
      setLoading(false);
    };

    getSession();

    // 2. 로그인 상태 변화 감지 (로그인/로그아웃 시 즉시 반영)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUser({
          id: session.user.id,
          email: session.user.email,
          nickname: session.user.user_metadata?.nickname || session.user.email?.split('@')[0],
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return { user, loading, isAuthenticated: !!user };
};
