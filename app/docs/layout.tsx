import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DocsSidebar from "@/components/DocsSidebar";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="mx-auto grid w-full max-w-7xl gap-6 px-5 pb-20 pt-28 md:px-8 lg:grid-cols-[320px_minmax(0,1fr)]">
        <aside>
          <div className="lg:sticky lg:top-28">
            <DocsSidebar />
          </div>
        </aside>
        <main className="min-w-0">
          <div className="cm-noise-overlay">{children}</div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
