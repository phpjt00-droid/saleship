'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) toast.error(error.message)
    else {
      toast.success('로그인 성공!')
      router.push('/')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100">
        <div>
          <h2 className="mt-6 text-center text-4xl font-black text-slate-900">Welcome Back</h2>
          <p className="mt-2 text-center text-sm font-bold text-slate-500">
            Saleship에 다시 오신 것을 환영합니다.
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-2xl relative block w-full px-6 py-4 border-none bg-slate-50 placeholder-slate-400 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:z-10 sm:text-sm"
                placeholder="이메일 주소"
              />
            </div>
            <div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-2xl relative block w-full px-6 py-4 border-none bg-slate-50 placeholder-slate-400 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:z-10 sm:text-sm"
                placeholder="비밀번호"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-black rounded-2xl text-white bg-slate-900 hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-all active:scale-95 shadow-lg"
            >
              {loading ? '로그인 중...' : '로그인'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
