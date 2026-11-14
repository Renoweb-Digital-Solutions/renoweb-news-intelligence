/** @type {import('next').NextConfig} */
const nextConfig = {
  // # Allow isolated build verification while a developer's .next directory is in use.
  distDir: process.env.SNOOPTEL_BUILD_DIR || ".next",
  // # Apply browser security headers to pages and same-origin API responses.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            // # Empty allowlists DENY device access; these do not request permissions.
            // # Snooptel needs no camera, microphone or geolocation capabilities.
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Content-Security-Policy",
            value:
              "frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'",
          },
          ...(process.env.NODE_ENV === "production"
            ? [{ key: "Strict-Transport-Security", value: "max-age=31536000" }]
            : []),
        ],
      },
    ];
  },
};

export default nextConfig;
