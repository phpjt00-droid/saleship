'use client'

import { useState } from 'react'
import Image from 'next/image'

export default function SupportPage() {
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle')

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setStatus('submitting')
        const form = e.currentTarget
        const formData = new FormData(form)

        await fetch(form.action, {
            method: 'POST',
            body: formData,
            headers: { 'Accept': 'application/json' }
        })
        setStatus('success')
        form.reset()
    }

    return (
        <main className="container py-8 md:py-12 max-w-2xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                <div className="flex items-center gap-4">
                    {/* 부모 컨테이너 크기 명시 및 안정성 추가 */}
                    <div className="relative w-16 h-16 flex-shrink-0">
                        <Image
                            src="/images/pingu-support.png"
                            alt="문의하기 펭귄"
                            fill
                            priority // 중요 이미지는 우선 로딩
                            sizes="64px"
                            className="object-contain"
                            onError={(e) => console.error("이미지 로드 실패:", e)}
                        />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black tracking-tight mb-2 dark:text-white">문의하기</h1>
                        <p className="text-slate-500 dark:text-slate-400 font-medium">궁금한 점을 편하게 남겨주세요.</p>
                    </div>
                </div>
            </div>

            <form
                action="https://formspree.io/f/phpjt00@gmail.com"
                method="POST"
                onSubmit={handleSubmit}
                className="space-y-6 bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border dark:border-slate-800 shadow-xl shadow-slate-100 dark:shadow-none"
            >
                <input
                    type="email"
                    name="email"
                    placeholder="답변받으실 이메일"
                    required
                    className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <textarea
                    name="message"
                    placeholder="문의 내용을 입력하세요"
                    required
                    rows={6}
                    className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="w-full py-4 bg-blue-600 text-white font-black rounded-xl hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-200 dark:shadow-none"
                >
                    {status === 'submitting' ? '전송 중...' : '문의 보내기'}
                </button>
                {status === 'success' && (
                    <p className="text-center font-bold text-green-600 animate-in fade-in">문의가 성공적으로 접수되었습니다!</p>
                )}
            </form>
        </main>
    )
}