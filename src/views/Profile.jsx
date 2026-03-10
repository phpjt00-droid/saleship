'use client'
import Link from 'next/link'
import { MapPin, Briefcase, Calendar, Star, Award, MessageSquare, Heart, Settings, Target, Users } from 'lucide-react'
import './Profile.css'

const userData = {
  name: '홍길동',
  role: 'B2B Sales Manager',
  company: 'Tech Solutions Inc.',
  location: '대한민국, 서울',
  joinedDate: '2025.11',
  bio: 'IT 소프트웨어 B2B 영업 5년차입니다. 가치 기반의 세일즈를 추구하며, 새로운 세일즈 방법론에 관심이 많습니다.',
  stats: {
    posts: 24,
    comments: 156,
    likes: 892,
    followers: 128
  },
  skills: ['B2B 세일즈', 'SaaS 영업', '콜드콜링', '프레젠테이션', '협상'],
  achievements: [
    { id: 1, name: '첫 게시글', icon: '🌱', level: 'Bronze', date: '2025.11.15' },
    { id: 2, name: '베스트 게시글', icon: '🔥', level: 'Gold', date: '2026.01.20' },
    { id: 3, name: '소통왕', icon: '💬', level: 'Silver', date: '2026.02.10' },
  ],
  recentPosts: [
    { id: 1, title: 'B2B SaaS 도입 결정권자를 설득하는 3가지 핵심 질문', date: '2026.03.05', likes: 45, comments: 12 },
    { id: 2, title: '올해 1분기 영업 목표 달성 후기 및 레슨런', date: '2026.02.28', likes: 124, comments: 34 },
    { id: 3, title: '영업 슬럼프를 극복했던 저만의 루틴 공유합니다', date: '2026.02.15', likes: 89, comments: 21 },
  ]
}

function Profile() {
  return (
    <div className="profile-page">
      {/* 프로필 헤더 배너 */}
      <div className="profile-banner" />

      <div className="container">
        <div className="profile-layout animate-fadeInUp">
          {/* 좌측 사이드바: 프로필 정보 */}
          <aside className="profile-sidebar">
            <div className="profile-card">
              <div className="profile-card__avatar-wrap">
                <div className="profile-card__avatar">👨‍💼</div>
                <div className="profile-card__level-badge">Lv.14</div>
              </div>
              
              <h1 className="profile-card__name">{userData.name}</h1>
              <p className="profile-card__bio">{userData.bio}</p>

              <div className="profile-card__info-list">
                <div className="profile-card__info-item">
                  <Briefcase size={16} />
                  <span>{userData.role} @ {userData.company}</span>
                </div>
                <div className="profile-card__info-item">
                  <MapPin size={16} />
                  <span>{userData.location}</span>
                </div>
                <div className="profile-card__info-item">
                  <Calendar size={16} />
                  <span>가입일: {userData.joinedDate}</span>
                </div>
              </div>

              <div className="profile-card__skills">
                {userData.skills.map(skill => (
                  <span key={skill} className="profile-card__skill">{skill}</span>
                ))}
              </div>

              <div className="profile-card__actions">
                <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                  프로필 수정
                </button>
                <button className="btn-secondary" style={{ width: '100%', justifyContent: 'center', marginTop: '10px' }}>
                  <Settings size={16} /> 설정
                </button>
              </div>
            </div>
          </aside>

          {/* 우측 메인 컨텐츠 영역 */}
          <main className="profile-content">
            {/* 통계 카드 */}
            <div className="profile-stats">
              <div className="profile-stat-box">
                <MessageSquare className="profile-stat-icon" size={24} style={{ color: 'var(--primary)' }} />
                <span className="profile-stat-value">{userData.stats.posts}</span>
                <span className="profile-stat-label">작성글</span>
              </div>
              <div className="profile-stat-box">
                <MessageSquare className="profile-stat-icon" size={24} style={{ color: 'var(--accent-1)' }} />
                <span className="profile-stat-value">{userData.stats.comments}</span>
                <span className="profile-stat-label">댓글</span>
              </div>
              <div className="profile-stat-box">
                <Heart className="profile-stat-icon" size={24} style={{ color: 'var(--accent-2)' }} />
                <span className="profile-stat-value">{userData.stats.likes}</span>
                <span className="profile-stat-label">받은 좋아요</span>
              </div>
              <div className="profile-stat-box">
                <Users className="profile-stat-icon" size={24} style={{ color: '#ffa726' }} />
                <span className="profile-stat-value">{userData.stats.followers}</span>
                <span className="profile-stat-label">팔로워</span>
              </div>
            </div>

            {/* 업적 (배지) */}
            <section className="profile-section">
              <h2 className="profile-section__title">
                <Target size={20} className="profile-section__icon" />
                획득한 업적
              </h2>
              <div className="profile-achievements">
                {userData.achievements.map(achievement => (
                  <div key={achievement.id} className="achievement-card">
                    <div className="achievement-card__icon">{achievement.icon}</div>
                    <div className="achievement-card__info">
                      <h4 className="achievement-card__name">{achievement.name}</h4>
                      <span className={`achievement-card__level achievement-card__level--${achievement.level.toLowerCase()}`}>
                        {achievement.level}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 최근 작성 글 */}
            <section className="profile-section">
              <h2 className="profile-section__title">
                <Star size={20} className="profile-section__icon" />
                최근 작성한 글
              </h2>
              <div className="profile-posts">
                {userData.recentPosts.map(post => (
                  <Link key={post.id} href={`/post/${post.id}`} className="profile-post-card">
                    <h3 className="profile-post-card__title">{post.title}</h3>
                    <div className="profile-post-card__meta">
                      <span className="profile-post-card__date">{post.date}</span>
                      <div className="profile-post-card__stats">
                        <span><Heart size={14} /> {post.likes}</span>
                        <span><MessageSquare size={14} /> {post.comments}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  )
}

export default Profile
