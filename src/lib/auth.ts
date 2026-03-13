import { supabase } from './supabaseClient'

export const authService = {
  // 클라이언트 사이드 세션 확인 (브라우저용)
  async getSession() {
    const { data: { session }, error } = await supabase.auth.getSession()
    if (error) throw error
    return session
  },

  async signInWithGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/login` : undefined
      }
    })
    if (error) throw error
  },

  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    if (typeof window !== 'undefined') {
      window.location.href = '/'
    }
  },

  async generateUniqueNickname() {
    const modifiers = ['매우', '가장', '어느', '지치지않는', '얼음위의', '잠들지않는', '반짝이는', '자유로운', '기다려온', '신비로운']
    const adjectives = ['똑똑한', '귀여운', '멋진', '빠른', '용감한', '수줍은', '다정한', '활기찬']
    const penguins = ['황제펭귄', '아델리펭귄', '젠투펭귄', '턱끈펭귄', '마카로니펭귄', '꼬마펭귄', '바위뛰기펭귄']

    const pick = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)]
    
    let isUnique = false
    let finalNick = ''
    let attempts = 0

    while (!isUnique && attempts < 5) {
      let baseNick = `${pick(modifiers)}${pick(adjectives)}${pick(penguins)}`
      if (attempts > 0) baseNick += Math.floor(Math.random() * 9000) + 1000

      const { data } = await supabase
        .from('profiles')
        .select('nickname')
        .eq('nickname', baseNick)
        .maybeSingle()

      if (!data) {
        finalNick = baseNick
        isUnique = true
      }
      attempts++
    }

    return finalNick || `길잃은꼬마펭귄${Math.floor(Math.random() * 9000) + 1000}`
  },

  async updateProfile(userId: string, profile: any) {
    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        ...profile,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'id'
      })
    if (error) throw error
  }
}
