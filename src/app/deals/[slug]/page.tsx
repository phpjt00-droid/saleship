export const runtime = 'edge';

import DealDetailContent from './DealDetailContent'; // 실제 파일 위치에 맞게 수정 필요 시 확인

export default async function Page({ params }: { params: { slug: string } }) {
  // 페이지 로직
  return (
    <div>
      <DealDetailContent slug={params.slug} />
    </div>
  );
}