'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'
import { Anchor, ArrowRight, RefreshCw, UserEdit } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from 'sonner'

export default function Login() {
    const [loading, setLoading] = useState(false)
    const [session, setSession] = useState(null)
    const [showNicknameSetup, setShowNicknameSetup] = useState(false)
    const [nickname, setNickname] = useState('')
    const [isEditing, setIsEditing] = useState(false)
    const [isRefreshing, setIsRefreshing] = useState(false)

    const [showWelcomeModal, setShowWelcomeModal] = useState(false)

    // 1. 초기 세션 확인 및 리스너
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            checkUserProfile(session)
        })

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            checkUserProfile(session)
        })

        return () => subscription.unsubscribe()
    }, [])

    // 2. 관리 데이터 정규화 및 프로필 체크
    const checkUserProfile = async (session) => {
        if (!session) {
            setSession(null)
            setShowNicknameSetup(false)
            return
        }

        setSession(session)
        const user = session.user

        setLoading(true)
        try {
            // 1. profiles 테이블에서 닉네임이 있는지 확인
            const { data: profile, error } = await supabase
                .from('profiles')
                .select('nickname')
                .eq('id', user.id)
                .maybeSingle()

            // 2. 프로필이 없거나 닉네임이 없으면 설정창 표시
            if (!profile?.nickname) {
                // 백그라운드에서 즉시 데이터 정규화(성별, 연령대) 및 닉네임 생성 시작
                const [randomNick] = await Promise.all([
                    generateUniqueNickname(),
                    normalizeSnsData(user)
                ])

                setNickname(randomNick)
                setShowNicknameSetup(true)
            } else {
                // 이미 닉네임이 있으면 메인으로 이동
                if (window.location.pathname === '/login') {
                    window.location.href = '/'
                }
            }
        } catch (err) {
            console.error('Profile check error:', err)
        } finally {
            setLoading(false)
        }
    }

    // 3. 확장된 펭귄 닉네임 생성기
    const generateUniqueNickname = async () => {
        const { authService } = await import('@/lib/auth')
        return await authService.generateUniqueNickname()
    }

    // 4. SNS 데이터 정규화 함수 (성별, 연령대 수집)
    const normalizeSnsData = async (user) => {
        if (user.user_metadata?.is_normalized) return

        const provider = user.app_metadata?.provider || user.identities?.[0]?.provider
        const meta = user.user_metadata || {}
        const identityData = user.identities?.[0]?.identity_data || {}

        let gender = 'unknown'
        let ageRange = 'unknown'

        if (provider === 'naver') {
            const rawGender = identityData.gender || meta.gender
            gender = rawGender === 'M' ? 'male' : rawGender === 'F' ? 'female' : 'other'
            const rawAge = identityData.age || meta.age
            if (rawAge) ageRange = `${rawAge.split('-')[0]}s`
        }
        else if (provider === 'kakao') {
            const rawGender = identityData.gender || meta.gender
            gender = rawGender === 'male' ? 'male' : rawGender === 'female' ? 'female' : 'other'
            const rawAgeRange = identityData.age_range || meta.age_range
            if (rawAgeRange) ageRange = `${rawAgeRange.split('~')[0]}s`
        }
        else {
            gender = meta.gender || 'unknown'
            ageRange = meta.age_range || 'unknown'
        }

        await supabase.auth.updateUser({
            data: { gender, age_range: ageRange, is_normalized: true, source_provider: provider }
        })
    }

    // 5. 최종 프로필 저장 (통합 시퀀스의 마지막 관문)
    const handleUpdateNickname = async (e) => {
        if (e) e.preventDefault()
        const trimmedNick = nickname.trim()
        if (!trimmedNick) return

        setLoading(true)
        try {
            // 1. Auth Metadata & Profiles 동시 업데이트 시도
            const [authRes, profileRes] = await Promise.all([
                supabase.auth.updateUser({
                    data: {
                        nickname: trimmedNick,
                        full_name: session.user.user_metadata?.full_name || trimmedNick,
                        provider: 'google'
                    }
                }),
                supabase.from('profiles').upsert({
                    id: session.user.id,
                    nickname: trimmedNick,
                    full_name: session.user.user_metadata?.full_name || trimmedNick,
                    email: session.user.email,
                    provider: 'google',
                    updated_at: new Date().toISOString()
                })
            ])

            if (authRes.error) throw authRes.error
            if (profileRes.error) {
                if (profileRes.error.code === '23505') throw new Error('이미 사용 중인 닉네임입니다. 다른 닉네임을 시도해 주세요!')
                throw profileRes.error
            }

            // 최종 단계: 성공 축하 모달 노출
            setShowWelcomeModal(true)
            toast.success('프로필 설정이 완료되었습니다!')
        } catch (err) {
            toast.error(`오류가 발생했습니다: ${err.message}`)
        } finally {
            setLoading(false)
        }
    }

    const handleSocialLogin = async (provider) => {
        if (provider === 'naver' || provider === 'kakao') {
            toast.info(`${provider === 'naver' ? '네이버' : '카카오'} 로그인은 현재 준비 중입니다.`)
            return
        }

        setLoading(true)
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider,
                options: { redirectTo: window.location.origin + '/login' }
            })
            if (error) throw error
        } catch (err) {
            toast.error(`로그인 중 오류가 발생했습니다: ${err.message}`)
            setLoading(false)
        }
    }

    // 6. 닉네임 재추첨 핸들러
    const handleReshuffle = async () => {
        setIsRefreshing(true)
        const newNick = await generateUniqueNickname()
        setNickname(newNick)
        setTimeout(() => setIsRefreshing(false), 600)
    }

    const handleFinalConfirm = () => {
        window.location.href = '/'
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 md:p-8">
            {/* Welcome Modal */}
            {showWelcomeModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
                    <Card className="w-full max-w-sm border-none shadow-2xl bg-white rounded-[2.5rem] p-8 text-center animate-in zoom-in slide-in-from-bottom-8 duration-500">
                        <div className="inline-block p-5 bg-blue-50 rounded-full mb-6">
                            <span className="text-5xl">🎉</span>
                        </div>
                        <CardHeader className="p-0 mb-6">
                            <CardTitle className="text-2xl font-black text-slate-800">축하합니다!</CardTitle>
                            <CardDescription className="text-lg font-bold text-blue-600 mt-2">
                                환영합니다!<br />
                                당신은 <span className="underline decoration-blue-200 underline-offset-4">@{nickname}</span> 이네요!
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <p className="text-slate-500 font-medium mb-8 leading-relaxed">
                                이제 Saleship에서 양질의 핫딜을<br />
                                마음껏 즐겨보세요 🐧
                            </p>
                            <Button
                                onClick={handleFinalConfirm}
                                className="w-full h-14 bg-slate-900 hover:bg-blue-600 text-white text-lg font-bold rounded-2xl shadow-lg transition-all active:scale-95"
                            >
                                확인
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Background Orbs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100/50 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-sky-100/50 rounded-full blur-[120px]" />
            </div>

            <Card className="w-full max-w-md border-none shadow-2xl bg-white/90 backdrop-blur-md rounded-[2.5rem] p-4 md:p-8 animate-in fade-in zoom-in duration-700 relative z-10 transition-all">
                <CardHeader className="space-y-4 text-center pb-8">
                    <div className="flex justify-center">
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="p-3 bg-blue-600 rounded-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg shadow-blue-200">
                                <Anchor className="text-white" size={28} />
                            </div>
                        </Link>
                    </div>
                    <div className="space-y-2">
                        <CardTitle className="text-3xl font-bold tracking-tight text-slate-900">Saleship</CardTitle>
                        <CardDescription className="text-slate-500 text-base font-medium">
                            간편하게 로그인하고 세상을 연결하세요
                        </CardDescription>
                    </div>
                </CardHeader>

                <CardContent className="space-y-4 px-2 md:px-0">
                    {!showNicknameSetup ? (
                        <>
                            {/* Google Login Button */}
                            <button
                                type="button"
                                onClick={() => handleSocialLogin('google')}
                                disabled={loading}
                                className="w-full flex items-center justify-between px-8 h-18 bg-white border-2 border-slate-100 hover:border-blue-500 text-slate-700 rounded-[1.25rem] shadow-xl shadow-slate-100 transition-all hover:-translate-y-1 active:scale-95 group disabled:opacity-50"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                                        <svg width="24" height="24" viewBox="0 0 24 24">
                                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                        </svg>
                                    </div>
                                    <span className="font-bold text-lg text-slate-700 ml-2">Google 계정으로 시작</span>
                                </div>
                                <ArrowRight size={20} className="text-slate-300 opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0 duration-300" />
                            </button>

                            {/* Naver Login (준비 중 안내) */}
                            <button
                                type="button"
                                onClick={() => handleSocialLogin('naver')}
                                disabled={loading}
                                className="group relative w-full h-18 bg-[#03C75A] hover:bg-[#02b350] text-white rounded-[1.25rem] shadow-xl shadow-green-100 transition-all hover:-translate-y-1 active:scale-95 flex items-center px-8 disabled:opacity-50 overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <span className="text-2xl font-black mr-4">N</span>
                                <span className="flex-1 text-lg font-bold text-left ml-2">네이버로 시작하기</span>
                                <div className="px-3 py-1 bg-white/20 rounded-lg text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm">Coming Soon</div>
                            </button>

                            {/* Kakao Login Button (준비 중 안내) */}
                            <button
                                type="button"
                                onClick={() => handleSocialLogin('kakao')}
                                disabled={loading}
                                className="group relative w-full h-18 bg-[#FEE500] hover:bg-[#eb2] text-[#3c1e1e] rounded-[1.25rem] shadow-xl shadow-yellow-100 transition-all hover:-translate-y-1 active:scale-95 flex items-center px-8 disabled:opacity-50 overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <span className="text-2xl font-black mr-4">K</span>
                                <span className="flex-1 text-lg font-bold text-left ml-2">카카오로 시작하기</span>
                                <div className="px-3 py-1 bg-black/5 rounded-lg text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm">Coming Soon</div>
                            </button>
                        </>
                    ) : (
                        <form onSubmit={handleUpdateNickname} className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
                            <div className="space-y-3 text-center">
                                <div className="inline-block p-4 bg-blue-50 rounded-3xl mb-2">
                                    <span className="text-4xl">🐧</span>
                                </div>
                                <h3 className="text-2xl font-black text-slate-800 tracking-tight">반가워요!</h3>
                                <p className="text-slate-500 font-medium leading-relaxed">
                                    당신은 <span className="text-blue-600 font-bold px-1.5 py-0.5 bg-blue-50 rounded-lg">@{nickname}</span> 펭귄이네요!
                                </p>
                            </div>

                            <div className="space-y-4">
                                {isEditing ? (
                                    <div className="relative group">
                                        <input
                                            type="text"
                                            placeholder="원하는 닉네임을 입력하세요"
                                            className="w-full h-16 px-6 bg-slate-50 border-2 border-slate-100 rounded-[1.25rem] focus:border-blue-500 focus:ring-8 focus:ring-blue-100 outline-none transition-all text-lg font-bold text-slate-700"
                                            value={nickname}
                                            onChange={(e) => setNickname(e.target.value)}
                                            autoFocus
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setIsEditing(false)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-blue-600 px-3 py-1.5 hover:bg-white rounded-xl transition-colors"
                                        >
                                            확인
                                        </button>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            type="button"
                                            onClick={handleReshuffle}
                                            disabled={isRefreshing || loading}
                                            className="flex items-center justify-center gap-2 h-14 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold rounded-2xl transition-all active:scale-95 disabled:opacity-50"
                                        >
                                            <RefreshCw size={18} className={isRefreshing ? 'animate-spin' : ''} />
                                            재추첨
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setIsEditing(true)}
                                            className="flex items-center justify-center gap-2 h-14 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold rounded-2xl transition-all active:scale-95"
                                        >
                                            수정하기
                                        </button>
                                    </div>
                                )}

                                <Button
                                    type="submit"
                                    disabled={loading || isEditing}
                                    className="w-full h-16 bg-slate-900 hover:bg-blue-600 text-white text-lg font-black rounded-2xl shadow-xl shadow-slate-200 transition-all hover:-translate-y-1 active:scale-95 disabled:opacity-50"
                                >
                                    {loading ? '준비 중...' : '이대로 시작하기'}
                                </Button>
                            </div>

                            <p className="text-center text-xs text-slate-400 font-medium">
                                * 닉네임은 마이페이지에서 1회 변경 가능합니다.
                            </p>
                        </form>
                    )}
                </CardContent>

                <div className="pt-8 text-center">
                    <p className="text-xs text-slate-400">
                        로그인 시 Saleship의 <Link href="/terms" className="underline hover:text-slate-600 transition-colors">이용약관</Link> 및 <Link href="/privacy" className="underline hover:text-slate-600 transition-colors">개인정보처리방침</Link>에 동의하게 됩니다.
                    </p>
                </div>
            </Card>
        </div>
    )
}
