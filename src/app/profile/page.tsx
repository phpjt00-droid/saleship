'use client';
import { useState } from 'react';

export default function ProfilePage() {
    const [data, setData] = useState({ nickname: '', gender: '', age: '' });

    const handleSave = () => {
        // 여기에 Supabase 업데이트 로직을 추후 연결할 것입니다.
        console.log('저장할 데이터:', data);
    };

    return (
        <div className="max-w-md mx-auto p-8 space-y-6">
            <h1 className="text-2xl font-bold">내 정보 설정/수정</h1>

            <input
                placeholder="닉네임"
                onChange={e => setData({ ...data, nickname: e.target.value })}
                className="w-full border p-2 rounded"
            />

            <select onChange={e => setData({ ...data, gender: e.target.value })} className="w-full border p-2 rounded">
                <option value="">성별 선택</option>
                <option value="male">남성</option>
                <option value="female">여성</option>
            </select>

            <select onChange={e => setData({ ...data, age: e.target.value })} className="w-full border p-2 rounded">
                <option value="">연령대 선택</option>
                {['10대', '20대', '30대', '40대', '50대', '60대', '70대', '80대'].map(age => (
                    <option key={age} value={age}>{age}</option>
                ))}
            </select>

            <button
                onClick={handleSave}
                className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
            >
                저장하기
            </button>
        </div>
    );
}