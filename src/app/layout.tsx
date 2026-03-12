import React from 'react'
import { Inter, Outfit } from 'next/font/google'
import '@/styles/globals.css'
import '@/styles/globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer/Footer'
import ThemeProvider from '@/components/ThemeProvider/ThemeProvider'
import { GoogleAnalytics } from '@next/third-parties/google'
import Script from 'next/script'

export const metadata = {
  title: {
    default: 'Saleship | Hot Deal Community',
    template: '%s | Saleship'
  },
  description: 'Discover the best online deals, discount information, and community reviews at Saleship. 양질의 핫딜 정보를 선별하여 공유하는 소비자 커뮤니티입니다.',
  keywords: ['핫딜', '세일', '쇼핑', '할인정보', '특가', 'Saleship', '세일쉽'],
  authors: [{ name: 'Saleship Team' }],
  openGraph: {
    title: 'Saleship | Hot Deal Community',
    description: 'Discover the best online deals, discount information, and community reviews at Saleship.',
    url: 'https://saleship-web.pages.dev',
    siteName: 'Saleship',
    images: [
      {
        url: 'https://saleship-web.pages.dev/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Saleship | Hot Deal Community',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Saleship | Hot Deal Community',
    description: 'Discover the best online deals, discount information, and community reviews at Saleship.',
    images: ['https://saleship-web.pages.dev/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var savedTheme = localStorage.getItem('theme');
                  var theme = savedTheme ? savedTheme : 'light';
                  document.documentElement.setAttribute('data-theme', theme);
                } catch (e) {}
              })();
            `,
          }}
        />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3229803978165372"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <GoogleAnalytics gaId="G-G00CNYVM0H" />
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "vtqbgz36if");
          `}
        </Script>
        <ThemeProvider>
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}

// Test deployment trigger: 2026-03-13
