'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Mail, Lock, User, Github, Eye, EyeOff, ArrowRight } from 'lucide-react'
import './Login.css'

function Login() {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="login-page">
      {/* 배경 장식 */}
      <div className="login-page__bg">
        <div className="login-page__orb login-page__orb--1" />
        <div className="login-page__orb login-page__orb--2" />
        <div className="login-page__grid" />
      </div>

      <div className="container login-page__container">
        <div className="login-card animate-fadeInUp">
          {/* 로고 영역 */}
          <div className="login-card__header">
            <Link href="/" className="login-card__logo" style={{ color: 'var(--accent-primary)' }}>
              핫딜KR
            </Link>
            <p className="login-card__desc">
              대한민국 모든 최저가 정보를 한눈에
            </p>
          </div>

          {/* 탭 전환 */}
          <div className="login-card__tabs">
            <button 
              className={`login-card__tab ${isLogin ? 'login-card__tab--active' : ''}`}
              onClick={() => setIsLogin(true)}
            >
              로그인
            </button>
            <button 
              className={`login-card__tab ${!isLogin ? 'login-card__tab--active' : ''}`}
              onClick={() => setIsLogin(false)}
            >
              회원가입
            </button>
          </div>

          <form className="login-form">
            {!isLogin && (
              <div className="login-form__group">
                <label className="login-form__label">이름</label>
                <div className="login-form__input-wrap">
                  <User size={18} className="login-form__icon" />
                  <input type="text" placeholder="홍길동" className="login-form__input" />
                </div>
              </div>
            )}

            <div className="login-form__group">
              <label className="login-form__label">이메일</label>
              <div className="login-form__input-wrap">
                <Mail size={18} className="login-form__icon" />
                <input type="email" placeholder="example@hotdealkr.com" className="login-form__input" />
              </div>
            </div>

            <div className="login-form__group">
              <label className="login-form__label">비밀번호</label>
              <div className="login-form__input-wrap">
                <Lock size={18} className="login-form__icon" />
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  className="login-form__input" 
                />
                <button 
                  type="button"
                  className="login-form__pwd-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {isLogin && (
              <div className="login-form__options">
                <label className="login-form__checkbox">
                  <input type="checkbox" />
                  <span>로그인 상태 유지</span>
                </label>
                <Link href="#" className="login-form__forgot">비밀번호 찾기</Link>
              </div>
            )}

            <button type="submit" className="login-form__submit btn-primary">
              <span>{isLogin ? '로그인' : '가입하기'}</span>
              <ArrowRight size={18} />
            </button>
          </form>

          {/* 소셜 로그인 */}
          <div className="login-social">
            <div className="login-social__divider">
              <span>또는 다음으로 {isLogin ? '로그인' : '가입'}</span>
            </div>
            
            <div className="login-social__buttons">
              <button className="login-social__btn login-social__btn--naver">
                <span className="login-social__icon-text">N</span>
                네이버
              </button>
              <button className="login-social__btn login-social__btn--kakao">
                <span className="login-social__icon-text" style={{ color: '#000' }}>K</span>
                <span style={{ color: '#000' }}>카카오</span>
              </button>
              <button className="login-social__btn login-social__btn--google">
                <span className="login-social__icon-text">G</span>
                구글
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
