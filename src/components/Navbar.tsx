'use client'
import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { 
  Search, User, Menu, X, Sun, Moon, Link as LinkIcon, LogOut 
} from 'lucide-react'
import { useTheme } from '@/components/ThemeProvider/ThemeProvider'
import { UserProfile } from '@/types/user'

function NavbarContent() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [user, setUser] = useState<UserProfile | null>(null)
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { theme, toggleTheme } = useTheme()

  const searchParam = searchParams.get('q') || ''
  const [localSearch, setLocalSearch] = useState(searchParam)

  useEffect(() => {
    setLocalSearch(searchParam)
  }, [searchParam])

  useEffect(() => {
    const fetchProfile = async (sessionUser: any) => {
      if (!sessionUser) {
        setUser(null)
        return
      }
      
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', sessionUser.id)
        .single()
      
      setUser({ 
        id: sessionUser.id,
        nickname: data?.nickname || sessionUser.email?.split('@')[0] || 'Penguin',
        email: sessionUser.email,
        avatar_url: data?.avatar_url
      })
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
    router.push('/')
  }

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams)
    if (localSearch) params.set('q', localSearch)
    else params.delete('q')
    router.push(`/deal?${params.toString()}`)
  }

  const menuGroups = [
    { 
      name: 'Hot Deals', 
      items: [
        { name: 'All', path: '/deal' },
        { name: 'Popular', path: '/deal?sort=popular' },
        { name: 'Fashion', path: '/deal?cat=fashion' },
        { name: 'Beauty', path: '/deal?cat=beauty' },
        { name: 'Food', path: '/deal?cat=food' },
        { name: 'Living', path: '/deal?cat=living' },
        { name: 'Tech', path: '/deal?cat=tech' },
        { name: 'Game', path: '/deal?cat=game' },
        { name: 'Voucher', path: '/deal?cat=ticket' },
        { name: 'Offline', path: '/deal?cat=offline' },
      ]
    },
    { 
      name: 'Community', 
      items: [
        { name: 'Free Board', path: '/community' },
        { name: 'Review', path: '/community/reviews' },
        { name: 'Market', path: '/community/market' },
      ]
    },
    { 
      name: 'Bookmarks', 
      items: [
        { name: 'My Bookmarks', path: '/bookmark' },
      ]
    },
    { 
      name: 'Contact', 
      items: [
        { name: 'Support', path: '/contact' },
      ]
    },
  ]

  const isAdmin = user?.email && ['admin@saleship.com', 'ksy@example.com'].includes(user.email);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm py-2' : 'bg-transparent py-4'}`}>
      <div className="container flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center overflow-hidden shadow-lg shadow-blue-200 dark:shadow-none -rotate-6 group-hover:rotate-0 transition-transform duration-300">
            <Image 
              src="/images/pingu-hello.png.jpg" 
              alt="Saleship Mascot" 
              width={40} 
              height={40}
              className="object-cover scale-150 translate-y-2"
            />
          </div>
          <div className="flex flex-col -gap-1">
            <span className="text-2xl font-black tracking-tighter text-slate-900 dark:text-white leading-none">세일쉽</span>
            <span className="text-[10px] font-black text-blue-600 tracking-widest uppercase opacity-80">Saleship</span>
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-6">
          {menuGroups.map((group) => (
            <div key={group.name} className="relative group/menu">
              <button className="flex items-center gap-1 text-sm font-black text-slate-700 dark:text-slate-300 hover:text-blue-600 py-2 transition-colors">
                {group.name}
              </button>
              <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all duration-200 translate-y-2 group-hover/menu:translate-y-0">
                <div className="bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-2xl shadow-xl p-2 min-w-[140px]">
                  {group.items.map((item) => (
                    <Link 
                      key={item.path} 
                      href={item.path} 
                      className={`block px-4 py-2 text-[13px] font-bold rounded-xl transition-colors ${pathname === item.path ? 'bg-blue-50 text-blue-600' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-blue-600'}`}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}
          {isAdmin && (
            <Link href="/admin/post" className="text-sm font-black text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-4 py-2 rounded-full hover:bg-blue-600 hover:text-white transition-all flex items-center gap-1">
              Admin Post
            </Link>
          )}
        </div>

        <div className="flex items-center gap-4">
          <form onSubmit={handleSearch} className="hidden sm:relative sm:flex items-center group">
            <input 
              type="text" 
              placeholder="Search..." 
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="bg-slate-100 dark:bg-slate-800 border-none rounded-l-full py-2 pl-4 pr-2 text-sm w-40 focus:w-56 focus:bg-white dark:focus:bg-slate-700 transition-all outline-none"
            />
            <button type="submit" className="bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 text-slate-400 py-2 pr-4 pl-2 rounded-r-full transition-colors group-focus-within:bg-blue-600 group-focus-within:text-white">
              <Search size={16} />
            </button>
          </form>

          <button onClick={toggleTheme} className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {user ? (
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex flex-col items-end -gap-0.5">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Welcome</span>
                <Link href="/profile" className="text-sm font-black text-slate-900 dark:text-white hover:text-blue-600 transition-colors flex items-center gap-1">
                  {user.nickname}님 <img src="/images/pingu-hello.png.jpg" alt="" className="w-4 h-4" />
                </Link>
              </div>
              <div className="h-8 w-[1px] bg-slate-100 dark:bg-slate-800 mx-2 hidden sm:block" />
              <button 
                onClick={handleLogout} 
                className="p-2.5 text-slate-500 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-all active:scale-90"
                title="로그아웃"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <Link href="/login" className="p-2 text-slate-500 hover:text-blue-500 transition-colors">
              <User size={20} />
            </Link>
          )}

          <button className="md:hidden p-2 text-slate-500" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white dark:bg-slate-900 border-t dark:border-slate-800 p-6 animate-in slide-in-from-top duration-300 shadow-2xl">
          <div className="flex flex-col gap-6">
            {menuGroups.map((group) => (
              <div key={group.name} className="flex flex-col gap-3">
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{group.name}</span>
                <div className="grid grid-cols-2 gap-2">
                  {group.items.map((item) => (
                    <Link 
                      key={item.path} 
                      href={item.path} 
                      onClick={() => setMobileOpen(false)} 
                      className="text-sm font-bold p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl hover:text-blue-600 transition-colors"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
            {isAdmin && (
              <Link href="/admin/post" onClick={() => setMobileOpen(false)} className="bg-blue-600 text-white text-center py-4 rounded-xl font-black shadow-lg shadow-blue-200">
                Admin Post
              </Link>
            )}
            <div className="h-px bg-slate-100 dark:bg-slate-800" />
            <form onSubmit={handleSearch} className="relative flex items-center">
              <input 
                type="text" 
                placeholder="Search..." 
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-l-xl py-4 pl-4 pr-2 outline-none font-bold"
              />
              <button type="submit" className="bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 hover:text-white text-slate-400 py-4 pr-4 pl-2 rounded-r-xl transition-colors">
                <Search size={18} />
              </button>
            </form>
          </div>
        </div>
      )}
    </nav>
  )
}

export default function Navbar() {
  return (
    <Suspense fallback={<nav className="h-16 bg-white dark:bg-slate-900 shadow-sm" />}>
      <NavbarContent />
    </Suspense>
  )
}
