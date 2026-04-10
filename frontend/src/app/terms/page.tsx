import PageShell from "@/components/PageShell";

export default function TermsPage() {
  return (
    <PageShell>
      <div className="mb-12">
        <p className="text-sm font-semibold text-blue-400/80 tracking-widest uppercase mb-3">Legal</p>
        <h1 className="text-4xl font-extrabold tracking-tight mb-2">Terms of Service</h1>
        <p className="text-sm text-gray-500">Last updated: April 2026</p>
      </div>

      <div className="prose-custom space-y-8">
        <section>
          <h2>1. Acceptance of Terms</h2>
          <p>By accessing or using FreelanceShield (&quot;the Service&quot;), you agree to be bound by these Terms of Service. If you do not agree to these terms, do not use the Service.</p>
        </section>

        <section>
          <h2>2. Description of Service</h2>
          <p>FreelanceShield is a milestone-based payment escrow platform that facilitates secure payments between clients and freelancers. We provide:</p>
          <ul>
            <li>Contract creation with milestone-based payment schedules</li>
            <li>Escrow holding of funds via Razorpay until milestones are approved</li>
            <li>Auto-release timers for funds when clients do not respond within the agreed period</li>
            <li>Dispute resolution mechanisms</li>
            <li>A project board for discovering freelancers and clients</li>
          </ul>
          <p>FreelanceShield is a facilitator. We are not a party to the contracts between clients and freelancers.</p>
        </section>

        <section>
          <h2>3. User Accounts</h2>
          <ul>
            <li>You must provide accurate and complete information when creating an account.</li>
            <li>You are responsible for maintaining the security of your account credentials.</li>
            <li>You must be at least 18 years old to use the Service.</li>
            <li>One person may not maintain multiple accounts.</li>
          </ul>
        </section>

        <section>
          <h2>4. Escrow and Payments</h2>
          <ul>
            <li>When a client funds a milestone, the payment is held by FreelanceShield via Razorpay until the milestone is approved, disputed, or auto-released.</li>
            <li>FreelanceShield charges a transaction fee (1-2%) on each milestone release. The fee is deducted from the released amount.</li>
            <li>Auto-release timers are configured by the client at contract creation (3-30 days). If the client does not approve or dispute within this window, funds are automatically released to the freelancer.</li>
            <li>FreelanceShield is not a bank or financial institution. We facilitate payments through Razorpay&apos;s licensed payment infrastructure.</li>
          </ul>
        </section>

        <section>
          <h2>5. Disputes</h2>
          <ul>
            <li>Either party may raise a dispute on a milestone. Disputed funds are frozen until resolution.</li>
            <li>Both parties are expected to participate in good faith in the dispute resolution process.</li>
            <li>FreelanceShield&apos;s dispute resolution decisions are final for the purposes of fund release on the platform.</li>
            <li>Nothing in these terms prevents either party from pursuing legal remedies outside the platform.</li>
          </ul>
        </section>

        <section>
          <h2>6. Prohibited Conduct</h2>
          <p>You agree not to:</p>
          <ul>
            <li>Use the Service for illegal activities or money laundering</li>
            <li>Create fake accounts or misrepresent your identity</li>
            <li>Manipulate the trust score system through fraudulent transactions</li>
            <li>Circumvent the escrow system by arranging off-platform payments for on-platform contracts</li>
            <li>Harass, threaten, or abuse other users</li>
          </ul>
        </section>

        <section>
          <h2>7. Limitation of Liability</h2>
          <p>FreelanceShield is provided &quot;as is&quot; without warranties of any kind. We are not liable for:</p>
          <ul>
            <li>The quality of work delivered by freelancers</li>
            <li>The accuracy of information provided by clients or freelancers</li>
            <li>Losses arising from disputes between clients and freelancers</li>
            <li>Payment processing delays caused by Razorpay or banking systems</li>
          </ul>
          <p>Our total liability to you shall not exceed the fees you paid to FreelanceShield in the 12 months preceding the claim.</p>
        </section>

        <section>
          <h2>8. Termination</h2>
          <p>We may suspend or terminate your account if you violate these terms. You may delete your account at any time. Active contracts and escrowed funds will be handled according to their existing terms before account closure.</p>
        </section>

        <section>
          <h2>9. Changes to Terms</h2>
          <p>We may update these terms from time to time. We will notify registered users of significant changes via email. Continued use of the Service after changes constitutes acceptance.</p>
        </section>

        <section>
          <h2>10. Governing Law</h2>
          <p>These terms are governed by the laws of India. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts in Bangalore, India.</p>
        </section>

        <section>
          <h2>11. Contact</h2>
          <p>For questions about these terms, email us at hello@freelanceshield.com.</p>
        </section>
      </div>
    </PageShell>
  );
}
