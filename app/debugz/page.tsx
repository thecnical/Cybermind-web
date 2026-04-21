import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function DebugzPage() {
  return (
    <div className="min-h-screen bg-[#06070b] text-white">
      <Navbar />
      <main className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-5 pb-24 pt-28 md:px-8">
        <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-8">
          <p className="cm-label text-[var(--accent-cyan)]">Debug</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-white">Debug surface</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--text-soft)]">
            This route is reserved for internal diagnostics and product validation flows.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
