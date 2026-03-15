'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'

export default function MobileSearchBar() {
    const [keyword, setKeyword] = useState('')
    const router = useRouter()

    const handleSearch = () => {
        if (keyword.trim()) {
            // 검색 시 deals 페이지로 이동
            router.push(`/deals?search=${encodeURIComponent(keyword)}`)
        }
    }

    return (
        <div className="sticky top-0 z-50 bg-[#f8fafc]/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 md:hidden px-4 py-3">
            <div className="relative flex items-center">
                <input
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="검색어를 입력하세요..."
                    className="w-full pl-4 pr-12 py-3 bg-slate-200 dark:bg-slate-800 rounded-2xl text-sm font-bold placeholder:text-slate-400 focus:outline-none"
                />
                <button
                    onClick={handleSearch}
                    className="absolute right-3 p-2 text-slate-400 hover:text-blue-600 transition-colors"
                >
                    <Search size={20} />
                </button>
            </div>
        </div>
    )
}