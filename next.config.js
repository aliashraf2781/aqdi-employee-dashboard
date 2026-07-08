// next.config.js
module.exports = {
  allowedDevOrigins: [
    "192.168.1.7",
    "192.168.1.4",
    "localhost",
  ],
  async rewrites() {
    const apiTarget =
      process.env.API_PROXY_TARGET || "https://aqid.subcodeco.com/api";

    return [
      {
        source: "/api/:path*",
        destination: `${apiTarget}/:path*`,
      },
    ];
  },
  images: {
    domains: ["aqid.subcodeco.com", "b3app.co"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "aqid.subcodeco.com",
        pathname: "/**",
      },
    ],
  }, eslint: {
    ignoreDuringBuilds: true,
  },
};