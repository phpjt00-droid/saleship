'use client';

import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        // 로그인 성공 후 돌아올 주소
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      alert('로그인 중 오류가 발생했습니다: ' + error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <div className="p-10 border rounded-xl shadow-lg bg-white">
        <h1 className="text-2xl font-bold mb-6 text-center">Saleship 시작하기</h1>
        <p className="text-gray-600 mb-8 text-center text-sm">
          비회원은 서비스 이용이 제한됩니다.<br />로그인 후 모든 핫딜을 확인하세요!
        </p>

        <button
          onClick={handleGoogleLogin}
          className="flex items-center justify-center gap-3 w-full px-6 py-3 text-black border border-gray-300 rounded-lg hover:bg-gray-50 transition-all font-medium"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" width="20" alt="Google" />
          구글로 1초 로그인
        </button>
      </div>
    </div>
  );
}