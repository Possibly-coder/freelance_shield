import PageShell from "@/components/PageShell";
import Link from "next/link";
import { Check, Zap, Building, Crown } from "lucide-react";

export default function PricingPage() {
  return (
    <PageShell>
      <div className="text-center mb-16">
        <p className="text-sm font-semibold text-blue-400/80 tracking-widest uppercase mb-3">Pricing</p>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">Simple, transparent pricing</h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
          No monthly fees. No hidden charges. You only pay when money moves.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-5 mb-16">
        {/* Starter */}
        <div className="card">
          <div className="mb-6">
            <Zap className="w-8 h-8 text-blue-400 mb-3" />
            <h3 className="text-xl font-bold mb-1">Starter</h3>
            <p className="text-sm text-gray-500">For individual freelancers and clients</p>
          </div>
          <div className="mb-6">
            <span className="text-4xl font-extrabold">1.5%</span>
            <span className="text-gray-500 ml-1">per transaction</span>
          </div>
          <ul className="space-y-3 mb-8">
            {[
              "Up to 5 active contracts",
              "Milestone-based escrow",
              "Auto-release timers",
              "Dispute resolution",
              "Email notifications",
            ].map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-gray-300">
                <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                {f}
              </li>
            ))}
          </ul>
          <Link href="/" className="btn-secondary w-full text-center block">Join Waitlist</Link>
        </div>

        {/* Pro */}
        <div className="card relative border-blue-500/30">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full">
            Most Popular
          </div>
          <div className="mb-6">
            <Building className="w-8 h-8 text-blue-400 mb-3" />
            <h3 className="text-xl font-bold mb-1">Pro</h3>
            <p className="text-sm text-gray-500">For agencies and growing teams</p>
          </div>
          <div className="mb-6">
            <span className="text-4xl font-extrabold">1%</span>
            <span className="text-gray-500 ml-1">per transaction</span>
          </div>
          <ul className="space-y-3 mb-8">
            {[
              "Unlimited active contracts",
              "Everything in Starter",
              "Team members (up to 10)",
              "Priority dispute resolution",
              "Contract templates",
              "Payment analytics dashboard",
            ].map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-gray-300">
                <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                {f}
              </li>
            ))}
          </ul>
          <Link href="/" className="btn-primary w-full text-center block">Join Waitlist</Link>
        </div>

        {/* Enterprise */}
        <div className="card">
          <div className="mb-6">
            <Crown className="w-8 h-8 text-amber-400 mb-3" />
            <h3 className="text-xl font-bold mb-1">Enterprise</h3>
            <p className="text-sm text-gray-500">For large organizations</p>
          </div>
          <div className="mb-6">
            <span className="text-4xl font-extrabold">Custom</span>
          </div>
          <ul className="space-y-3 mb-8">
            {[
              "Volume-based pricing",
              "Everything in Pro",
              "Unlimited team members",
              "Dedicated account manager",
              "Custom integrations (API)",
              "SLA and compliance support",
              "White-label option",
            ].map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-gray-300">
                <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                {f}
              </li>
            ))}
          </ul>
          <Link href="/contact" className="btn-secondary w-full text-center block">Contact Us</Link>
        </div>
      </div>

      {/* FAQ */}
      <div>
        <h2 className="text-2xl font-bold mb-8 text-center">Frequently asked questions</h2>
        <div className="space-y-4">
          {[
            { q: "Who pays the transaction fee?", a: "By default, the fee is deducted from the payment when funds are released. The client pays the full milestone amount, and the freelancer receives the amount minus the small platform fee." },
            { q: "Are there any monthly or setup fees?", a: "No. FreelanceShield is completely free to use. You only pay the transaction fee when money is actually released from escrow." },
            { q: "What payment methods are supported?", a: "We support all Razorpay payment methods including UPI, credit/debit cards, net banking, and wallets. International payments via cards are also supported." },
            { q: "Can I use FreelanceShield for international clients?", a: "Yes. While we're India-first with Razorpay, international clients can pay using credit/debit cards in multiple currencies." },
            { q: "What happens to the fee if there's a refund?", a: "If a milestone is refunded before work begins, there's no fee. If a dispute is resolved in favor of the client, the escrowed amount is returned in full." },
          ].map((faq) => (
            <div key={faq.q} className="card">
              <h3 className="font-semibold text-white mb-2">{faq.q}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
