/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n: {
    defaultLocale: "en",
    locales: ["en", "es"],
  },
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: "/dicom/:path*",
        headers: [
          { key: "Content-Type", value: "application/dicom" },
          { key: "Access-Control-Allow-Origin", value: "*" },
        ],
      },
    ];
  },
};

export default nextConfig;
