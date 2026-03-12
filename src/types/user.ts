export interface UserProfile {
  id: string;
  nickname: string;
  full_name?: string;
  email?: string;
  avatar_url?: string;
  provider?: string;
  gender?: string;
  age_range?: string;
  updated_at?: string;
}

export interface UserSession {
  user: UserProfile | null;
  expires_at?: number;
}
