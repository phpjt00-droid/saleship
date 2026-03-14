'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export const useAuth = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleSession = (session: any) => {
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
    };

    // 초기 세션 확인
    supabase.auth.getSession().then(({ data: { session } }) => {
      handleSession(session);
    });

    // 상태 변화 감지
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      handleSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return { user, loading, isAuthenticated: !!user };
};