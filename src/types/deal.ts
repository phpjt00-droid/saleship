export interface Deal {
  id: string | number;
  title: string;
  subtitle?: string;
  image: string;
  url: string;
  price: string | number;
  originalPrice?: string | number;
  discount?: string | number;
  store: string;
  shipping: string;
  likes: number;
  comments: number;
  views: number;
  createdAt: string;
  authorId: string;
  category?: string;
  content?: string;
  author?: string;
  avatar?: string;
  isHot?: boolean;
  
  // 확장 필드
  brand_name?: string;
  deal_link?: string;
  promo_code?: string;
  end_date?: string;
  upvote_count?: number;
  summary?: string;
  thumbnail?: string;
  price_info?: {
    currentPrice: string | number;
    originalPrice?: string | number;
    discount?: string | number;
    discountRate?: string | number;
  };
}

export interface DealComment {
  id: string;
  post_id: string;
  user_id: string;
  user_name: string;
  user_avatar?: string;
  content: string;
  likes: number;
  created_at: string;
  author_email?: string;
}

export type DealViewMode = 'grid' | 'list';
