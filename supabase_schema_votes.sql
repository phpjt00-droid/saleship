-- votes 테이블 생성 SQL

CREATE TABLE IF NOT EXISTS public.votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL,
    user_id UUID NOT NULL REFERENCES auth.users(id),
    vote_type TEXT CHECK (vote_type IN ('up', 'down')) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- 한 사용자가 한 게시물에 한 번만 투표 가능하도록 유니크 제약 조건 추가
    UNIQUE(post_id, user_id)
);

-- RLS 설정
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;

-- 1. 모든 사용자가 투표 결과 확인 가능
CREATE POLICY "Allow public read votes" ON public.votes
    FOR SELECT USING (true);

-- 2. 인증된 사용자만 투표 가능
CREATE POLICY "Allow authenticated users to vote" ON public.votes
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 3. 본인의 투표만 수정 가능
CREATE POLICY "Allow users to update own vote" ON public.votes
    FOR UPDATE USING (auth.uid() = user_id);

-- 4. 본인의 투표만 삭제 가능
CREATE POLICY "Allow users to delete own vote" ON public.votes
    FOR DELETE USING (auth.uid() = user_id);

-- 성능 최적화를 위한 인덱스
CREATE INDEX IF NOT EXISTS votes_post_id_idx ON public.votes (post_id);
