import PageShell from "@/components/PageShell";

export default function RefundPolicyPage() {
  return (
    <PageShell>
      <div className="mb-12">
        <p className="text-sm font-semibold text-blue-400/80 tracking-widest uppercase mb-3">Legal</p>
        <h1 className="text-4xl font-extrabold tracking-tight mb-2">Refund Policy</h1>
        <p className="text-sm text-gray-500">Last updated: April 2026</p>
      </div>

      <div className="prose-custom space-y-8">
        <section>
          <h2>Overview</h2>
          <p>FreelanceShield uses an escrow model for all payments. This means your money is protected at every stage. Here&apos;s how refunds work in different scenarios:</p>
        </section>

        <section>
          <h2>1. Milestone Not Yet Started</h2>
          <p>If a milestone has been funded but the freelancer has not yet started work, the client can cancel the milestone and receive a <strong>full refund</strong> of the escrowed amount. No platform fee is charged.</p>
        </section>

        <section>
          <h2>2. Freelancer Does Not Deliver</h2>
          <p>If a freelancer fails to submit work within the agreed timeline, the client can:</p>
          <ul>
            <li>Cancel the milestone for a full refund</li>
            <li>Raise a dispute to formally document the non-delivery</li>
          </ul>
          <p>In both cases, the escrowed funds are returned to the client in full.</p>
        </section>

        <section>
          <h2>3. Dispute Resolution</h2>
          <p>If a dispute is raised and resolved in favor of the client, the escrowed funds for that milestone are refunded to the client. If resolved in favor of the freelancer, the funds are released to the freelancer.</p>
        </section>

        <section>
          <h2>4. After Milestone Approval</h2>
          <p>Once a client approves a milestone and funds are released to the freelancer, the payment is <strong>final and non-refundable</strong> through our platform. By approving, the client confirms satisfaction with the delivered work.</p>
        </section>

        <section>
          <h2>5. Auto-Released Payments</h2>
          <p>If funds are auto-released due to the client not responding within the configured auto-release window (3-30 days), the payment is treated as approved. The client had the opportunity to review and dispute but chose not to act. Auto-released payments are <strong>non-refundable</strong>.</p>
        </section>

        <section>
          <h2>6. Platform Fees</h2>
          <p>The FreelanceShield platform fee (1-2%) is deducted only when funds are released to the freelancer. If a milestone is refunded before release, no platform fee is charged. Platform fees on completed transactions are non-refundable.</p>
        </section>

        <section>
          <h2>7. Processing Time</h2>
          <p>Refunds are processed through Razorpay. The timeline depends on your payment method:</p>
          <ul>
            <li><strong>UPI:</strong> Instant to 24 hours</li>
            <li><strong>Credit/Debit cards:</strong> 5-7 business days</li>
            <li><strong>Net banking:</strong> 5-7 business days</li>
            <li><strong>Wallets:</strong> Instant to 24 hours</li>
          </ul>
        </section>

        <section>
          <h2>8. Contact</h2>
          <p>For refund-related questions or issues, email us at hello@freelanceshield.com. Include your contract ID and milestone details for faster resolution.</p>
        </section>
      </div>
    </PageShell>
  );
}
