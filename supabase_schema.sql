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

-- RLS 설정: 보안 정책 (Security Policies)
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- 1. 모두가 게시글을 조회할 수 있음
CREATE POLICY "Enable read access for all users" ON public.posts
    FOR SELECT USING (true);

-- 2. 로그인한 사용자만 글 작성 가능
CREATE POLICY "Enable insert for authenticated users only" ON public.posts
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 3. 글 작성자 본인만 수정 가능
CREATE POLICY "Enable update for users based on authorId" ON public.posts
    FOR UPDATE USING (auth.uid()::text = authorId) WITH CHECK (auth.uid()::text = authorId);

-- 4. 글 작성자 본인만 삭제 가능
CREATE POLICY "Enable delete for users based on authorId" ON public.posts
    FOR DELETE USING (auth.uid()::text = authorId);

-- comments 테이블 참조가 있다면 동일하게 적용되어야 하나, 우선 posts를 강화합니다.

