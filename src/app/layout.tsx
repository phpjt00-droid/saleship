import React from 'react'
import '@/styles/globals.css'
import Header from '@/components/layout/Header'
import BottomNav from '@/components/layout/BottomNav'
import Footer from '@/components/Footer/Footer'
import { ThemeProvider } from 'next-themes'
import { GoogleAnalytics } from '@next/third-parties/google'
import { Toaster } from 'sonner'
import { TabProvider } from '@/context/TabContext' // 탭 상태 관리를 위한 Provider

export const metadata = {
  title: '세일쉽(Saleship) | 취향과 가치를 담은 핫딜',
  description: '운영자가 엄선한 핫딜 큐레이션 커뮤니티',
  keywords: ['핫딜', '세일', '쇼핑', '할인정보', '특가', 'Saleship', '세일쉽'],
  authors: [{ name: 'Saleship Team' }],
  openGraph: {
    title: '세일쉽(Saleship) | 취향과 가치를 담은 핫딜',
    description: '운영자가 엄선한 핫딜 큐레이션 커뮤니티',
    url: 'https://saleship-web.pages.dev',
    siteName: 'Saleship',
    locale: 'ko_KR',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
        <GoogleAnalytics gaId="G-G00CNYVM0H" />

        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <TabProvider>
            <Toaster position="top-center" richColors />
            <Header />
            <main className="min-h-screen pb-20 md:pb-0">
              {children}
            </main>
            <Footer />
            <BottomNav />
          </TabProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}