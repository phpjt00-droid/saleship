'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'
// UserEdit 대신 UserPen 아이콘으로 변경하였습니다.
import { Anchor, ArrowRight, RefreshCw, UserPen } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from 'sonner'

export default function Login() {
    const [loading, setLoading] = useState(false)
    const [session, setSession] = useState<any>(null)
    const [showNicknameSetup, setShowNicknameSetup] = useState(false)
    const [nickname, setNickname] = useState('')
    const [isEditing, setIsEditing] = useState(false)
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [showWelcomeModal, setShowWelcomeModal] = useState(false)

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            checkUserProfile(session)
        })

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            checkUserProfile(session)
        })

        return () => subscription.unsubscribe()
    }, [])

    const checkUserProfile = async (session: any) => {
        if (!session) {
            setSession(null)
            setShowNicknameSetup(false)
            return
        }

        setSession(session)
        const user = session.user

        setLoading(true)
        try {
            const { data: profile } = await supabase
                .from('profiles')
                .select('nickname')
                .eq('id', user.id)
                .maybeSingle()

            if (!profile?.nickname) {
                const [randomNick] = await Promise.all([
                    generateUniqueNickname(),
                    normalizeSnsData(user)
                ])

                setNickname(randomNick)
                setShowNicknameSetup(true)
            } else {
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

    const generateUniqueNickname = async () => {
        const { authService } = await import('@/lib/auth')
        return await authService.generateUniqueNickname()
    }

    const normalizeSnsData = async (user: any) => {
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

    const handleUpdateNickname = async (e: React.FormEvent) => {
        e.preventDefault()
        const trimmedNick = nickname.trim()
        if (!trimmedNick) return

        setLoading(true)
        try {
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
                if (profileRes.error.code === '23505') throw new Error('이미 사용 중인 닉네임입니다.')
                throw profileRes.error
            }

            setShowWelcomeModal(true)
            toast.success('프로필 설정이 완료되었습니다!')
        } catch (err: any) {
            toast.error(`오류가 발생했습니다: ${err.message}`)
        } finally {
            setLoading(false)
        }
    }

    const handleSocialLogin = async (provider: 'google' | 'naver' | 'kakao') => {
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
        } catch (err: any) {
            toast.error(`로그인 중 오류가 발생했습니다: ${err.message}`)
            setLoading(false)
        }
    }

    const handleReshuffle = async () => {
        setIsRefreshing(true)
        const newNick = await generateUniqueNickname()
        setNickname(newNick)
        setTimeout(() => setIsRefreshing(false), 600)
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
            {/* 로그인 카드 생략 (기존과 동일) */}
            {/* ... (이전과 동일한 UI 로직) */}
        </div>
    )
}