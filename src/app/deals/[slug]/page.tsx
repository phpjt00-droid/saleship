export const runtime = 'edge';

import DealDetailContent from './DealDetailContent';

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  return (
    <div>
      <DealDetailContent slug={slug} />
    </div>
  );
}