'use client';

import React, { useState } from 'react';
import { useForm, ValidationError } from '@formspree/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function ContactPage() {
  const [state, handleSubmit] = useForm("xpwwjlvq");
  const [isSuccess, setIsSuccess] = useState(false);

  // Formspree state change effect
  React.useEffect(() => {
    if (state.succeeded) {
      setIsSuccess(true);
      toast.success('문의가 성공적으로 전송되었습니다!', {
        description: '최대한 빨리 답변해 드릴게요 <img src="/images/pingu-announce.png.jpg" alt="" className="inline-block w-4 h-4 mb-0.5" />'
      });
    }
    if (state.errors) {
      toast.error('문의 발송 중 오류가 발생했습니다.');
    }
  }, [state.succeeded, state.errors]);

  if (isSuccess) {
    return (
      <div className="container mx-auto px-4 py-24 flex justify-center">
        <div className="w-full max-w-md border-none shadow-2xl bg-white rounded-[2.5rem] p-8 text-center animate-in zoom-in duration-500">
          <div className="inline-block p-5 bg-green-50 rounded-full mb-6">
            <CheckCircle2 size={48} className="text-green-500" />
          </div>
          <div className="mb-6">
            <h2 className="text-2xl font-black text-slate-800">문의가 접수되었습니다!</h2>
            <p className="text-lg font-medium text-slate-500 mt-2">
              최대한 빨리 답변해 드릴게요 <img src="/images/pingu-announce.png.jpg" alt="" className="inline-block w-6 h-6 mb-1" />
            </p>
          </div>
          <div>
            <button 
              onClick={() => window.location.href = '/'}
              className="inline-flex items-center justify-center whitespace-nowrap ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 w-full h-14 bg-slate-900 hover:bg-blue-600 text-white text-lg font-bold rounded-2xl shadow-lg transition-all"
            >
              홈으로 이동
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16 flex justify-center">
      <div className="w-full max-w-xl border-none shadow-2xl bg-white/90 backdrop-blur-md rounded-[2.5rem] overflow-hidden">
        <div className="bg-blue-600 p-8 text-white text-center">
          <h1 className="text-3xl font-black mb-2">고객 문의</h1>
          <p className="font-medium opacity-90 text-blue-50">어떤 점이 궁금하신가요? 아래 폼을 작성해 주세요.</p>
        </div>
        
        <div className="p-8 md:p-12">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-black text-slate-700 ml-1">이메일 주소</label>
              <input
                id="email"
                type="email" 
                name="email"
                placeholder="답변 받을 이메일을 입력하세요"
                required
                className="flex h-14 w-full rounded-2xl border border-slate-100 bg-slate-50/50 px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 focus:bg-white transition-all font-medium"
              />
              <ValidationError prefix="Email" field="email" errors={state.errors} />
            </div>

            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-black text-slate-700 ml-1">문의 제목</label>
              <input
                id="title"
                name="title"
                type="text"
                placeholder="문의 제목을 입력하세요"
                required
                className="flex h-14 w-full rounded-2xl border border-slate-100 bg-slate-50/50 px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 focus:bg-white transition-all font-medium"
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

            <button 
              type="submit" 
              disabled={state.submitting}
              className="inline-flex items-center justify-center whitespace-nowrap text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 w-full h-16 bg-blue-600 hover:bg-blue-700 text-white text-xl font-black rounded-2xl shadow-xl shadow-blue-100 transition-all hover:-translate-y-1 active:scale-95 gap-3"
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
            </button>
            
            {state.errors && (
              <div className="p-4 bg-rose-50 text-rose-500 rounded-2xl flex items-center gap-3 text-sm font-bold border border-rose-100">
                <AlertCircle size={20} />
                발송 중 오류가 발생했습니다. 다시 시도해 주세요.
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
