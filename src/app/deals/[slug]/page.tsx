export const runtime = 'edge';

import DealDetailContent from './DealDetailContent';

// Next.js 15+ 방식에 맞춰 params를 Promise로 처리
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  // await를 사용하여 slug 값을 가져옴
  const { slug } = await params;

  return (
    <div>
      <DealDetailContent slug={slug} />
    </div>
  );
}