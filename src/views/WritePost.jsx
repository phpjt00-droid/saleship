'use client'
import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Type, AlignLeft, Tag, Image, Send, Eye } from 'lucide-react'
import './WritePost.css'

const categories = ['자유', 'Q&A', '팁 & 노하우', '트렌드']

function WritePost() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('')
  const [preview, setPreview] = useState(false)

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
              placeholder="게시글 제목을 입력하세요"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
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
