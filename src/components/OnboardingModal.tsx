'use client';
import { useState } from 'react';
import { generateNickname } from '@/utils/nicknameGenerator';

export default function OnboardingModal({ isOpen, onComplete }: { isOpen: boolean, onComplete: (data: any) => void }) {
    const [data, setData] = useState({ nickname: generateNickname(), gender: '', age: '' });

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-900 p-8 rounded-[2rem] w-full max-w-sm shadow-2xl border border-gray-100 dark:border-gray-800 space-y-6">
                {/* 헤더 부분 */}
                <div className="text-center space-y-2">
                    <div className="text-5xl">🐧</div>
                    <h2 className="text-2xl font-black dark:text-white">세일쉽 환영해요!</h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">정보를 입력하고 핫딜 여행을 시작하세요</p>
                </div>

                {/* 입력 폼 */}
                <div className="space-y-4">
                    <input
                        value={data.nickname}
                        onChange={e => setData({ ...data, nickname: e.target.value })}
                        className="w-full border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl dark:text-white font-bold outline-none focus:border-blue-600 transition"
                    />

                    <select
                        onChange={e => setData({ ...data, gender: e.target.value })}
                        className="w-full border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl dark:text-gray-400 outline-none"
                    >
                        <option value="">성별 선택</option>
                        <option value="male">남성</option>
                        <option value="female">여성</option>
                    </select>

                    {/* 연령대 선택 추가 */}
                    <select
                        onChange={e => setData({ ...data, age: e.target.value })}
                        className="w-full border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl dark:text-gray-400 outline-none"
                    >
                        <option value="">연령대 선택</option>
                        {['10대', '20대', '30대', '40대', '50대', '60대', '70대', '80대'].map(age => (
                            <option key={age} value={age}>{age}</option>
                        ))}
                    </select>
                </div>

                <button
                    onClick={() => onComplete(data)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-2xl font-black text-lg transition-all transform hover:scale-[1.02] shadow-lg shadow-blue-500/30"
                >
                    시작하기
                </button>
            </div>
        </div>
    );
}