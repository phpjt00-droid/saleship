'use client';

import React from 'react';
import Image from 'next/image';
import { Search, Award } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-24 md:pt-48 md:pb-32 bg-white dark:bg-slate-950">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[600px] h-[600px] bg-blue-50/50 dark:bg-blue-900/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[400px] h-[400px] bg-pink-50/50 dark:bg-pink-900/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-xs font-black uppercase tracking-widest mb-8 animate-in fade-in duration-1000">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
              </span>
              Curated Hot Deals
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900 dark:text-white mb-8 leading-[1.1] animate-in fade-in duration-1000 delay-100">
              취향과 가치를 담은 핫딜,<br />
              <span className="text-blue-600 underline decoration-blue-200 dark:decoration-blue-900/50 decoration-8 underline-offset-4">세일쉽(Saleship)</span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 mb-10 max-w-2xl mx-auto lg:mx-0 font-medium leading-relaxed animate-in fade-in duration-1000 delay-200">
              단순히 저렴한 물건이 아닌, 당신의 라이프스타일을 완성할 특별한 제안을 만나보세요. 깐깐하게 엄선된 정보만을 전달합니다.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 animate-in fade-in duration-1000 delay-300">
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  const val = (e.currentTarget.elements.namedItem('q') as HTMLInputElement).value;
                  if (val) window.location.href = `/deals?q=${encodeURIComponent(val)}`;
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
                  <span className="hidden sm:inline">검색</span>
                </button>
              </form>
            </div>
          </div>

          <div className="flex-1 relative animate-in fade-in duration-1000 delay-500">
            <div className="relative w-full max-w-[500px] aspect-square mx-auto lg:ml-auto">
              {/* Glass Card Effect */}
              <div className="absolute inset-0 bg-blue-100/30 dark:bg-blue-900/20 rounded-[3rem] -rotate-6 scale-95 transition-transform group-hover:rotate-0" />
              <div className="absolute inset-0 bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800 flex items-center justify-center">
                <Image 
                  src="/images/pingu-hello.png" 
                  alt="Saleship Mascot Hello" 
                  width={350} 
                  height={350}
                  className="object-contain transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              
              {/* Floating Badges */}
              <div className="absolute -top-4 -right-4 bg-rose-500 text-white p-6 rounded-3xl font-black text-2xl shadow-xl rotate-12 animate-pulse">
                대박 할인!
              </div>
              <div className="absolute -bottom-8 -left-8 bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 relative overflow-hidden bg-blue-50 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
                    <Image 
                      src="/images/pingu-search.png" 
                      alt="Search Pingu" 
                      fill
                      className="object-contain p-2"
                    />
                  </div>
                  <div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Editor's Pick</div>
                    <div className="text-sm font-black text-slate-900 dark:text-white">핑구가 추천하는 핫딜</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
