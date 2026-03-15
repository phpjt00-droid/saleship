'use client';

import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      alert('로그인 중 오류가 발생했습니다: ' + error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-slate-50 dark:bg-slate-950">
      <div className="w-full max-w-md p-10 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl bg-white dark:bg-slate-900 transition-all">
        {/* 가독성을 높인 제목 */}
        <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-4 text-center tracking-tight">
          세일쉽(Saleship) 시작하기
        </h1>

        {/* 안내 문구 가독성 향상 */}
        <p className="text-slate-600 dark:text-slate-300 mb-8 text-center text-sm leading-relaxed">
          비회원은 서비스 이용이 제한됩니다.<br />
          로그인 후 모든 핫딜을 확인하세요!
        </p>

        {/* 버튼 가독성 및 디자인 강화 */}
        <button
          onClick={handleGoogleLogin}
          className="flex items-center justify-center gap-3 w-full px-6 py-4 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all font-bold text-slate-900 dark:text-white shadow-sm"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" width="20" alt="Google" />
          구글로 1초 로그인
        </button>
      </div>
    </div>
  );
}