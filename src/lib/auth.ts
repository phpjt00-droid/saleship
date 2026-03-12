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
    // signOut 완료 후 쿠키 동기화를 위해 리로딩 유도 가능
    if (typeof window !== 'undefined') {
      window.location.href = '/'
    }
  },

  async updateProfile(userId: string, profile: any) {
    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        ...profile,
        updated_at: new Date().toISOString()
      })
    if (error) throw error
  }
}
