import React from 'react'
import { Inter, Outfit } from 'next/font/google'
import '@/styles/globals.css'
import Header from '@/components/layout/Header';
import Footer from '@/components/Footer/Footer'
import ThemeProvider from '@/components/ThemeProvider/ThemeProvider'
import { GoogleAnalytics } from '@next/third-parties/google'
import Script from 'next/script'
import { Toaster } from 'sonner'

export const metadata = {
  title: 'Saleship(Saleship) | 취향과 가치를 담은 핫딜',
  description: '운영자가 엄선한 핫딜 큐레이션 커뮤니티',
  keywords: ['핫딜', '세일', '쇼핑', '할인정보', '특가', 'Saleship', 'Saleship'],
  authors: [{ name: 'Saleship Team' }],
  openGraph: {
    title: 'Saleship(Saleship) | 취향과 가치를 담은 핫딜',
    description: '운영자가 엄선한 핫딜 큐레이션 커뮤니티',
    url: 'https://saleship-web.pages.dev',
    siteName: 'Saleship',
    images: [
      {
        url: 'https://saleship-web.pages.dev/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Saleship(Saleship)',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Saleship(Saleship) | 취향과 가치를 담은 핫딜',
    description: '운영자가 엄선한 핫딜 큐레이션 커뮤니티',
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
