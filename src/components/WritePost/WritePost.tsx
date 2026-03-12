'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Type, AlignLeft, Tag, Image, Send, Eye, ShoppingCart } from 'lucide-react'
import { extractDealInfo } from '@/features/deals/dealUtils'
import './WritePost.css'

const categories = ['핫딜', '자유', 'Q&A', '팁 & 노하우', '트렌드']

function WritePost() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('핫딜')
  const [preview, setPreview] = useState(false)
  
  const [extractedDeal, setExtractedDeal] = useState(null)

  useEffect(() => {
    if (category === '핫딜' && title.length > 5) {
      const deal = extractDealInfo(title)
      if (deal.price > 0 || deal.store !== '기타') {
        setExtractedDeal(deal)
      } else {
        setExtractedDeal(null)
      }
    } else {
      setExtractedDeal(null)
    }
  }, [title, category])

  return (
    <div className="write-post">
      <div className="container">
        <div className="write-post__header animate-fadeInUp">
          <Link href="/board" className="write-post__back">
            <ArrowLeft size={18} />
            돌아가기
          </Link>
          <h1 className="write-post__title">새 글 작성</h1>
        </div>

        <div className="write-post__form animate-fadeInUp delay-1">
          {/* 카테고리 선택 */}
          <div className="write-post__field">
            <label className="write-post__label">
              <Tag size={16} />
              카테고리
            </label>
            <div className="write-post__categories">
              {categories.map(cat => (
                <button
                  key={cat}
                  className={`write-post__cat-btn ${category === cat ? 'write-post__cat-btn--active' : ''}`}
                  onClick={() => setCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* 제목 입력 */}
          <div className="write-post__field">
            <label className="write-post__label">
              <Type size={16} />
              제목
            </label>
            <input
              type="text"
              className="write-post__input"
              placeholder={category === '핫딜' ? '[쇼핑몰] 상품명 가격 (예: [쿠팡] 990 PRO 2TB 79,000원)' : '게시글 제목을 입력하세요'}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            
            {extractedDeal && category === '핫딜' && (
              <div className="mt-3 p-4 bg-blue-50/50 border border-blue-100 rounded-2xl flex flex-wrap gap-4 items-center animate-fadeInUp">
                <div className="flex items-center gap-2 text-blue-700 text-sm font-bold">
                  <ShoppingCart size={16} />
                  <span>자동 추출 정보</span>
                </div>
                <div className="flex flex-wrap gap-2 text-sm">
                  <span className="px-2 py-1 bg-white rounded-lg border border-slate-200 text-slate-600 font-medium">쇼핑몰: {extractedDeal.store}</span>
                  <span className="px-2 py-1 bg-white rounded-lg border border-slate-200 text-slate-800 font-bold max-w-[200px] truncate" title={extractedDeal.name}>상품: {extractedDeal.name}</span>
                  <span className="px-2 py-1 bg-rose-50 rounded-lg border border-rose-100 text-rose-600 font-bold">가격: {extractedDeal.price > 0 ? extractedDeal.price.toLocaleString() + '원' : '미정'}</span>
                </div>
              </div>
            )}
          </div>

          {/* 내용 입력 */}
          <div className="write-post__field">
            <div className="write-post__label-row">
              <label className="write-post__label">
                <AlignLeft size={16} />
                내용
              </label>
              <button
                className={`write-post__preview-toggle ${preview ? 'write-post__preview-toggle--active' : ''}`}
                onClick={() => setPreview(!preview)}
              >
                <Eye size={14} />
                미리보기
              </button>
            </div>

            {preview ? (
              <div className="write-post__preview-content">
                {content ? (
                  <div dangerouslySetInnerHTML={{
                    __html: content
                      .replace(/\n/g, '<br />')
                      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                  }} />
                ) : (
                  <p className="write-post__preview-empty">미리볼 내용이 없습니다</p>
                )}
              </div>
            ) : (
               <textarea
                className="write-post__textarea"
                placeholder="내용을 입력하세요. 마크다운 문법을 지원합니다."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={15}
              />
            )}
          </div>

          {/* 이미지 첨부 */}
          <div className="write-post__field">
            <label className="write-post__label">
              <Image size={16} />
              이미지 첨부
            </label>
            <div className="write-post__dropzone">
              <Image size={32} />
              <p>이미지를 드래그하거나 클릭하여 업로드</p>
              <span>PNG, JPG, GIF (최대 10MB)</span>
            </div>
          </div>

          {/* 액션 버튼 */}
          <div className="write-post__actions">
            <Link href="/board" className="btn-secondary">취소</Link>
            <button className="btn-primary">
              <Send size={16} />
              <span>게시하기</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WritePost
