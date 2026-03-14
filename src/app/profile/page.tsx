'use client';
import { useState } from 'react';

export default function ProfileSetup() {
    const [data, setData] = useState({ nickname: '', gender: '', age: '' });

    return (
        <div className="max-w-md mx-auto p-8 space-y-6">
            <h1 className="text-2xl font-bold">추가 정보를 입력해주세요</h1>
            <input placeholder="닉네임" onChange={e => setData({ ...data, nickname: e.target.value })} className="w-full border p-2" />

            <select onChange={e => setData({ ...data, gender: e.target.value })} className="w-full border p-2">
                <option value="">성별 선택</option>
                <option value="male">남성</option>
                <option value="female">여성</option>
            </select>

            <select onChange={e => setData({ ...data, age: e.target.value })} className="w-full border p-2">
                <option value="">연령대 선택</option>
                {Array.from({ length: 8 }, (_, i) => (i + 1) * 10).map(age => (
                    <option key={age} value={age}>{age}대</option>
                ))}
            </select>

            <button className="w-full bg-blue-600 text-white p-2">저장하기</button>
        </div>
    );
}