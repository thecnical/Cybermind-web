"use client";

import { useEffect, useRef } from "react";

interface AdBannerProps {
  slot: string;
  format?: "auto" | "rectangle" | "horizontal" | "vertical";
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

/**
 * Google AdSense banner component.
 * Usage: <AdBanner slot="1234567890" format="horizontal" />
 *
 * Setup:
 * 1. Add to layout.tsx <head>:
 *    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX" crossOrigin="anonymous" />
 * 2. Replace ca-pub-XXXXXXXXXXXXXXXX with your AdSense publisher ID
 * 3. Replace slot prop with your ad unit slot ID
 */
export default function AdBanner({ slot, format = "auto", className = "" }: AdBannerProps) {
  const adRef = useRef<HTMLModElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    try {
      if (typeof window !== "undefined") {
        window.adsbygoogle = window.adsbygoogle || [];
        (window.adsbygoogle as unknown[]).push({});
      }
    } catch (e) {
      // AdSense not loaded yet — silent fail
    }
  }, []);

  // Don't render in development
  if (process.env.NODE_ENV === "development") {
    return (
      <div className={`flex items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.02] text-xs text-[var(--text-muted)] ${className}`}
        style={{ minHeight: 90 }}>
        Ad placeholder (slot: {slot})
      </div>
    );
  }

  return (
    <div className={className}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
