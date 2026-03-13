'use client';

import React, { useState } from 'react';
import { useForm, ValidationError } from '@formspree/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Send, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ContactPage() {
  const [state, handleSubmit] = useForm("xpwwjlvq"); // 임시 ID, 나중에 환경변수 처리가 권장됨
  const [formData, setFormData] = useState({
    email: '',
    title: '',
    message: ''
  });

  if (state.succeeded) {
    return (
      <div className="container mx-auto px-4 py-24 flex justify-center">
        <Card className="w-full max-w-md border-none shadow-2xl rounded-[2.5rem] p-8 text-center animate-in zoom-in duration-500">
          <div className="inline-block p-5 bg-green-50 rounded-full mb-6">
            <CheckCircle2 size={48} className="text-green-500" />
          </div>
          <CardHeader className="p-0 mb-6">
            <CardTitle className="text-2xl font-black text-slate-800">문의가 접수되었습니다!</CardTitle>
            <CardDescription className="text-lg font-medium text-slate-500 mt-2">
              최대한 빨리 답변해 드릴게요 🐧
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Button 
              onClick={() => window.location.href = '/'}
              className="w-full h-14 bg-slate-900 hover:bg-blue-600 text-white text-lg font-bold rounded-2xl shadow-lg transition-all"
            >
              홈으로 이동
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16 flex justify-center">
      <Card className="w-full max-w-xl border-none shadow-2xl bg-white/90 backdrop-blur-md rounded-[2.5rem] overflow-hidden">
        <div className="bg-blue-600 p-8 text-white text-center">
          <h1 className="text-3xl font-black mb-2">고객 문의</h1>
          <p className="font-medium opacity-90 text-blue-50">어떤 점이 궁금하신가요? 아래 폼을 작성해 주세요.</p>
        </div>
        
        <CardContent className="p-8 md:p-12">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-black text-slate-700 ml-1">이메일 주소</label>
              <Input
                id="email"
                type="email" 
                name="email"
                placeholder="답변 받을 이메일을 입력하세요"
                required
                className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all text-base font-medium"
              />
              <ValidationError prefix="Email" field="email" errors={state.errors} />
            </div>

            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-black text-slate-700 ml-1">문의 제목</label>
              <Input
                id="title"
                name="title"
                placeholder="문의 제목을 입력하세요"
                required
                className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all text-base font-medium"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-black text-slate-700 ml-1">문의 내용</label>
              <textarea
                id="message"
                name="message"
                placeholder="문의 내용을 상세히 작성해 주세요"
                required
                className="w-full min-h-[160px] p-5 rounded-2xl border-2 border-slate-100 bg-slate-50/50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-base font-medium"
              ></textarea>
              <ValidationError prefix="Message" field="message" errors={state.errors} />
            </div>

            <Button 
              type="submit" 
              disabled={state.submitting}
              className="w-full h-16 bg-blue-600 hover:bg-blue-700 text-white text-xl font-black rounded-2xl shadow-xl shadow-blue-100 transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3"
            >
              {state.submitting ? (
                <>
                  <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
                  준비 중...
                </>
              ) : (
                <>
                  <Send size={24} />
                  문의 발송하기
                </>
              )}
            </Button>
            
            {state.errors && (
              <div className="p-4 bg-rose-50 text-rose-500 rounded-2xl flex items-center gap-3 text-sm font-bold border border-rose-100">
                <AlertCircle size={20} />
                발송 중 오류가 발생했습니다. 다시 시도해 주세요.
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
