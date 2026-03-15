'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'

export default function MobileSearchBar() {
    const [keyword, setKeyword] = useState('')
    const router = useRouter()

    const handleSearch = () => {
        if (keyword.trim()) router.push(`/deals?search=${encodeURIComponent(keyword)}`)
    }

    return (
        <div className="sticky top-0 z-50 bg-[#f8fafc]/90 dark:bg-slate-950/90 backdrop-blur-md border-b px-4 py-3 md:hidden">
            <div className="relative flex items-center">
                <input
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="검색어를 입력하세요..."
                    className="w-full pl-4 pr-12 py-3 bg-slate-200 dark:bg-slate-800 rounded-2xl text-sm font-bold"
                />
                <button onClick={handleSearch} className="absolute right-3 text-slate-400"><Search size={20} /></button>
            </div>
        </div>
    )
}