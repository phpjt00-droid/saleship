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
        <main className="container py-8 md:py-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16 flex-shrink-0">
                        <Image
                            src="/images/pingu-support.png"
                            alt="문의하기 펭귄"
                            fill
                            priority
                            sizes="64px"
                            className="object-contain"
                        />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black tracking-tight mb-2 dark:text-white">문의하기</h1>
                        <p className="text-slate-500 dark:text-slate-400 font-medium">궁금한 점을 편하게 남겨주세요.</p>
                    </div>
                </div>
            </div>

            <div className="max-w-2xl">
                <form
                    action="https://formspree.io/f/xnjgpgwp"
                    method="POST"
                    onSubmit={handleSubmit}
                    className="space-y-6 bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border dark:border-slate-800 shadow-xl shadow-slate-100 dark:shadow-none"
                >
                    <div>
                        <label htmlFor="email" className="block text-sm font-bold mb-2 ml-1 dark:text-slate-300">이메일</label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            placeholder="답변받으실 이메일을 입력하세요"
                            required
                            className="w-full p-4 text-base md:text-sm rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        />
                    </div>

                    <div>
                        <label htmlFor="message" className="block text-sm font-bold mb-2 ml-1 dark:text-slate-300">문의 내용</label>
                        <textarea
                            name="message"
                            id="message"
                            placeholder="문의 내용을 상세히 적어주세요"
                            required
                            rows={6}
                            className="w-full p-4 text-base md:text-sm rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={status === 'submitting'}
                        className="w-full py-4 bg-blue-600 text-white font-black rounded-xl hover:bg-blue-700 disabled:bg-slate-400 transition-all active:scale-95 shadow-lg shadow-blue-200 dark:shadow-none"
                    >
                        {status === 'submitting' ? '전송 중...' : '문의 보내기'}
                    </button>

                    {status === 'success' && (
                        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-100 dark:border-green-800/30 animate-in fade-in slide-in-from-top-2">
                            <p className="text-center font-bold text-green-600 dark:text-green-400">
                                문의가 성공적으로 접수되었습니다!
                            </p>
                        </div>
                    )}
                </form>
            </div>
        </main>
    )
}