'use client';

import React from 'react';
import Image from 'next/image';
import { Search } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-white dark:bg-slate-900 pt-32 pb-20 md:pt-40 md:pb-32">
      {/* Background patterns */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-50/50 dark:bg-blue-900/10 rounded-full blur-3xl opacity-60"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-rose-50/50 dark:bg-rose-900/10 rounded-full blur-3xl opacity-60"></div>
      </div>

      <div className="container relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Text Content */}
          <div className="flex-1 text-center lg:text-left animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              <span className="text-xs font-black uppercase tracking-widest">대한민국 모든 핫딜이 한눈에</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white leading-[1.1] tracking-tighter mb-8">
              쇼핑의 정답,<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-rose-500">세일쉽</span>에서 찾으세요.
            </h1>
            
            <p className="text-xl text-slate-500 dark:text-slate-400 font-medium mb-12 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              매일 쏟아지는 수천 개의 할인 정보 중<br className="hidden sm:block" />
              당신에게 꼭 필요한 진짜 핫딜만 펭귄이 찾아드립니다.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  const val = (e.currentTarget.elements.namedItem('q') as HTMLInputElement).value;
                  if (val) window.location.href = `/deal?q=${encodeURIComponent(val)}`;
                }}
                className="relative w-full sm:w-[450px] group flex"
              >
                <input 
                  type="text" 
                  name="q"
                  placeholder="원하는 상품을 검색해보세요"
                  className="w-full h-16 pl-6 pr-4 bg-slate-100 dark:bg-slate-800 border-none rounded-l-2xl outline-none transition-all font-bold text-lg focus:bg-white dark:focus:bg-slate-700 focus:ring-4 focus:ring-blue-500/20"
                />
                <button type="submit" className="h-16 px-8 bg-blue-600 hover:bg-blue-700 text-white rounded-r-2xl transition-colors font-black flex items-center justify-center gap-2">
                  <Search size={20} />
                  <span className="hidden sm:inline">Search</span>
                </button>
              </form>
            </div>
          </div>

          {/* Mascot Image */}
          <div className="flex-1 relative animate-in zoom-in fade-in duration-1000 delay-200">
            <div className="relative w-[300px] h-[300px] md:w-[500px] md:h-[500px] mx-auto">
              {/* Decorative rings */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] border-2 border-slate-100 dark:border-slate-800 rounded-full animate-[spin_20s_linear_infinite]"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] h-[85%] border-2 border-slate-100 dark:border-slate-800 border-dashed rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
              
              <Image 
                src="/images/pingu-hello.png.jpg" 
                alt="세일쉽 펭귄 마스코트" 
                fill
                priority
                className="object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Floating Badges */}
            <div className="absolute top-[20%] right-0 bg-white dark:bg-slate-800 shadow-2xl p-4 rounded-2xl animate-bounce duration-[3000ms]">
              <div className="text-rose-500 font-black text-xl">80% UP</div>
              <div className="text-[10px] text-slate-400 font-bold">폭탄 세일 진행 중</div>
            </div>
            <div className="absolute bottom-[20%] left-0 bg-white dark:bg-slate-800 shadow-2xl p-4 rounded-2xl animate-bounce duration-[4000ms] delay-500">
              <div className="text-blue-600 font-black text-xl">LIVE DEALS</div>
              <div className="text-[10px] text-slate-400 font-bold">실시간 핫딜 24h</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
