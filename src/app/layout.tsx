import React from 'react'
import '@/styles/globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/Footer/Footer'
import { ThemeProvider } from 'next-themes' // 수정: next-themes 사용
import { GoogleAnalytics } from '@next/third-parties/google'
import { Toaster } from 'sonner'

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
    // suppressHydrationWarning: 다크모드/라이트모드 전환 시 깜빡임 방지
    <html lang="ko" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body>
        <GoogleAnalytics gaId="G-G00CNYVM0H" />

        {/* 다크모드 설정을 위한 ThemeProvider 적용 */}
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Toaster position="top-center" richColors />
          <Header />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}