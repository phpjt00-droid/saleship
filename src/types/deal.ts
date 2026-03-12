export interface Deal {
  id: number;
  title: string;
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
}

export type DealViewMode = 'grid' | 'list';
