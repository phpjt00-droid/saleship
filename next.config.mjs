/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  output: 'export', // 정적 내보내기 활성화
  trailingSlash: true, // /about -> /about/index.html 링크 유지
  images: {
    unoptimized: true, // 정역 내보내기 시 이미지 최적화 비활성화 필수
  },
}

export default nextConfig
