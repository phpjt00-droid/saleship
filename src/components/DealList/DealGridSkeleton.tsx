import SkeletonCard from '../SkeletonCard/SkeletonCard';

interface DealGridSkeletonProps {
  count?: number;
  isListForm?: boolean;
}

export default function DealGridSkeleton({ count = 8, isListForm = false }: DealGridSkeletonProps) {
  return (
    <div className={
      isListForm 
        ? "flex flex-col gap-4" 
        : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    }>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} isListForm={isListForm} />
      ))}
    </div>
  );
}
