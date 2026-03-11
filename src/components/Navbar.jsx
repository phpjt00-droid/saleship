'use client'
import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { supabase } from '../lib/supabase'
import { Search, Menu, X, User, Bell, Anchor, Laptop, Shirt, Utensils, Home as HomeIcon, Smartphone, Sun, Moon, Sparkles, Gamepad2, Ticket, MapPin, LogOut } from 'lucide-react'
import { useTheme } from './ThemeProvider'
import './Navbar.css'

function NavbarContent() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [user, setUser] = useState(null)
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { theme, toggleTheme } = useTheme()

  const catParam = searchParams.get('cat') || ''

  useEffect(() => {
    const fetchProfile = async (sessionUser) => {
      if (!sessionUser) {
        setUser(null)
        return
      }
      
      const { data } = await supabase
        .from('profiles')
        .select('nickname')
        .eq('id', sessionUser.id)
        .single()
      
      setUser({ ...sessionUser, nickname: data?.nickname || sessionUser.email.split('@')[0] })
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      fetchProfile(session?.user ?? null)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      fetchProfile(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.reload()
  }

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

  // 메인 보드 메뉴 정의
  const boardMenus = [
    { name: '핫딜게시판', path: '/board', active: pathname.startsWith('/board') && !pathname.includes('/free') && !pathname.includes('/review') },
    { name: '자유게시판', path: '/board/free', active: pathname.includes('/free') },
    { name: '리뷰게시판', path: '/board/review', active: pathname.includes('/review') },
    { name: '문의하기', path: '/contact', active: pathname.includes('/contact') },
  ]

  // 핫딜 하위 카터고리 정의
  const subCategories = [
    { name: '전체핫딜', path: '/board', active: pathname === '/board' && !catParam },
    { name: '패션', path: '/board?cat=fashion', active: catParam === 'fashion' },
    { name: '푸드', path: '/board?cat=food', active: catParam === 'food' },
    { name: '뷰티', path: '/board?cat=beauty', active: catParam === 'beauty' },
    { name: '리빙', path: '/board?cat=home', active: catParam === 'home' },
    { name: '가전', path: '/board?cat=electronics', active: catParam === 'electronics' },
    { name: '게임', path: '/board?cat=game', active: catParam === 'game' },
    { name: '상품권/이용권', path: '/board?cat=ticket', active: catParam === 'ticket' },
    { name: '오프라인', path: '/board?cat=offline', active: catParam === 'offline' },
  ]

  // 현재 핫딜게시판이 활성화되어 있는지 확인
  const isHotDealBoard = boardMenus[0].active

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''} ${isHotDealBoard ? 'navbar--has-sub' : ''}`}>
      {/* 1단: 로고 및 로우 (Top) */}
      <div className="navbar__top">
        <div className="container navbar__container">
          <Link href="/" className="navbar__logo">
            <Anchor className="navbar__logo-icon" size={32} color="var(--accent-primary)" />
            <span className="navbar__logo-text">세일쉽</span>
          </Link>
          
          <div className="navbar__right">
            <div className="navbar__search-wrap">
              <Search size={18} className="navbar__search-icon" />
              <input type="text" placeholder="어떤 핫딜을 찾으시나요?" className="navbar__search-input" />
            </div>

            <div className="navbar__actions">
              <Link href="/write" className="navbar__write-btn-hot">글쓰기</Link>
              <button className="navbar__icon-btn" onClick={toggleTheme}>
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              {user ? (
                <div className="flex items-center gap-2">
                  <span className="hidden md:block text-sm font-bold text-slate-600">
                    <span className="text-blue-600">@{user.nickname}</span> 펭귄님
                  </span>
                  <Link href="/profile" className="navbar__icon-btn" title="프로필"><User size={22} /></Link>
                  <button className="navbar__icon-btn" onClick={handleLogout} title="로그아웃"><LogOut size={20} /></button>
                </div>
              ) : (
                <Link href="/login" className="navbar__icon-btn" title="로그인"><User size={22} /></Link>
              )}
              <button className="navbar__mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)}>
                {mobileOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2단: 메인 보드 메뉴 (Main) */}
      <div className="navbar__main">
        <div className="container">
          <div className="navbar__main-nav">
            {boardMenus.map((menu, i) => (
              <Link
                key={i}
                href={menu.path}
                className={`navbar__main-link ${menu.active ? 'active' : ''}`}
              >
                {menu.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* 3단: 핫딜 서브 카테고리 (Sub) - 핫딜게시판 활성화 시에만 노출 */}
      {isHotDealBoard && (
        <div className="navbar__sub animate-fadeInDown">
          <div className="container">
            <div className="navbar__sub-nav">
              {subCategories.map((cat, i) => (
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
      )}

      {/* Mobile Menu */}
      <div className={`navbar__mobile-menu ${mobileOpen ? 'navbar__mobile-menu--open' : ''}`}>
        <div className="navbar__mobile-links">
          {boardMenus.map((menu, i) => (
            <div key={i} className="navbar__mobile-group">
              <Link href={menu.path} className={`navbar__mobile-link navbar__mobile-link--main ${menu.active ? 'active' : ''}`}>
                {menu.name}
              </Link>
              {menu.name === '핫딜게시판' && menu.active && (
                <div className="navbar__mobile-sub">
                  {subCategories.map((cat, j) => (
                    <Link key={j} href={cat.path} className={`navbar__mobile-link navbar__mobile-link--sub ${cat.active ? 'active' : ''}`}>
                      {cat.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          <div className="navbar__mobile-divider" />
          <button className="navbar__mobile-link" onClick={toggleTheme}>
            {theme === 'dark' ? '라이트 모드' : '다크 모드'}
          </button>
          {user ? (
            <button className="navbar__mobile-link" onClick={handleLogout}>로그아웃</button>
          ) : (
            <Link href="/login" className="navbar__mobile-link">로그인</Link>
          )}
        </div>
      </div>
      
      {mobileOpen && <div className="navbar__overlay" onClick={() => setMobileOpen(false)} />}
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
