import PageShell from "@/components/PageShell";

export default function PrivacyPage() {
  return (
    <PageShell>
      <div className="mb-12">
        <p className="text-sm font-semibold text-blue-600 tracking-widest uppercase mb-3">Legal</p>
        <h1 className="text-4xl font-extrabold tracking-tight mb-2">Privacy Policy</h1>
        <p className="text-sm text-[#9C9690]">Last updated: April 2026</p>
      </div>

      <div className="prose-custom space-y-8">
        <section>
          <h2>1. Information We Collect</h2>
          <p>When you use FreelanceShield, we collect the following information:</p>
          <ul>
            <li><strong>Account information:</strong> Name, email address, phone number, and role (client/freelancer) when you create an account or join the waitlist.</li>
            <li><strong>Payment information:</strong> We do not store your credit card or bank details. All payment processing is handled securely by Razorpay. We store transaction references and escrow states.</li>
            <li><strong>Contract data:</strong> Milestones, deliverable descriptions, payment amounts, and dispute details you create on the platform.</li>
            <li><strong>Usage data:</strong> Pages visited, features used, browser type, and device information for improving our service.</li>
          </ul>
        </section>

        <section>
          <h2>2. How We Use Your Information</h2>
          <ul>
            <li>To provide the escrow and payment services you signed up for</li>
            <li>To calculate trust scores based on your payment and delivery history</li>
            <li>To send transactional emails (contract invites, payment notifications, dispute alerts)</li>
            <li>To improve our product and user experience</li>
            <li>To comply with legal and regulatory obligations</li>
          </ul>
        </section>

        <section>
          <h2>3. Information Sharing</h2>
          <p>We do not sell your personal data. We share information only in these cases:</p>
          <ul>
            <li><strong>With Razorpay:</strong> To process payments and transfers securely.</li>
            <li><strong>With your counterparty:</strong> When you create a contract, your name and email are visible to the other party.</li>
            <li><strong>Trust scores:</strong> Your trust score and aggregated performance metrics (on-time delivery rate, payment speed) are visible to other users on the platform.</li>
            <li><strong>Legal requirements:</strong> If required by law, court order, or government regulation.</li>
          </ul>
        </section>

        <section>
          <h2>4. Data Security</h2>
          <p>We use industry-standard security measures including 256-bit SSL encryption for all data in transit, encrypted database storage, and secure authentication via JWT tokens. Payment data is handled entirely by Razorpay&apos;s PCI DSS-compliant infrastructure.</p>
        </section>

        <section>
          <h2>5. Data Retention</h2>
          <p>We retain your account data for as long as your account is active. Contract and payment records are retained for 7 years to comply with financial record-keeping regulations. You can request deletion of your account by contacting us at hello@freelanceshield.com.</p>
        </section>

        <section>
          <h2>6. Your Rights</h2>
          <p>You have the right to access, correct, or delete your personal data. You can also withdraw consent for marketing communications at any time. Contact us at hello@freelanceshield.com for any privacy-related requests.</p>
        </section>

        <section>
          <h2>7. Contact</h2>
          <p>For questions about this privacy policy, email us at hello@freelanceshield.com.</p>
        </section>
      </div>
    </PageShell>
  );
}
