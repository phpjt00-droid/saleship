'use client'
import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { Search, Menu, X, User, Bell, Anchor, Laptop, Shirt, Utensils, Home as HomeIcon, Smartphone, Sun, Moon, Sparkles, Gamepad2, Ticket, MapPin } from 'lucide-react'
import { useTheme } from './ThemeProvider'
import './Navbar.css'

function NavbarContent() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { theme, toggleTheme } = useTheme()

  const sortParam = searchParams.get('sort') || ''
  const catParam = searchParams.get('cat') || ''

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname, searchParams])

  // 사용자가 요청한 정확히 9개 카테고리 구성
  const categories = [
    { name: '전체핫딜', path: '/board', active: pathname === '/board' && !sortParam && !catParam },
    { name: '패션', path: '/board?cat=fashion', active: catParam === 'fashion' },
    { name: '푸드', path: '/board?cat=food', active: catParam === 'food' },
    { name: '뷰티', path: '/board?cat=beauty', active: catParam === 'beauty' },
    { name: '리빙', path: '/board?cat=home', active: catParam === 'home' },
    { name: '가전', path: '/board?cat=electronics', active: catParam === 'electronics' },
    { name: '게임', path: '/board?cat=game', active: catParam === 'game' },
    { name: '상품권/이용권', path: '/board?cat=ticket', active: catParam === 'ticket' },
    { name: '오프라인', path: '/board?cat=offline', active: catParam === 'offline' },
  ]

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__top">
        <div className="container navbar__container">
          {/* Left: Logo */}
          <Link href="/" className="navbar__logo">
            <Anchor className="navbar__logo-icon" size={32} color="var(--accent-primary)" />
            <span className="navbar__logo-text">세일쉽</span>
          </Link>
          
          {/* Right: Search & Actions */}
          <div className="navbar__right">
            <div className="navbar__search-wrap">
              <Search size={18} className="navbar__search-icon" />
              <input 
                type="text" 
                placeholder="어떤 핫딜을 찾으시나요?" 
                className="navbar__search-input"
              />
            </div>

            <div className="navbar__actions">
              <Link href="/write" className="navbar__write-btn-hot">
                글쓰기
              </Link>
              
              <button 
                className="navbar__icon-btn" 
                onClick={toggleTheme}
                aria-label="테마 변경"
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              <Link href="/login" className="navbar__icon-btn">
                <User size={22} />
              </Link>

              <button 
                className="navbar__mobile-toggle"
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                {mobileOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 통합된 카테고리 탭 (단일 행) */}
      <div className="navbar__bottom">
        <div className="container">
          <div className="navbar__sub-links">
            {categories.map((cat, i) => (
              <Link
                key={i}
                href={cat.path}
                className={`navbar__sub-link ${cat.active ? 'active' : ''}`}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`navbar__mobile-menu ${mobileOpen ? 'navbar__mobile-menu--open' : ''}`}>
        <div className="navbar__mobile-search">
          <Search size={18} className="navbar__search-icon" />
          <input 
            type="text" 
            placeholder="핫딜 검색..." 
            className="navbar__search-input"
          />
        </div>
        <div className="navbar__mobile-links">
          {categories.map((cat, i) => (
            <Link key={i} href={cat.path} className={`navbar__mobile-link ${cat.active ? 'active' : ''}`}>
              {cat.name}
            </Link>
          ))}
          <div className="navbar__mobile-divider" />
          <button className="navbar__mobile-link" onClick={toggleTheme}>
            {theme === 'dark' ? '라이트 모드' : '다크 모드'}
          </button>
          <Link href="/login" className="navbar__mobile-link">프로필 / 로그인</Link>
        </div>
      </div>
      
      {mobileOpen && (
        <div className="navbar__overlay" onClick={() => setMobileOpen(false)} />
      )}
    </nav>
  )
}

export default function Navbar() {
  return (
    <Suspense fallback={<nav className="navbar" style={{ height: '64px' }} />}>
      <NavbarContent />
    </Suspense>
  )
}
