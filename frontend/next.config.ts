const NEXT_PUBLIC_SITE_URL           = process.env.NEXT_PUBLIC_SITE_URL;
const BACKEND_API_URL                = process.env.BACKEND_API_URL;
const NEXT_PUBLIC_BACKEND_STATIC_URL = process.env.NEXT_PUBLIC_BACKEND_STATIC_URL;
const backendParsedUrl               = new URL(NEXT_PUBLIC_BACKEND_STATIC_URL ?? 'http://host.docker.internal:8000/');


const nextConfig = {
  images: {
    domains: [NEXT_PUBLIC_SITE_URL], // public の配信
    // Django の static の配信
    remotePatterns: [
      {
        protocol: backendParsedUrl.protocol.replace(':',''),
        hostname: backendParsedUrl.hostname,
        port:     backendParsedUrl.port,
        pathname: '/static/**',
      },
    ],
  },
  poweredByHeader: false, // 'x-powered-by ヘッダーを無効化
  devIndicators: {
    appIsrStatus: false,  // Static Route インジケーター(非表示は非推奨)
  },
  reactStrictMode: false, // true: 冪等性を確認するが2回 Effect が動く(本番は自動で False )
  trailingSlash:   false,
};

module.exports = {
  ...nextConfig,
  async rewrites() {
    return [
      {
        // /backendapi はバックエンドへ
        // Django側 APPEND_SLASH=True に注意
        source:      '/backendapi/:path*',
        destination: `${BACKEND_API_URL}/backendapi/:path*/`,
      },
    ]
  },
};