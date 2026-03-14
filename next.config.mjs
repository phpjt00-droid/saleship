/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  // output: 'export'를 제거하여 서버 기능을 활성화합니다.
  trailingSlash: true,
  images: {
    // 외부 이미지 도메인 설정은 유지합니다.
    remotePatterns: [
      { hostname: 'images.unsplash.com' },
      { hostname: 'cdn.jsdelivr.net' },
      { hostname: 'pagead2.googlesyndication.com' },
      { hostname: 'www.clarity.ms' },
      { hostname: 'saleship-web.pages.dev' },
    ],
    // 서버 기능을 사용하므로 unoptimized를 false로 설정할 수 있습니다.
    unoptimized: false,
  },
};

export default nextConfig;