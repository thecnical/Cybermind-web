import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MarketingPageView } from "@/components/SitePrimitives";
import { marketingPages } from "@/lib/siteContent";

export default function ExtensionsPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <MarketingPageView page={marketingPages["/extensions"]} />
      <Footer />
    </div>
  );
}
