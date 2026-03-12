/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  output: 'export', // 정적 내보내기 활성화
  trailingSlash: true, // /about -> /about/index.html 링크 유지
  images: {
    // Allow external image domains for Next.js Image component
    domains: ['images.unsplash.com', 'cdn.jsdelivr.net', 'pagead2.googlesyndication.com', 'www.clarity.ms', 'saleship-web.pages.dev'],
    // When using static export, we keep unoptimized to avoid build errors
    unoptimized: true,
  },
  // Bundle size note: keep lucide-react imports granular to enable tree‑shaking.

}

export default nextConfig
