/**
 * 세일쉽 통합 핫딜 타입 정의
 */
export interface Deal {
  id: number;
  title: string;
  image: string;
  url: string;
  price: string;
  originalPrice?: string;
  discount?: string;
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
}
