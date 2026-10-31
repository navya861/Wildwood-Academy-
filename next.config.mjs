/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverComponentsExternalPackages: ['pdf-parse', 'mammoth', 'tesseract.js'],
  },
  images: {
    domains: ['localhost', 'supabase.co'],
  },
};

export default nextConfig;
