import React from 'react'
import { dealService } from '@/features/deals/dealService'
import DealDetailContent from './DealDetailContent'
import { supabase } from '@/lib/supabaseClient'

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
