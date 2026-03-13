'use client'

import React, { useState } from 'react'
import { Send, Mail, MessageSquare, MapPin } from 'lucide-react'
import { toast } from 'sonner'

export default function ContactPage() {
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      toast.success('문의가 접수되었습니다. 곧 답변 드리겠습니다!')
      setLoading(false)
    }, 1000)
  }

  return (
    <main className="container py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-black mb-6">Contact Us</h1>
          <p className="text-xl text-slate-500 font-bold">세일쉽에 궁금한 점이 있으신가요? 언제든 문의해 주세요.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-8 rounded-3xl border text-center">
            <Mail className="mx-auto mb-4 text-blue-600" size={32} />
            <h3 className="font-black mb-2">Email</h3>
            <p className="text-sm text-slate-500 font-bold">phpjt00@gmail.com</p>
          </div>
          <div className="bg-white p-8 rounded-3xl border text-center">
            <MessageSquare className="mx-auto mb-4 text-rose-500" size={32} />
            <h3 className="font-black mb-2">Discord</h3>
            <p className="text-sm text-slate-500 font-bold">Join our community</p>
          </div>
          <div className="bg-white p-8 rounded-3xl border text-center">
            <MapPin className="mx-auto mb-4 text-emerald-500" size={32} />
            <h3 className="font-black mb-2">Office</h3>
            <p className="text-sm text-slate-500 font-bold">Seoul, South Korea</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-10 rounded-[3rem] border shadow-xl shadow-slate-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Name</label>
              <input type="text" required className="w-full h-14 px-6 bg-slate-50 rounded-2xl outline-none font-bold focus:ring-2 focus:ring-blue-500/20" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Email</label>
              <input type="email" required className="w-full h-14 px-6 bg-slate-50 rounded-2xl outline-none font-bold focus:ring-2 focus:ring-blue-500/20" />
            </div>
          </div>
          <div className="space-y-2 mb-8">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Message</label>
            <textarea required className="w-full h-40 p-6 bg-slate-50 rounded-2xl outline-none font-bold resize-none focus:ring-2 focus:ring-blue-500/20" />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full h-16 bg-slate-900 text-white rounded-2xl font-black text-lg flex items-center justify-center gap-2 transition-all active:scale-95 shadow-xl"
          >
            <Send size={20} /> {loading ? '보내는 중...' : '메시지 보내기'}
          </button>
        </form>
      </div>
    </main>
  )
}
