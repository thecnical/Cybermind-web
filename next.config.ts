import type { NextConfig } from "next";

const isDevelopment = process.env.NODE_ENV !== "production";

// FIX: tightened connect-src — enumerate specific allowed origins
// instead of the previous "https: wss:" which allowed any HTTPS endpoint
const BACKEND_URL  = process.env.NEXT_PUBLIC_BACKEND_URL  || "https://cybermind-backend-8yrt.onrender.com";
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
// Extract hostname for CSP (e.g. "xaxbbonibqoxcxtqkhth.supabase.co")
const supabaseHost = SUPABASE_URL ? new URL(SUPABASE_URL).hostname : "*.supabase.co";

const contentSecurityPolicy = [
  "default-src 'self'",
  // FIX: 'unsafe-inline' kept for Next.js App Router compatibility
  // (Next.js inlines critical CSS and hydration scripts — nonces require custom server)
  // Mitigated by: frame-ancestors 'none', strict connect-src, no user-rendered HTML
  `script-src 'self' 'unsafe-inline'${isDevelopment ? " 'unsafe-eval'" : ""} https://pagead2.googlesyndication.com https://www.googletagmanager.com https://js.stripe.com`,
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data: https://fonts.gstatic.com",
  // FIX: specific origins only — no wildcard https: or wss:
  `connect-src 'self' ${BACKEND_URL} https://${supabaseHost} wss://${supabaseHost} https://www.google-analytics.com https://api.stripe.com`,
  "frame-src 'none' https://js.stripe.com https://hooks.stripe.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "media-src 'none'",
  isDevelopment ? "" : "upgrade-insecure-requests",
]
  .filter(Boolean)
  .join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy",            value: contentSecurityPolicy },
  { key: "Strict-Transport-Security",          value: "max-age=31536000; includeSubDomains; preload" },
  { key: "Referrer-Policy",                    value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options",                    value: "DENY" },
  { key: "X-Content-Type-Options",             value: "nosniff" },
  { key: "X-DNS-Prefetch-Control",             value: "off" },
  { key: "X-Download-Options",                 value: "noopen" },
  { key: "Cross-Origin-Opener-Policy",         value: "same-origin" },
  { key: "Cross-Origin-Resource-Policy",       value: "same-origin" },
  { key: "Cross-Origin-Embedder-Policy",       value: "require-corp" },
  { key: "X-Permitted-Cross-Domain-Policies",  value: "none" },
  { key: "Permissions-Policy",                 value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()" },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "api.dicebear.com" },
    ],
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      {
        source: "/(.*)\\.(ico|png|jpg|jpeg|svg|webp|avif|woff|woff2|ttf|otf)",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      // Binary downloads — allow cross-origin access so curl/wget/PowerShell can download
      {
        source: "/cybermind-(.*)",
        headers: [
          { key: "Cross-Origin-Resource-Policy", value: "cross-origin" },
          { key: "Cross-Origin-Embedder-Policy", value: "unsafe-none" },
          { key: "Content-Disposition", value: "attachment" },
          { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.cybermind.thecnical.dev" }],
        destination: "https://cybermind.thecnical.dev/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
