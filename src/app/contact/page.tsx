'use client'

import React, { useState } from 'react'
import { Send, Mail, MessageSquare, MapPin } from 'lucide-react'
import { toast } from 'sonner'

export default function ContactPage() {
  return (
    <main className="container py-24 px-4">
      <div className="max-w-3xl mx-auto text-center">
        <div className="mb-16">
          <h1 className="text-5xl font-black mb-6 tracking-tight">Contact Us</h1>
          <p className="text-xl text-slate-500 font-medium">세일쉽에 궁금한 점이나 제안하고 싶은 내용이 있으신가요?</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-10 md:p-16 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-none text-left">
          <form action="https://formspree.io/f/mqakvjzb" method="POST" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-sm font-black text-slate-400 uppercase tracking-widest pl-1">성함</label>
                <input 
                  type="text" 
                  name="name"
                  required 
                  placeholder="홍길동"
                  className="w-full h-16 px-6 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none font-bold focus:ring-4 focus:ring-blue-500/10 transition-all border border-transparent focus:border-blue-500/20" 
                />
              </div>
              <div className="space-y-3">
                <label className="text-sm font-black text-slate-400 uppercase tracking-widest pl-1">이메일</label>
                <input 
                  type="email" 
                  name="email"
                  required 
                  placeholder="example@saleship.com"
                  className="w-full h-16 px-6 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none font-bold focus:ring-4 focus:ring-blue-500/10 transition-all border border-transparent focus:border-blue-500/20" 
                />
              </div>
            </div>
            
            <div className="space-y-3">
              <label className="text-sm font-black text-slate-400 uppercase tracking-widest pl-1">문의 제목</label>
              <input 
                type="text" 
                name="subject"
                required 
                placeholder="어떤 점이 궁금하신가요?"
                className="w-full h-16 px-6 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none font-bold focus:ring-4 focus:ring-blue-500/10 transition-all border border-transparent focus:border-blue-500/20" 
              />
            </div>

            <div className="space-y-3">
              <label className="text-sm font-black text-slate-400 uppercase tracking-widest pl-1">상세 내용</label>
              <textarea 
                name="message"
                required 
                placeholder="문의하실 내용을 상세히 적어주세요."
                className="w-full h-48 p-6 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none font-bold resize-none focus:ring-4 focus:ring-blue-500/10 transition-all border border-transparent focus:border-blue-500/20" 
              />
            </div>

            <button 
              type="submit" 
              className="w-full h-20 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-3xl font-black text-xl flex items-center justify-center gap-3 transition-all hover:bg-black dark:hover:bg-slate-100 active:scale-[0.98] shadow-2xl shadow-slate-300 dark:shadow-none"
            >
              문의 메시지 보내기
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}
