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

  const menuItems = [
    { name: '핫딜', path: '/deal' },
    { name: '커뮤니티', path: '/community' },
    { name: '글쓰기', path: '/write' },
  ]

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm py-2' : 'bg-transparent py-4'}`}>
      <div className="container flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="relative w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center overflow-hidden shadow-lg shadow-blue-200 dark:shadow-none -rotate-6 group-hover:rotate-0 transition-transform duration-300">
            <Image 
              src="/images/mascot-hero.png" 
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
        <div className="hidden md:flex items-center gap-8">
          {menuItems.map((item) => (
            <Link 
              key={item.path} 
              href={item.path} 
              className={`text-sm font-bold transition-colors ${pathname === item.path ? 'text-blue-600' : 'text-slate-600 dark:text-slate-400 hover:text-blue-600'}`}
            >
              {item.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <form onSubmit={handleSearch} className="hidden sm:relative sm:flex items-center group">
            <Search size={16} className="absolute left-3 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            <input 
              type="text" 
              placeholder="검색..." 
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="bg-slate-100 dark:bg-slate-800 border-none rounded-full py-2 pl-9 pr-4 text-sm w-40 focus:w-60 focus:bg-white dark:focus:bg-slate-700 transition-all outline-none"
            />
          </form>

          <button onClick={toggleTheme} className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {user ? (
            <div className="flex items-center gap-3">
              <Link href="/login" className="text-sm font-bold text-blue-600 truncate max-w-[100px]">@{user.nickname}</Link>
              <button onClick={handleLogout} className="p-2 text-slate-500 hover:text-rose-500 transition-colors">
                <LogOut size={20} />
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
        <div className="md:hidden absolute top-full left-0 right-0 bg-white dark:bg-slate-900 border-t dark:border-slate-800 p-4 animate-in slide-in-from-top duration-300">
          <div className="flex flex-col gap-4">
            {menuItems.map((item) => (
              <Link key={item.path} href={item.path} onClick={() => setMobileOpen(false)} className="text-lg font-bold p-2">{item.name}</Link>
            ))}
            <div className="h-px bg-slate-100 dark:bg-slate-800 my-2" />
            <form onSubmit={handleSearch} className="relative flex items-center">
              <Search size={18} className="absolute left-3 text-slate-400" />
              <input 
                type="text" 
                placeholder="검색어 입력..." 
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl py-3 pl-10 pr-4 outline-none"
              />
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
