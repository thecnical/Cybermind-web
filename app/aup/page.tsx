import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Acceptable Use Policy",
  description: "CyberMind CLI acceptable use policy — ethical hacking only, authorized targets, and prohibited activities.",
};

const EFFECTIVE_DATE = "April 9, 2026";
const CONTACT_EMAIL  = "legal@cybermind.thecnical.dev";

export default function AUPPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto w-full max-w-3xl px-5 pb-24 pt-28 md:px-8">
        <div className="mb-10">
          <p className="font-mono text-xs uppercase tracking-[0.32em] text-[var(--accent-cyan)]">Legal</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white">Acceptable Use Policy</h1>
          <p className="mt-3 text-sm text-[var(--text-soft)]">Effective date: {EFFECTIVE_DATE}</p>
          <div className="mt-5 rounded-2xl border border-[#FF4444]/30 bg-[#FF4444]/5 px-5 py-4">
            <p className="text-sm font-semibold text-white">⚠ Important</p>
            <p className="mt-1 text-sm text-[var(--text-soft)]">
              CyberMind is an offensive security tool. Misuse against unauthorized targets is illegal and will result in immediate account termination and potential law enforcement referral.
            </p>
          </div>
        </div>

        <div className="prose-legal">
          <Section title="1. Purpose">
            This Acceptable Use Policy (&quot;AUP&quot;) defines the boundaries of lawful and ethical use of CyberMind CLI, its API, dashboard, and all associated services. This policy exists because CyberMind provides powerful offensive security capabilities — including automated reconnaissance, vulnerability hunting, exploitation guidance, and post-exploitation tooling — that carry significant legal and ethical responsibilities.
          </Section>

          <Section title="2. The golden rule: authorization first">
            <p><strong>You must have explicit, documented authorization before running any CyberMind workflow against any target.</strong></p>
            <p>Authorization means one of the following:</p>
            <ul>
              <li>You own the target system, network, or application outright.</li>
              <li>You have a signed penetration testing agreement or statement of work from the system owner.</li>
              <li>You are participating in a bug bounty program and the target is within the published scope.</li>
              <li>You are working in a CTF competition on designated challenge infrastructure.</li>
              <li>You are using a controlled lab environment (e.g., HackTheBox, TryHackMe, your own VMs).</li>
            </ul>
            <p>Verbal permission is not sufficient. Written authorization is required for professional engagements.</p>
          </Section>

          <Section title="3. Permitted uses">
            <ul>
              <li><strong>Authorized penetration testing:</strong> Testing systems with written permission from the owner, within the agreed scope.</li>
              <li><strong>Bug bounty research:</strong> Testing within the published scope of a bug bounty program (HackerOne, Bugcrowd, etc.).</li>
              <li><strong>CTF competitions:</strong> Using CyberMind on CTF challenge machines and infrastructure.</li>
              <li><strong>Security education:</strong> Learning offensive security techniques in controlled lab environments.</li>
              <li><strong>Red team engagements:</strong> Authorized red team operations with a signed rules of engagement document.</li>
              <li><strong>Own infrastructure testing:</strong> Testing your own servers, applications, and networks.</li>
              <li><strong>Security research:</strong> Responsible disclosure research on systems you own or have authorization to test.</li>
            </ul>
          </Section>

          <Section title="4. Prohibited uses — zero tolerance">
            <p>The following uses are strictly prohibited and will result in immediate account termination:</p>
            <ul>
              <li><strong>Unauthorized access:</strong> Using CyberMind to access, probe, or attack any system, network, or account without explicit written authorization.</li>
              <li><strong>Denial of service:</strong> Using CyberMind to disrupt, degrade, or deny service to any target.</li>
              <li><strong>Credential attacks:</strong> Brute-forcing, credential stuffing, or password spraying against systems you do not own.</li>
              <li><strong>Data theft:</strong> Exfiltrating data from unauthorized systems.</li>
              <li><strong>Malware deployment:</strong> Using CyberMind to deploy, distribute, or execute malware on unauthorized systems.</li>
              <li><strong>Infrastructure attacks:</strong> Attacking critical infrastructure (power grids, hospitals, financial systems, government systems).</li>
              <li><strong>Harassment:</strong> Using CyberMind to target individuals, stalk, or harass.</li>
              <li><strong>Illegal surveillance:</strong> Unauthorized monitoring of communications or systems.</li>
              <li><strong>Bypassing security controls:</strong> Using CyberMind to bypass security controls on systems you are not authorized to test.</li>
              <li><strong>Resale of capabilities:</strong> Offering CyberMind as a service to third parties without authorization.</li>
              <li><strong>Account sharing:</strong> Sharing API keys across organizations or individuals to circumvent plan limits.</li>
            </ul>
          </Section>

          <Section title="5. Abhimanyu mode — additional restrictions">
            <p>Abhimanyu mode provides automated exploitation capabilities including SQLi, RCE, post-exploitation, lateral movement, and data exfiltration tooling. This mode carries heightened responsibility:</p>
            <ul>
              <li>Abhimanyu mode must only be used on systems where you have explicit written authorization for exploitation (not just scanning).</li>
              <li>Many penetration testing scopes authorize scanning but not exploitation — verify your scope before using Abhimanyu.</li>
              <li>Reverse shell generation and post-exploitation tools must only be used in authorized engagements.</li>
              <li>Session data saved by Abhimanyu mode must be stored securely and deleted after the engagement.</li>
            </ul>
          </Section>

          <Section title="6. Responsible disclosure">
            <p>If you discover a vulnerability in a third-party system during authorized testing:</p>
            <ul>
              <li>Do not exploit the vulnerability beyond what is necessary to confirm its existence.</li>
              <li>Report the vulnerability to the system owner or their bug bounty program promptly.</li>
              <li>Do not publicly disclose the vulnerability before the owner has had a reasonable opportunity to remediate it (typically 90 days).</li>
              <li>Do not access, copy, or exfiltrate data beyond what is necessary to demonstrate the vulnerability.</li>
            </ul>
          </Section>

          <Section title="7. Legal compliance">
            <p>You are solely responsible for ensuring your use of CyberMind complies with all applicable laws in your jurisdiction, including but not limited to:</p>
            <ul>
              <li>Computer Fraud and Abuse Act (CFAA) — United States</li>
              <li>Computer Misuse Act — United Kingdom</li>
              <li>Information Technology Act, Section 66 — India</li>
              <li>EU Network and Information Security (NIS2) Directive</li>
              <li>Any other applicable national or regional cybercrime laws</li>
            </ul>
            <p>Ignorance of the law is not a defense. If you are unsure whether a specific use is lawful, consult a legal professional before proceeding.</p>
          </Section>

          <Section title="8. Enforcement">
            <p>We reserve the right to:</p>
            <ul>
              <li>Suspend or terminate accounts that violate this AUP without prior notice.</li>
              <li>Report violations to law enforcement authorities.</li>
              <li>Cooperate with law enforcement investigations involving misuse of CyberMind.</li>
              <li>Pursue civil remedies for damages caused by AUP violations.</li>
            </ul>
            <p>We monitor for abuse patterns including unusual API usage, suspicious request patterns, and reports from third parties.</p>
          </Section>

          <Section title="9. Reporting violations">
            <p>If you believe someone is using CyberMind in violation of this AUP, or if you have been targeted by a CyberMind user, please report it immediately:</p>
            <p><strong>Email:</strong> <a href="mailto:abuse@cybermind.thecnical.dev">abuse@cybermind.thecnical.dev</a></p>
            <p>Include as much detail as possible: timestamps, IP addresses, affected systems, and any evidence of the attack.</p>
          </Section>

          <Section title="10. Contact">
            <p>For questions about this policy:</p>
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
