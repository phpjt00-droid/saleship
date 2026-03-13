-- posts 테이블 확장 마이그레이션
-- 기존 posts 테이블에 새로운 전문 필드들을 추가합니다.

ALTER TABLE public.posts 
ADD COLUMN IF NOT EXISTS brand_name TEXT,
ADD COLUMN IF NOT EXISTS deal_link TEXT,
ADD COLUMN IF NOT EXISTS promo_code TEXT,
ADD COLUMN IF NOT EXISTS end_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS upvote_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS authorId TEXT; -- RLS 정책에서 참조하는 필드 누락 수정

-- 기존 likes 데이터를 upvote_count로 마이그레이션 (필요시)
UPDATE public.posts SET upvote_count = likes WHERE upvote_count = 0 AND likes > 0;

-- 인덱스 추가 (카테고리 필터링 성능 최적화)
CREATE INDEX IF NOT EXISTS idx_posts_category ON public.posts(category);
CREATE INDEX IF NOT EXISTS idx_posts_brand_name ON public.posts(brand_name);
