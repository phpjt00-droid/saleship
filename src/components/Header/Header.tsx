'use client'
import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Search, User, Menu, X, Bell, Plus, Compass, TrendingUp, Sparkles, MessageSquare, ThumbsUp, Bookmark, LogIn, LogOut, ChevronDown, MapPin, ShoppingBag, Flame, Settings, Heart, LayoutGrid, LayoutList, Sun, Moon, Link as LinkIcon } from 'lucide-react'
import { useTheme } from '@/components/ThemeProvider/ThemeProvider'
import './Header.css'

function NavbarContent() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const [user, setUser] = useState(null)
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { theme, toggleTheme } = useTheme()

  const catParam = searchParams.get('cat') || ''
  const searchParam = searchParams.get('q') || ''
  const [localSearch, setLocalSearch] = useState(searchParam)

  useEffect(() => {
    setLocalSearch(searchParam)
  }, [searchParam])

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

  const handleSearchChange = (e) => {
    const val = e.target.value
    setLocalSearch(val)

    const params = new URLSearchParams(searchParams)
    if (val) {
      params.set('q', val)
    } else {
      params.delete('q')
    }

    let targetPath = pathname
    const isDealPage = pathname === '/' || pathname.startsWith('/board') || pathname === '/saved'
    
    if (!isDealPage && val) {
      targetPath = '/board'
      router.push(`${targetPath}?${params.toString()}`)
      return
    }

    router.replace(`${targetPath}?${params.toString()}`, { scroll: false })
  }

  // 메인 보드 메뉴 정의
  const boardMenus = [
    { name: '핫딜게시판', path: '/board', active: pathname.startsWith('/board') && !pathname.includes('/free') && !pathname.includes('/review') },
    { name: '자유게시판', path: '/board/free', active: pathname.includes('/free') },
    { name: '리뷰게시판', path: '/board/review', active: pathname.includes('/review') },
    { name: '관심핫딜', path: '/saved', active: pathname.includes('/saved') },
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
    <nav data-v="v2-pill-fix" className={`navbar ${scrolled ? 'navbar--scrolled' : ''} ${isHotDealBoard ? 'navbar--has-sub' : ''}`}>
      {/* 1단: 로고 및 로우 (Top) */}
      <div className="navbar__top">
        <div className="container navbar__container">
          <Link href="/" className="navbar__logo">
            <LinkIcon className="navbar__logo-icon" size={32} color="var(--accent-primary)" />
            <span className="navbar__logo-text">세일쉽</span>
          </Link>
          
          <div className="navbar__right">
            {/* Desktop Search */}
            <div className="relative group hidden md:flex items-center w-64 mr-2">
              <Search size={16} className="absolute left-3 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              <input 
                type="text" 
                placeholder="어떤 핫딜을 찾으시나요?" 
                className="w-full bg-slate-100 dark:bg-slate-800 border-transparent focus:bg-white dark:focus:bg-slate-900 border focus:border-blue-500 rounded-full py-2 pl-9 pr-4 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 outline-none transition-all shadow-sm"
                value={localSearch}
                onChange={handleSearchChange}
              />
            </div>

            <div className="navbar__actions">
              {/* Mobile Search Toggle */}
              <button 
                className="navbar__icon-btn md:hidden" 
                onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
                aria-label="Toggle search"
              >
                <Search size={22} />
              </button>

              <Link href="/write" className="navbar__write-btn-hot">글쓰기</Link>
              <button className="navbar__icon-btn" onClick={toggleTheme}>
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              {user ? (
                <div className="flex items-center gap-2">
                  <span className="hidden lg:block text-sm font-bold text-slate-600">
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

      {/* Mobile Search Bar - Expandable */}
      {mobileSearchOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 px-4 py-3 border-b border-slate-100 dark:border-slate-800 animate-slideDown">
          <div className="relative flex items-center">
            <Search size={16} className="absolute left-3 text-slate-400" />
            <input 
              type="text" 
              placeholder="제목으로 핫딜 검색..." 
              className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl py-3 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
              value={localSearch}
              onChange={handleSearchChange}
              autoFocus
            />
            <button 
              className="ml-2 text-slate-400 p-2"
              onClick={() => setMobileSearchOpen(false)}
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}

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
