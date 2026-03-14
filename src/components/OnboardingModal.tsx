'use client';
import { useState } from 'react';
import { generateNickname } from '@/utils/nicknameGenerator';

export default function OnboardingModal({ isOpen, onComplete }: { isOpen: boolean, onComplete: (data: any) => void }) {
    const [data, setData] = useState({ nickname: generateNickname(), gender: '', age: '' });

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl w-full max-w-sm space-y-6">
                <h2 className="text-xl font-bold dark:text-white">세일쉽에 오신 걸 환영해요!</h2>
                <input
                    value={data.nickname}
                    onChange={e => setData({ ...data, nickname: e.target.value })}
                    className="w-full border dark:border-gray-700 bg-transparent p-3 rounded-xl dark:text-white"
                />
                <select onChange={e => setData({ ...data, gender: e.target.value })} className="w-full border p-3 rounded-xl">
                    <option value="">성별 선택</option>
                    <option value="male">남성</option>
                    <option value="female">여성</option>
                </select>
                <button
                    onClick={() => onComplete(data)}
                    className="w-full bg-blue-600 text-white p-3 rounded-xl font-bold"
                >
                    시작하기
                </button>
            </div>
        </div>
    );
}