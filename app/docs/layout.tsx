"use client";

import { useState } from "react";
import { BookOpen, X } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DocsSidebar from "@/components/DocsSidebar";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Mobile sidebar toggle button */}
      <div className="sticky top-[72px] z-30 flex items-center gap-3 border-b border-white/8 bg-[rgba(6,7,11,0.92)] px-4 py-3 backdrop-blur lg:hidden">
        <button
          type="button"
          onClick={() => setSidebarOpen(v => !v)}
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white"
        >
          {sidebarOpen ? <X size={15} /> : <BookOpen size={15} />}
          {sidebarOpen ? "Close" : "Docs menu"}
        </button>
        <p className="font-mono text-xs text-[var(--text-muted)]">CyberMind Docs</p>
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 pb-20 pt-6 md:px-8 lg:pt-28">
        <div className="lg:grid lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-6">

          {/* Sidebar — hidden on mobile unless toggled */}
          <aside className={`${sidebarOpen ? "block" : "hidden"} mb-6 lg:mb-0 lg:block`}>
            <div className="lg:sticky lg:top-28">
              <DocsSidebar />
            </div>
          </aside>

          {/* Main content */}
          <main className="min-w-0 pt-2 lg:pt-0">
            <div className="cm-noise-overlay">{children}</div>
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
}
