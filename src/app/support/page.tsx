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
            <div className="flex items-center gap-4 mb-12">
                <div className="relative w-16 h-16">
                    <Image src="/images/pingu-support.png" alt="문의하기" fill className="object-contain" />
                </div>
                <div>
                    <h1 className="text-4xl font-black tracking-tight mb-2 dark:text-white">문의하기</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">궁금한 점을 편하게 남겨주세요.</p>
                </div>
            </div>

            <form
                action="https://formspree.io/f/phpjt00@gmail.com"
                method="POST"
                onSubmit={handleSubmit}
                className="space-y-6 bg-white dark:bg-slate-900 p-8 rounded-3xl border dark:border-slate-800"
            >
                <input type="email" name="email" placeholder="답변받으실 이메일" required className="w-full p-4 rounded-xl border dark:bg-slate-800 dark:text-white" />
                <textarea name="message" placeholder="문의 내용을 입력하세요" required rows={6} className="w-full p-4 rounded-xl border dark:bg-slate-800 dark:text-white" />
                <button type="submit" disabled={status === 'submitting'} className="w-full py-4 bg-blue-600 text-white font-black rounded-xl hover:bg-blue-700 transition-all">
                    {status === 'submitting' ? '전송 중...' : '문의 보내기'}
                </button>
            </form>
        </main>
    )
}