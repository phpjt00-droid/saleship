-- profiles 테이블 생성 SQL
-- Supabase SQL Editor에 복사하여 실행해 주세요.

CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    nickname TEXT UNIQUE,
    email TEXT,
    full_name TEXT,
    avatar_url TEXT,
    provider TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS 설정
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 1. 자신의 프로필은 누구나 조회 가능 (또는 특정 검색 기능 위해 공개)
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
    FOR SELECT USING (true);

-- 2. 자신의 프로필만 생성 가능
CREATE POLICY "Users can insert their own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- 3. 자신의 프로필만 수정 가능
CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- 트리거 설정: auth.users에 새 사용자가 생성될 때 자동으로 profiles 테이블에 레코드 삽입 (선택 사항)
-- 여기서는 애플리케이션 레벨(Login.jsx)에서 처리하므로 필수 아님
