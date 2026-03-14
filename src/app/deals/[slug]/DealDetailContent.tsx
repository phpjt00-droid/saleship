interface DealDetailContentProps {
  slug: string;
}

export default function DealDetailContent({ slug }: DealDetailContentProps) {
  return (
    <div>
      <h1>Deal Detail: {slug}</h1>
      {/* 여기에 기존의 상세 페이지 내용을 작성하세요 */}
    </div>
  );
}