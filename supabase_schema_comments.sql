-- comments 테이블 생성 SQL

CREATE TABLE IF NOT EXISTS public.comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL, -- 또는 BIGINT (기존 스키마에 따라 조정 필요)
    post_type TEXT DEFAULT 'deal', -- 'deal', 'community' 등 구분
    user_id UUID REFERENCES auth.users(id),
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS 설정
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- 1. 모든 사용자가 댓글을 읽을 수 있음
CREATE POLICY "Allow public read comments" ON public.comments
    FOR SELECT USING (true);

-- 2. 인증된 사용자만 댓글을 작성할 수 있음
CREATE POLICY "Allow authenticated users to insert comments" ON public.comments
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 3. 본인이 작성한 댓글만 수정 가능
CREATE POLICY "Allow users to update own comments" ON public.comments
    FOR UPDATE USING (auth.uid() = user_id);

-- 4. 본인이 작성한 댓글만 삭제 가능
CREATE POLICY "Allow users to delete own comments" ON public.comments
    FOR DELETE USING (auth.uid() = user_id);

-- 성능 최적화를 위한 인덱스
CREATE INDEX IF NOT EXISTS comments_post_id_idx ON public.comments (post_id);
