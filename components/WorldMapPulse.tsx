"use client";

import { Surface } from "@/components/DesignPrimitives";

export default function WorldMapPulse() {
  return (
    <Surface variant="glass" tone="cyan" elevation="high" className="rounded-[30px] p-6 md:p-8">
      <p className="cm-label">Global reach</p>
      <h2 className="mt-3 text-3xl font-semibold text-white md:text-4xl">
        CyberMind CLI sessions across the world
      </h2>
      <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--text-soft)]">
        Researchers and security teams use CyberMind CLI in live workflows across multiple regions
        for recon, hunt, and AI-assisted triage.
      </p>

      <div className="relative mt-8 overflow-hidden rounded-[24px] border border-white/10">
        <iframe
          src="https://www.mapcn.dev/map?theme=dark&zoom=2"
          width="100%"
          height="400"
          frameBorder="0"
          title="CyberMind CLI global activity map"
          className="block w-full"
          loading="lazy"
          allowFullScreen
        />
      </div>
    </Surface>
  );
}
