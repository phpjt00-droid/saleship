import React from 'react'
import { dealService } from '@/features/deals/dealService'
import DealDetailContent from './DealDetailContent'
import { supabase } from '@/lib/supabaseClient'

import { Metadata } from 'next'

// 동적 메타데이터 생성
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  try {
    const deal = await dealService.getDealBySlug(slug);
    if (!deal) return { title: '존재하지 않는 핫딜 | Saleship' };

    const title = `[${deal.brand_name}] ${deal.title} | 세일쉽(Saleship)`;
    const description = `${deal.store} 특가! ${Number(deal.price).toLocaleString()}원 (${deal.discount}% 할인). ${deal.summary || '세일쉽에서 엄선한 최신 핫딜 정보를 지금 바로 확인해 보세요.'}`;
    
    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: [deal.image],
        type: 'article',
        siteName: '세일쉽(Saleship)',
        locale: 'ko_KR',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [deal.image],
      }
    };
  } catch (error) {
    return { title: '핫딜 상세 정보 | Saleship' };
  }
}

// 정적 빌드를 위한 슬러그 생성
export async function generateStaticParams() {
  return [
    { slug: 'test-deal' }
  ];
}

export default async function DealDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  
  try {
    const deal = await dealService.getDealBySlug(slug);
    
    if (!deal) {
      return (
        <div className="container py-40 text-center">
          <h1 className="text-2xl font-bold mb-4">존재하지 않는 핫딜입니다.</h1>
        </div>
      );
    }

    return <DealDetailContent deal={deal} />;
  } catch (error) {
    console.error('Error fetching deal in server component:', error);
    return (
      <div className="container py-40 text-center">
        <h1 className="text-2xl font-bold mb-4">정보를 불러오는 중 오류가 발생했습니다.</h1>
      </div>
    );
  }
}
