'use client'
import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { dealService } from '@/features/deals/dealService'
import { Deal } from '@/types/deal'
import { ExternalLink, Eye, ThumbsUp, MessageSquare, ArrowLeft, Share2, Bookmark } from 'lucide-react'
import CommentSection from '@/components/CommentSection/CommentSection'
import VoteControl from '@/components/VoteControl'

interface DealDetailContentProps {
  deal: Deal;
}

export default function DealDetailContent({ deal }: DealDetailContentProps) {
  const router = useRouter()

  useEffect(() => {
    // 페이지 로드 시 조회수 증가 (클라이언트 사이드 부수 효과)
    if (deal.id) {
      dealService.incrementViewCount(deal.id)
    }
  }, [deal.id])

  if (!deal) return null;

  return (
    <main className="min-h-screen bg-white dark:bg-slate-900 pb-20">
      <div className="container py-8 md:py-16">
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors font-bold"
          >
            <ArrowLeft size={20} /> 뒤로가기
          </button>
          <div className="flex gap-2">
            <button className="p-2 text-slate-400 hover:text-blue-500 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full transition-all">
              <Share2 size={22} />
            </button>
            <button className="p-2 text-slate-400 hover:text-amber-500 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full transition-all">
              <Bookmark size={22} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5">
            <div className="relative aspect-square bg-slate-50 dark:bg-slate-800/50 rounded-[2.5rem] overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm">
              <Image 
                src={deal.image} 
                alt={deal.title} 
                fill 
                className="object-contain p-8 md:p-12 hover:scale-105 transition-transform duration-700"
                unoptimized={deal.image?.startsWith('http')}
              />
              {deal.discount && (
                <div className="absolute top-6 left-6 bg-rose-500 text-white text-sm font-black px-4 py-1.5 rounded-2xl shadow-xl shadow-rose-200 dark:shadow-none">
                  SALE {deal.discount}%
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-7 flex flex-col">
            <div className="mb-2 flex items-center gap-3">
              <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 text-xs font-black rounded-lg uppercase tracking-wider">
                {deal.store || '세일쉽'}
              </span>
              <span className="text-slate-300 dark:text-slate-600">|</span>
              <span className="text-sm font-medium text-slate-400">{deal.category || '전체'}</span>
            </div>

            <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-4 leading-[1.15] tracking-tight">
              {deal.title}
            </h1>
            
            {deal.subtitle && (
              <p className="text-xl font-bold text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
                {deal.subtitle}
              </p>
            )}

            <div className="flex items-center gap-4 mb-10 pb-10 border-b border-slate-100 dark:border-slate-800">
              <div className="flex flex-col">
                <span className="text-sm font-bold text-slate-400 mb-1">현재 판매가</span>
                <span className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">
                  {Number(deal.price).toLocaleString()}원
                </span>
              </div>
              {Number(deal.originalPrice) > 0 && (
                <div className="flex flex-col ml-4">
                  <span className="text-sm font-bold text-slate-400 mb-1">정상가</span>
                  <span className="text-xl font-bold text-slate-300 dark:text-slate-600 line-through">
                    {Number(deal.originalPrice).toLocaleString()}원
                  </span>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-4 mb-10">
              <a 
                href={deal.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-3 py-5 bg-blue-600 hover:bg-blue-700 text-white text-lg font-black rounded-3xl transition-all shadow-xl shadow-blue-100 dark:shadow-none hover:-translate-y-1 active:scale-[0.98]"
              >
                구매하러 가기 <ExternalLink size={20} />
              </a>
              <p className="text-center text-xs text-slate-400 font-bold">판매처의 사정에 따라 가격이 변동되거나 종료될 수 있습니다.</p>
            </div>

            <div className="flex items-center gap-8 py-6 px-10 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800">
              <div className="flex flex-col items-center gap-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">조회수</span>
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-bold">
                  <Eye size={18} /> {deal.views}
                </div>
              </div>
              <div className="w-px h-8 bg-slate-200 dark:bg-slate-700"></div>
              <div className="flex flex-col items-center gap-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">투표하기</span>
                <VoteControl postId={deal.id} />
              </div>
              <div className="w-px h-8 bg-slate-200 dark:bg-slate-700"></div>
              <div className="flex flex-col items-center gap-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">댓글</span>
                <div className="flex items-center gap-2 text-blue-500 font-bold">
                  <MessageSquare size={18} /> {deal.comments}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20 lg:mt-32">
          <div className="mb-12 flex items-center gap-4">
            <h2 className="text-2xl font-black tracking-tighter text-slate-900 dark:text-white">상세 정보</h2>
            <div className="h-px flex-1 bg-slate-100 dark:bg-slate-800"></div>
          </div>
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <div className="bg-slate-50/50 dark:bg-slate-800/30 p-8 md:p-12 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-inner">
              <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-400 whitespace-pre-wrap">
                {deal.content || '상세 정보가 없습니다.'}
              </p>
            </div>
          </div>
        </div>

        <section className="mt-20">
          <CommentSection postId={deal.id.toString()} />
        </section>
      </div>
    </main>
  )
}
