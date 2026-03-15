'use client'

import Link from 'next/link'
import Image from 'next/image'

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 py-20 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">

          {/* 브랜드 섹션 - 로고 옆 세일쉽 추가 */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 group mb-8 w-fit">
              <div className="relative w-12 h-12 transition-transform group-hover:scale-105">
                <Image
                  src="/images/anchor-logo.png"
                  alt="Saleship Logo"
                  fill
                  sizes="48px"
                  className="object-contain"
                  priority
                />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black tracking-tighter text-white">
                  Saleship
                </span>
                <span className="text-sm font-bold text-slate-400 tracking-tight">
                  세일쉽
                </span>
              </div>
            </Link>
            <p className="text-slate-400 max-w-sm font-medium leading-relaxed text-sm md:text-base">
              운영자가 직접 선별한 최고의 할인 정보와 라이프스타일 큐레이션을 제공하는 핫딜 커뮤니티입니다. 허위 정보 없는 클린한 쇼핑 환경을 지향합니다.
            </p>
          </div>

          {/* Service 링크 */}
          <div>
            <h3 className="text-white font-black uppercase tracking-widest text-xs mb-8 opacity-40">Service</h3>
            <ul className="space-y-4 font-bold text-sm">
              <li><Link href="/deals" className="hover:text-blue-500 transition-colors">핫딜 게시판</Link></li>
              <li><Link href="/community" className="hover:text-blue-500 transition-colors">커뮤니티</Link></li>
              <li><Link href="/deals?sort=popular" className="hover:text-blue-500 transition-colors">최신 트렌드</Link></li>
            </ul>
          </div>

          {/* Contact 링크 */}
          <div>
            <h3 className="text-white font-black uppercase tracking-widest text-xs mb-8 opacity-40">Contact</h3>
            <ul className="space-y-4 font-bold text-sm">
              <li><Link href="/support" className="hover:text-blue-500 transition-colors">문의하기</Link></li>
              <li><Link href="/guide" className="hover:text-blue-500 transition-colors">이용 안내</Link></li>
              <li><Link href="/faq" className="hover:text-blue-500 transition-colors">자주 묻는 질문</Link></li>
            </ul>
          </div>
        </div>

        {/* 하단 바 */}
        <div className="pt-10 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-xs font-bold text-slate-500 tracking-tight">
            © 2026 Saleship. All rights reserved. Made by ksy with Pingu.
          </div>
          <div className="flex gap-8 text-[11px] font-black uppercase tracking-widest text-slate-500">
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer;