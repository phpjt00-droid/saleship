'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth'; // 기존 훅 유지

export default function ProfilePage() {
    const { user } = useAuth();
    const [data, setData] = useState({ nickname: '', gender: '', age: '' });
    const [daysJoined, setDaysJoined] = useState(0);

    // 가입일 계산 로직
    useEffect(() => {
        if (user?.created_at) {
            const created = new Date(user.created_at);
            const now = new Date();
            const diff = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
            setDaysJoined(diff);
        }
    }, [user]);

    const handleSave = () => {
        console.log('저장할 데이터:', data);
        alert('정보가 저장되었습니다!');
    };

    return (
        <div className="max-w-xl mx-auto p-6 space-y-8">
            {/* 1. LTV 요소 및 프로필 헤더 */}
            <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-6 transition-colors">
                <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-4xl">
                    🐧
                </div>
                <div>
                    <h1 className="text-2xl font-bold dark:text-white">{user?.nickname || '회원'}님</h1>
                    <p className="text-gray-500 dark:text-gray-400">세일쉽과 함께한 지 벌써 <span className="font-bold text-blue-600 dark:text-blue-400">{daysJoined}일</span>째!</p>
                </div>
            </div>

            {/* 2. 정보 수정 폼 */}
            <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-6 transition-colors">
                <h2 className="text-xl font-bold dark:text-white">내 정보 수정</h2>

                <input
                    placeholder="닉네임"
                    onChange={e => setData({ ...data, nickname: e.target.value })}
                    className="w-full border dark:border-gray-700 bg-transparent p-3 rounded-xl dark:text-white outline-none focus:border-blue-500"
                />

                <select
                    onChange={e => setData({ ...data, gender: e.target.value })}
                    className="w-full border dark:border-gray-700 bg-transparent p-3 rounded-xl dark:text-gray-400 outline-none"
                >
                    <option value="">성별 선택</option>
                    <option value="male">남성</option>
                    <option value="female">여성</option>
                </select>

                <select
                    onChange={e => setData({ ...data, age: e.target.value })}
                    className="w-full border dark:border-gray-700 bg-transparent p-3 rounded-xl dark:text-gray-400 outline-none"
                >
                    <option value="">연령대 선택</option>
                    {['10대', '20대', '30대', '40대', '50대', '60대', '70대', '80대'].map(age => (
                        <option key={age} value={age}>{age}</option>
                    ))}
                </select>

                <button
                    onClick={handleSave}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl font-bold transition-all transform hover:scale-[1.02]"
                >
                    저장하기
                </button>
            </div>
        </div>
    );
}