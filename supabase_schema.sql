-- posts 테이블 생성 SQL
-- Supabase SQL Editor에 복사해서 실행해 주세요.

CREATE TABLE IF NOT EXISTS public.posts (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    title TEXT NOT NULL,
    content TEXT,
    category TEXT,
    store TEXT,
    date TIMESTAMPTZ,
    image TEXT,
    link TEXT UNIQUE,
    views TEXT DEFAULT '0',
    likes INTEGER DEFAULT 0,
    comments INTEGER DEFAULT 0,
    price_info JSONB DEFAULT '{"currentPrice": "특가 확인", "originalPrice": "세일 중", "discount": "핫딜"}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    timestamp BIGINT
);

-- RLS 설정 (마이그레이션용으로 임시로 INSERT 권한 추가)
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON public.posts FOR SELECT USING (true);
CREATE POLICY "Allow anon insert" ON public.posts FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon update" ON public.posts FOR UPDATE USING (true);
