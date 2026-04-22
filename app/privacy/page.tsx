import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "CyberMind CLI privacy policy — how we collect, use, and protect your data.",
};

const EFFECTIVE_DATE = "April 9, 2026";
const CONTACT_EMAIL  = "privacy@cybermind.thecnical.dev";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto w-full max-w-3xl px-5 pb-24 pt-28 md:px-8">
        <div className="mb-10">
          <p className="font-mono text-xs uppercase tracking-[0.32em] text-[var(--accent-cyan)]">Legal</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white">Privacy Policy</h1>
          <p className="mt-3 text-sm text-[var(--text-soft)]">Effective date: {EFFECTIVE_DATE}</p>
        </div>

        <div className="prose-legal">
          <Section title="1. Who we are">
            CyberMind CLI (&quot;CyberMind&quot;, &quot;we&quot;, &quot;us&quot;) is an AI-powered offensive security CLI tool and SaaS platform operated by Chandan Pandey. Our website is located at https://cybermind.thecnical.dev.
          </Section>

          <Section title="2. Data we collect">
            <p>We collect the minimum data necessary to operate the service:</p>
            <ul>
              <li><strong>Account data:</strong> email address, full name (optional), and hashed password managed by Supabase Auth.</li>
              <li><strong>API keys:</strong> stored as SHA-256 hashes only — the plaintext key is shown once at creation and never stored.</li>
              <li><strong>Usage data:</strong> request counts per day/month, endpoint accessed, and IP address of the request — used for plan enforcement and abuse prevention.</li>
              <li><strong>Payment data:</strong> PayU transaction ID and payment status. We never store card numbers, CVVs, or bank details — these are handled entirely by PayU.</li>
              <li><strong>Contact form submissions:</strong> name, email, company (optional), subject, and message — stored for up to 365 days.</li>
              <li><strong>CLI local data:</strong> chat history is stored locally on your machine at <code>~/.cybermind/history.json</code>. We do not have access to this file.</li>
            </ul>
          </Section>

          <Section title="3. How we use your data">
            <ul>
              <li>To authenticate you and manage your account session.</li>
              <li>To enforce plan limits (daily request quotas, device limits).</li>
              <li>To process payments and upgrade your plan after a successful transaction.</li>
              <li>To respond to support and contact form requests.</li>
              <li>To detect and prevent abuse, fraud, and unauthorized access.</li>
              <li>To comply with legal obligations.</li>
            </ul>
            <p>We do not sell your data. We do not use your data for advertising profiling.</p>
          </Section>

          <Section title="4. Data storage and retention">
            <ul>
              <li><strong>Account and profile data:</strong> retained while your account is active.</li>
              <li><strong>Usage logs:</strong> automatically purged after 90 days.</li>
              <li><strong>Contact submissions:</strong> automatically purged after 365 days.</li>
              <li><strong>API key hashes:</strong> retained until you revoke the key or delete your account.</li>
            </ul>
            <p>Data is stored on Supabase (PostgreSQL) hosted on AWS infrastructure. Backups are managed by Supabase according to their data retention policies.</p>
          </Section>

          <Section title="5. Third-party services">
            <p>We use the following third-party services that may process your data:</p>
            <ul>
              <li><strong>Supabase</strong> — authentication and database (supabase.com)</li>
              <li><strong>Vercel</strong> — frontend hosting (vercel.com)</li>
              <li><strong>Render</strong> — backend hosting (render.com)</li>
              <li><strong>PayU</strong> — payment processing (payu.in)</li>
              <li><strong>AI providers</strong> — prompts are sent to AI providers (Groq, Mistral, etc.) for processing. Prompts are processed statelessly and are not stored by us.</li>
            </ul>
            <p>Each provider operates under their own privacy policy and data processing agreements.</p>
          </Section>

          <Section title="6. Cookies and tracking">
            <p>We use minimal cookies necessary for session management and authentication. We may use Google Analytics for aggregate traffic analysis. You can manage cookie preferences via the cookie consent banner.</p>
            <p>We do not use tracking pixels, fingerprinting, or cross-site tracking.</p>
          </Section>

          <Section title="7. Your rights">
            <p>Depending on your jurisdiction, you may have the right to:</p>
            <ul>
              <li><strong>Access:</strong> request a copy of your personal data.</li>
              <li><strong>Rectification:</strong> correct inaccurate data via your dashboard settings.</li>
              <li><strong>Erasure:</strong> delete your account and all associated data via <code>DELETE /auth/account</code> or by contacting us.</li>
              <li><strong>Portability:</strong> request your data in a machine-readable format.</li>
              <li><strong>Objection:</strong> object to processing for legitimate interests.</li>
            </ul>
            <p>To exercise these rights, contact us at <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.</p>
          </Section>

          <Section title="8. Security">
            <p>We implement industry-standard security measures including:</p>
            <ul>
              <li>API keys stored as SHA-256 hashes (never plaintext)</li>
              <li>All data in transit encrypted via TLS 1.2+</li>
              <li>Row-Level Security (RLS) on all database tables</li>
              <li>JWT verification on every authenticated request</li>
              <li>HMAC-SHA256 webhook signature verification</li>
            </ul>
            <p>No system is 100% secure. If you discover a security vulnerability, please report it to <a href="mailto:security@cybermind.thecnical.dev">security@cybermind.thecnical.dev</a>.</p>
          </Section>

          <Section title="9. Children">
            CyberMind is not directed at children under 18. We do not knowingly collect data from minors. If you believe a minor has provided us data, contact us immediately.
          </Section>

          <Section title="10. Changes to this policy">
            We may update this policy as the service evolves. Material changes will be communicated via email or a notice on the website. Continued use after changes constitutes acceptance.
          </Section>

          <Section title="11. Contact">
            <p>For privacy-related questions or requests:</p>
            <p><strong>Email:</strong> <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></p>
            <p><strong>Website:</strong> https://cybermind.thecnical.dev/contact</p>
          </Section>
        </div>
      </main>
      <Footer />

      <style>{`
        .prose-legal { color: var(--text-soft); font-size: 0.9375rem; line-height: 1.75; }
        .prose-legal h2 { color: white; font-size: 1.125rem; font-weight: 600; margin-top: 2.5rem; margin-bottom: 0.75rem; }
        .prose-legal p { margin-bottom: 1rem; }
        .prose-legal ul { list-style: disc; padding-left: 1.5rem; margin-bottom: 1rem; }
        .prose-legal li { margin-bottom: 0.375rem; }
        .prose-legal strong { color: var(--text-main); }
        .prose-legal a { color: var(--accent-cyan); text-decoration: underline; }
        .prose-legal code { font-family: var(--font-ibm-plex-mono); font-size: 0.8125rem; background: rgba(255,255,255,0.06); padding: 0.125rem 0.375rem; border-radius: 0.375rem; }
      `}</style>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2>{title}</h2>
      {typeof children === "string" ? <p>{children}</p> : children}
    </div>
  );
}

