/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["pdf-parse"],
  },
  async redirects() {
    return [
      { source: "/", destination: "/resume", permanent: false },
    ]
  },
}

export default nextConfig
