'use client';

import React from 'react';
import Image from 'next/image';
import { Search } from 'lucide-react';

export default function Hero() {
  return (
    // pt-20으로 모바일 상단 여백 축소
    <section className="relative overflow-hidden pt-20 pb-16 md:pt-48 md:pb-32 bg-white dark:bg-slate-950">
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-blue-50/50 dark:bg-blue-900/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[200px] h-[200px] md:w-[400px] md:h-[400px] bg-pink-50/50 dark:bg-pink-900/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container relative z-10 px-6">
        <div className="flex flex-col lg:flex-row items-center gap-10 md:gap-16">
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest mb-6">
              Curated Hot Deals
            </div>

            {/* 모바일에서는 text-4xl로 크기 조정 */}
            <h1 className="text-4xl md:text-5xl lg:text-[5rem] font-black tracking-tighter text-slate-900 dark:text-white mb-6 md:mb-8 leading-[1.1]">
              취향과 가치를 담은 핫딜, <span className="text-blue-600">Saleship</span>
            </h1>

            <p className="text-base md:text-xl text-slate-500 dark:text-slate-400 mb-8 max-w-xl mx-auto lg:mx-0 font-medium leading-[1.6]">
              단순히 저렴한 물건이 아닌, 당신의 라이프스타일을 완성할 특별한 제안을 만나보세요. 깐깐하게 엄선된 정보만을 전달합니다.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const val = (e.currentTarget.elements.namedItem('q') as HTMLInputElement).value;
                if (val) window.location.href = `/deals?q=${encodeURIComponent(val)}`;
              }}
              className="relative w-full sm:w-[450px] mx-auto lg:mx-0 flex"
            >
              <input
                type="text"
                name="q"
                placeholder="검색어 입력..."
                className="w-full h-14 md:h-16 pl-6 bg-slate-100 dark:bg-slate-800 border-none rounded-l-2xl outline-none transition-all font-bold text-base md:text-lg focus:ring-4 focus:ring-blue-500/20"
              />
              <button type="submit" className="h-14 md:h-16 px-6 md:px-8 bg-blue-600 hover:bg-blue-700 text-white rounded-r-2xl font-black flex items-center justify-center">
                <Search size={20} />
              </button>
            </form>
          </div>

          {/* 펭귄 이미지 컨테이너: 모바일에서 너비 제한으로 삐져나가는 것 방지 */}
          <div className="flex-1 relative w-full max-w-[350px] md:max-w-[500px]">
            <div className="relative aspect-square w-full">
              <div className="absolute inset-0 bg-blue-100/30 dark:bg-blue-900/20 rounded-[2rem] md:rounded-[3rem] -rotate-6" />
              <div className="absolute inset-0 bg-white dark:bg-slate-900 rounded-[2rem] md:rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100 flex items-center justify-center">
                <Image
                  src="/images/pingu-hello.png"
                  alt="Mascot"
                  width={300}
                  height={300}
                  className="object-contain"
                />
              </div>

              {/* Badge 조절: 모바일에서 잘리지 않게 위치 조정 */}
              <div className="absolute -top-2 -right-2 md:-top-4 md:-right-4 bg-rose-500 text-white px-4 py-2 md:p-6 rounded-2xl md:rounded-3xl font-black text-sm md:text-2xl shadow-xl rotate-12">
                대박 할인!
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}