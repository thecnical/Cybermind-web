import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "CyberMind CLI terms of service — authorized use, account responsibilities, and legal framework.",
};

const EFFECTIVE_DATE = "April 9, 2026";
const CONTACT_EMAIL  = "legal@cybermind.thecnical.dev";

export default function TermsPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto w-full max-w-3xl px-5 pb-24 pt-28 md:px-8">
        <div className="mb-10">
          <p className="font-mono text-xs uppercase tracking-[0.32em] text-[var(--accent-cyan)]">Legal</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white">Terms of Service</h1>
          <p className="mt-3 text-sm text-[var(--text-soft)]">Effective date: {EFFECTIVE_DATE}</p>
        </div>

        <div className="prose-legal">
          <Section title="1. Acceptance">
            By accessing or using CyberMind CLI, its website, dashboard, API, or any associated services (&quot;the Service&quot;), you agree to be bound by these Terms of Service. If you do not agree, do not use the Service.
          </Section>

          <Section title="2. Eligibility">
            You must be at least 18 years old to use the Service. By using the Service, you represent that you meet this requirement and have the legal capacity to enter into a binding agreement.
          </Section>

          <Section title="3. Authorized use only — CRITICAL">
            <p>CyberMind is an offensive security tool. <strong>You may only use it against systems, networks, applications, and accounts that you own or have explicit, written authorization to test.</strong></p>
            <p>Authorized uses include:</p>
            <ul>
              <li>Security research on systems you own</li>
              <li>Penetration testing with a signed scope-of-work or written permission from the system owner</li>
              <li>CTF (Capture the Flag) competitions on designated challenge infrastructure</li>
              <li>Cybersecurity education in controlled lab environments</li>
              <li>Bug bounty programs within the defined scope published by the program owner</li>
            </ul>
            <p><strong>Prohibited uses include, but are not limited to:</strong></p>
            <ul>
              <li>Unauthorized access to any computer system, network, or account</li>
              <li>Disruption of services (DoS/DDoS) against any target</li>
              <li>Credential stuffing, brute force, or enumeration against systems you do not own</li>
              <li>Exfiltration of data from unauthorized systems</li>
              <li>Using the Service to facilitate any criminal activity</li>
              <li>Reselling or redistributing AI responses for commercial purposes without authorization</li>
            </ul>
            <p>Violation of this section may result in immediate account termination and may be reported to law enforcement.</p>
          </Section>

          <Section title="4. Account responsibilities">
            <ul>
              <li>You are responsible for all activity that occurs under your account and API keys.</li>
              <li>You must keep your credentials and API keys confidential. Do not share keys outside your authorized team or devices.</li>
              <li>You must promptly revoke compromised keys via the dashboard.</li>
              <li>You must provide accurate information during registration.</li>
              <li>One account per person. Creating multiple accounts to circumvent plan limits is prohibited.</li>
            </ul>
          </Section>

          <Section title="5. Plans, payments, and refunds">
            <ul>
              <li>Free plan features are provided at no cost and may be modified or discontinued at any time.</li>
              <li>Paid plans are billed in advance (monthly or annually) via Razorpay.</li>
              <li>Plan upgrades take effect immediately after payment confirmation via webhook.</li>
              <li>Refunds are not provided for partial billing periods. If you experience a billing error, contact us within 7 days.</li>
              <li>We reserve the right to change pricing with 30 days notice to existing subscribers.</li>
            </ul>
          </Section>

          <Section title="6. API usage and rate limits">
            <ul>
              <li>API usage is subject to the daily and monthly limits of your plan.</li>
              <li>Automated abuse of the API (e.g., scripted flooding, key sharing across organizations) is prohibited.</li>
              <li>We reserve the right to throttle or suspend accounts that abuse the API.</li>
            </ul>
          </Section>

          <Section title="7. Intellectual property">
            <p>The CyberMind CLI software, website, documentation, and brand assets are owned by Chandan Pandey and protected by applicable intellectual property laws.</p>
            <p>AI-generated responses are provided for your use but we make no claim of copyright over them. You are responsible for how you use AI-generated content.</p>
          </Section>

          <Section title="8. Disclaimer of warranties">
            THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, OR SECURE.
          </Section>

          <Section title="9. Limitation of liability">
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, CYBERMIND AND ITS OPERATORS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, EXEMPLARY, OR PUNITIVE DAMAGES, INCLUDING LOSS OF PROFITS, DATA, OR GOODWILL, ARISING FROM YOUR USE OR INABILITY TO USE THE SERVICE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
          </Section>

          <Section title="10. Indemnification">
            You agree to indemnify, defend, and hold harmless CyberMind, its operators, and affiliates from any claims, damages, losses, liabilities, costs, and expenses (including legal fees) arising from your use of the Service, your violation of these Terms, or your violation of any third-party rights.
          </Section>

          <Section title="11. Termination">
            <p>We may suspend or terminate your account at any time for violation of these Terms, particularly Section 3 (Authorized use only), without prior notice.</p>
            <p>You may delete your account at any time via the dashboard or by contacting us. Account deletion is permanent and irreversible.</p>
          </Section>

          <Section title="12. Governing law">
            These Terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts of India.
          </Section>

          <Section title="13. Changes to these terms">
            We may update these Terms as the Service evolves. Material changes will be communicated via email or a notice on the website. Continued use after changes constitutes acceptance.
          </Section>

          <Section title="14. Contact">
            <p>For legal inquiries:</p>
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
