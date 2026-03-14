'use client';
import { useState } from 'react';
import { generateNickname } from '@/utils/nicknameGenerator';

export default function OnboardingModal({ isOpen, onComplete }: { isOpen: boolean, onComplete: (data: any) => void }) {
    const [nickname, setNickname] = useState(generateNickname());
    const [gender, setGender] = useState('');
    const [age, setAge] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleStart = async () => {
        if (!gender || !age) {
            alert("성별과 연령대를 모두 선택해주세요!");
            return;
        }

        setLoading(true);
        try {
            await onComplete({ nickname, gender, age });
        } catch (error: any) {
            // 에러 객체를 상세히 로그에 남기고, 사용자에게는 구체적인 메시지를 띄웁니다.
            console.error("저장 에러 상세:", error);

            // Supabase 등에서 보내주는 에러 메시지(error.message)를 확인하는 것이 핵심입니다.
            const errorMessage = error?.message || "알 수 없는 오류가 발생했습니다.";
            alert(`저장 중 오류가 발생했습니다: ${errorMessage}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-900 p-8 rounded-[2rem] w-full max-w-sm shadow-2xl border border-gray-100 dark:border-gray-800 space-y-6">

                <div className="text-center space-y-2">
                    <div className="text-5xl">🐧</div>
                    <h2 className="text-2xl font-black dark:text-white">세일쉽에 오신 걸 환영해요!</h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">정보를 입력하고 핫딜 여행을 시작하세요</p>
                </div>

                <div className="space-y-4">
                    <div className="flex gap-2">
                        <input
                            value={nickname}
                            readOnly
                            className="flex-1 border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl dark:text-white font-bold outline-none focus:border-blue-600 transition"
                        />
                        <button
                            onClick={() => setNickname(generateNickname())}
                            className="bg-blue-50 dark:bg-gray-800 text-blue-600 dark:text-blue-400 p-4 rounded-2xl hover:bg-blue-100 dark:hover:bg-gray-700 transition flex items-center justify-center shrink-0 w-14"
                        >
                            🔄
                        </button>
                    </div>

                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <select
                                onChange={(e) => setGender(e.target.value)}
                                value={gender}
                                className="w-full border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl font-bold dark:text-gray-300 outline-none appearance-none cursor-pointer"
                            >
                                <option value="">성별</option>
                                <option value="male">남성</option>
                                <option value="female">여성</option>
                            </select>
                            <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-[10px]">▼</div>
                        </div>

                        <div className="relative flex-1">
                            <select
                                onChange={(e) => setAge(e.target.value)}
                                value={age}
                                className="w-full border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl font-bold dark:text-gray-300 outline-none appearance-none cursor-pointer"
                            >
                                <option value="">연령대</option>
                                {['10대', '20대', '30대', '40대', '50대', '60대', '70대', '80대'].map((a) => (
                                    <option key={a} value={a}>{a}</option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-[10px]">▼</div>
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleStart}
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-2xl font-black text-lg transition-all transform hover:scale-[1.02] shadow-lg shadow-blue-500/30 disabled:opacity-50"
                >
                    {loading ? "저장 중..." : "시작하기"}
                </button>
            </div>
        </div>
    );
}