import React from 'react'
import '@/styles/globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/Footer/Footer'
import { ThemeProvider } from 'next-themes'
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
    <html lang="ko" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      {/* 여기서 배경색과 기본 텍스트 색상을 전역으로 제어합니다 */}
      <body className="bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
        <GoogleAnalytics gaId="G-G00CNYVM0H" />

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