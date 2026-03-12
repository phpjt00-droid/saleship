-- deals 테이블 생성 SQL
-- Supabase SQL Editor에 복사하여 실행해 주세요.

CREATE TABLE IF NOT EXISTS public.deals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    subtitle TEXT,
    content TEXT,
    price INTEGER,
    discount INTEGER,
    image TEXT,
    link TEXT,
    category TEXT,
    views INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS (Row Level Security) 설정
ALTER TABLE public.deals ENABLE ROW LEVEL SECURITY;

-- 1. 모든 사용자가 핫딜 정보를 조회할 수 있도록 허용
CREATE POLICY "Allow public read access" ON public.deals
    FOR SELECT USING (true);

-- 2. 인증된 사용자(관리자 등)만 핫딜을 등록할 수 있도록 허용
-- 실제 서비스에서는 관리자 역할을 별도로 체크하는 로직이 권장됩니다.
CREATE POLICY "Allow authenticated users to insert deals" ON public.deals
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 3. 인증된 사용자(작성자 등)만 핫딜 정보를 수정할 수 있도록 허용
CREATE POLICY "Allow authenticated users to update deals" ON public.deals
    FOR UPDATE USING (auth.role() = 'authenticated');

-- 인덱스 추가 (검색 및 성능 최적화)
CREATE INDEX IF NOT EXISTS deals_slug_idx ON public.deals (slug);
CREATE INDEX IF NOT EXISTS deals_category_idx ON public.deals (category);
CREATE INDEX IF NOT EXISTS deals_created_at_idx ON public.deals (created_at DESC);
