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

        <div className="bg-white dark:bg-slate-900 p-12 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-100/50 dark:shadow-none">
          <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/30 rounded-3xl flex items-center justify-center mx-auto mb-8">
            <Mail className="text-blue-600 dark:text-blue-400" size={40} />
          </div>
          <h2 className="text-2xl font-black mb-4">Support Email</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8 font-medium">관리자에게 직접 메일을 보내 문의하실 수 있습니다.</p>
          <a 
            href="mailto:phpjt00@gmail.com"
            className="inline-flex items-center gap-3 px-10 py-5 bg-slate-900 dark:bg-white dark:text-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 dark:hover:bg-slate-100 transition-all shadow-xl"
          >
            phpjt00@gmail.com
          </a>
        </div>
      </div>
    </main>
  )
}
