import type { Metadata } from "next";
import { IBM_Plex_Mono, Plus_Jakarta_Sans } from "next/font/google";
import CyberMindAssistant from "@/components/CyberMindAssistant";
import CookieConsent from "@/components/CookieConsent";
import CursorAura from "@/components/CursorAura";
import { AuthProvider } from "@/components/AuthProvider";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-ibm-plex-mono",
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "CyberMind CLI - AI-Powered Offensive Security CLI",
  metadataBase: new URL("https://cybermind.local"),
  description:
    "CyberMind CLI is an AI-powered offensive security CLI with interactive AI chat, recon, hunt, Abhimanyu workflows, and terminal-first documentation.",
  openGraph: {
    title: "CyberMind CLI - AI-Powered Offensive Security CLI",
    description:
      "CyberMind CLI is an AI-powered offensive security CLI with interactive AI chat, recon, hunt, Abhimanyu workflows, and terminal-first documentation.",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${plusJakartaSans.variable} ${ibmPlexMono.variable}`}
    >
      <body suppressHydrationWarning className={`${plusJakartaSans.className} app-theme antialiased`}>
        {/* Source protection: disable right-click, devtools shortcut, text selection on production */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(){
                if(typeof window==='undefined') return;
                // Disable right-click context menu
                document.addEventListener('contextmenu', function(e){ e.preventDefault(); });
                // Disable common devtools shortcuts
                document.addEventListener('keydown', function(e){
                  if(e.key==='F12') e.preventDefault();
                  if(e.ctrlKey && e.shiftKey && (e.key==='I'||e.key==='J'||e.key==='C')) e.preventDefault();
                  if(e.ctrlKey && e.key==='U') e.preventDefault();
                  if(e.ctrlKey && e.key==='S') e.preventDefault();
                });
              })();
            `,
          }}
        />
        <AuthProvider>
          <CursorAura />
          {children}
          <CyberMindAssistant />
          <CookieConsent />
        </AuthProvider>
      </body>
    </html>
  );
}

