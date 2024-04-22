/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/backend/:path*",
        destination: `${
          process.env.NEXT_PUBLIC_VERCEL_ENV === "production"
            ? process.env.PROD_URL
            : process.env.NEXT_PUBLIC_VERCEL_ENV === "preview"
            ? process.env.STAGING_URL
            : process.env.LOCAL_URL
        }/:path*`,
      },
    ];
  },
};

export default nextConfig;
