'use client';

import { useState } from 'react';
import { generateNickname } from '@/utils/nicknameGenerator';

interface OnboardingModalProps {
    isOpen: boolean;
    onComplete: (data: any) => void;
    initialNickname?: string;
}

export default function OnboardingModal({ isOpen, onComplete, initialNickname }: OnboardingModalProps) {
    const [nickname, setNickname] = useState(initialNickname || generateNickname());
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
            console.error("저장 에러 상세:", error);
            alert("저장 실패! 브라우저 개발자 도구(F12) 콘솔창을 확인해주세요.");
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
                    {/* 닉네임 */}
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

                    {/* 드롭다운: 연령대 옵션 수정 완료 */}
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <select
                                onChange={(e) => setGender(e.target.value)}
                                value={gender}
                                className="w-full border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl font-bold dark:text-gray-300 outline-none appearance-none cursor-pointer"
                            >
                                <option value="">성별</option>
                                <option value="남성">남성</option>
                                <option value="여성">여성</option>
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
                                {['10대 이하', '20대', '30대', '40대', '50대', '60대 이상'].map((a) => (
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