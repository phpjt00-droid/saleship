'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { MapPin, Briefcase, Calendar, Star, Award, MessageSquare, Heart, Settings, Target, Users, RefreshCw, LogOut } from 'lucide-react'
import './Profile.css'

function Profile() {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [changeLoading, setChangeLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login')
        return
      }

      setUser(session.user)

      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()

      if (error) throw error
      setProfile(profileData)
    } catch (err) {
      console.error('Error fetching profile:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleReshuffle = async () => {
    const changeCount = user.user_metadata?.nickname_change_count || 0
    if (changeCount >= 1) {
      alert('닉네임은 마이페이지에서 1회만 변경 가능합니다.')
      return
    }

    if (!confirm('새로운 펭귄 닉네임으로 재추첨하시겠습니까? (1회만 가능)')) return

    setChangeLoading(true)
    try {
      // 1. 닉네임 생성
      const modifiers = ['매우', '가장', '어느', '지치지않는', '얼음위의', '잠들지않는', '반짝이는', '자유로운', '기다려온', '신비로운']
      const adjectives = ['똑똑한', '귀여운', '멋진', '빠른', '용감한', '수줍은', '다정한', '활기찬']
      const penguins = ['황제펭귄', '아델리펭귄', '젠투펭귄', '턱끈펭귄', '마카로니펭귄', '꼬마펭귄', '바위뛰기펭귄']
      const pick = (arr) => arr[Math.floor(Math.random() * arr.length)]
      
      let newNick = `${pick(modifiers)}${pick(adjectives)}${pick(penguins)}`
      
      // 중복 체크
      const { data: existing } = await supabase
        .from('profiles')
        .select('nickname')
        .eq('nickname', newNick)
        .maybeSingle()

      if (existing) {
        newNick += Math.floor(Math.random() * 9000) + 1000
      }

      // 2. Metadata 업데이트 (변경 횟수 기록)
      const { error: authError } = await supabase.auth.updateUser({
        data: { 
          nickname: newNick,
          nickname_change_count: changeCount + 1 
        }
      })
      if (authError) throw authError

      // 3. Profiles 테이블 업데이트
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ 
          nickname: newNick,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

      if (profileError) throw profileError

      alert(`닉네임이 [${newNick}]으로 변경되었습니다!`)
      window.location.reload()
    } catch (err) {
      alert(`변경 실패: ${err.message}`)
    } finally {
      setChangeLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <RefreshCw className="animate-spin text-blue-600" size={32} />
      </div>
    )
  }

  const nicknameChangeDisabled = (user?.user_metadata?.nickname_change_count || 0) >= 1

  return (
    <div className="profile">
      <div className="profile__card-bg" />

      <div className="container">
        <div className="profile__layout animate-fadeInUp">
          <aside className="profile__sidebar">
            <div className="profile__card">
              <div className="profile__card-bg" />
              <div className="profile__card-content">
                <div className="profile__avatar overflow-hidden">
                  <img src="/images/mascot.png" alt="Mascot" className="w-full h-full object-cover" />
                </div>
                
                <h1 className="profile__name">@{profile?.nickname || '펭귄'}</h1>
                <div className="profile__role">스마트 큐레이터</div>
                <p className="profile__bio">
                  {profile?.bio || '반가워요! 세일쉽에서 양질의 핫딜 정보를 함께 나누는 펭귄입니다.'}
                </p>

                <div className="profile__join">
                  <Calendar size={14} />
                  <span>가입일: {new Date(profile?.created_at || Date.now()).toLocaleDateString()}</span>
                </div>

                <div className="profile__actions">
                  <button 
                    className={`btn-primary w-full flex items-center justify-center gap-2 ${nicknameChangeDisabled ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
                    onClick={handleReshuffle}
                    disabled={changeLoading || nicknameChangeDisabled}
                  >
                    <RefreshCw size={18} className={changeLoading ? 'animate-spin' : ''} />
                    {nicknameChangeDisabled ? '닉네임 변경 완료' : '닉네임 재추첨 (1회)'}
                  </button>
                  
                  <button onClick={handleLogout} className="btn-secondary w-full flex items-center justify-center gap-2 mt-2 text-rose-500 hover:bg-rose-50 border-rose-100">
                    <LogOut size={16} /> 로그아웃
                  </button>
                </div>
              </div>
            </div>
          </aside>

          <main className="profile__content">
            <div className="profile__stats-grid">
              <div className="profile__stat">
                <span className="profile__stat-value">0</span>
                <span className="profile__stat-label">작성글</span>
              </div>
              <div className="profile__stat">
                <span className="profile__stat-value">0</span>
                <span className="profile__stat-label">댓글</span>
              </div>
              <div className="profile__stat">
                <span className="profile__stat-value">0</span>
                <span className="profile__stat-label">좋아요</span>
              </div>
              <div className="profile__stat">
                <span className="profile__stat-value">0</span>
                <span className="profile__stat-label">팔로워</span>
              </div>
            </div>

            <section className="profile__section">
              <h2 className="profile__section-title">
                <Target size={20} />
                나의 펭귄 둥지
              </h2>
              <div className="bg-white rounded-3xl p-12 border-2 border-slate-50 shadow-sm text-center">
                <div className="text-6xl mb-6">🏠</div>
                <h3 className="text-2xl font-black text-slate-800 mb-2">아직 활동 내역이 없어요</h3>
                <p className="text-slate-500 text-lg">지금 바로 첫 핫딜 정보를 공유하여<br/>펭귄 둥지를 채워보세요!</p>
                <Link href="/board" className="btn-primary inline-flex mt-8 px-8 h-14 text-lg">핫딜 게시판 가기</Link>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  )
}

export default Profile
