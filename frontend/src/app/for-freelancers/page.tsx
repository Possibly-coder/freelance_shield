import PageShell from "@/components/PageShell";
import Link from "next/link";
import { ShieldCheck, Timer, DollarSign, Briefcase, Star, Lock } from "lucide-react";

export default function ForFreelancersPage() {
  return (
    <PageShell>
      <div className="text-center mb-16">
        <p className="text-sm font-semibold text-emerald-600 tracking-widest uppercase mb-3">For freelancers</p>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
          Never chase a payment again
        </h1>
        <p className="text-lg text-[#6B6560] max-w-2xl mx-auto">
          Your work has value. FreelanceShield makes sure you get paid for it -- on time, every time.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-5 mb-16">
        {[
          { icon: Lock, title: "Money locked before you start", desc: "The client funds each milestone into escrow before you write a single line of code or push a single pixel. You can see the money is there. It's real. It's committed." },
          { icon: Timer, title: "Auto-release if client ghosts", desc: "Submitted your work but the client went silent? The auto-release timer ensures funds are transferred to you automatically. No chasing, no begging, no waiting forever." },
          { icon: DollarSign, title: "1/10th the cost of Upwork", desc: "Upwork takes 10-20% of YOUR earnings. FreelanceShield charges 1-2% total. On a Rs 1,00,000 project, that's Rs 2,000 vs Rs 20,000. You keep more of what you earn." },
          { icon: Briefcase, title: "Find work on the project board", desc: "Browse open projects posted by clients, filter by your skills and budget range, and submit proposals. Or use FreelanceShield with clients you already have -- just send them an invite link." },
          { icon: Star, title: "Build your trust score", desc: "Every completed milestone, on-time delivery, and positive outcome increases your trust score. High-scoring freelancers get more visibility on the project board and more client trust." },
          { icon: ShieldCheck, title: "Dispute protection", desc: "If a client unfairly rejects your work, raise a dispute. Funds are frozen and the case is reviewed. You're never left without recourse." },
        ].map((feature) => (
          <div key={feature.title} className="card">
            <feature.icon className="w-8 h-8 text-emerald-600 mb-4" />
            <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
            <p className="text-[#6B6560] text-sm leading-relaxed">{feature.desc}</p>
          </div>
        ))}
      </div>

      <div className="glass p-10 text-center glow-blue">
        <h2 className="text-2xl font-bold mb-3">Ready to get paid what you deserve?</h2>
        <p className="text-[#6B6560] mb-6">Join the waitlist and be first to access FreelanceShield.</p>
        <Link href="/" className="btn-primary text-lg px-8 py-3">Join the Waitlist</Link>
      </div>
    </PageShell>
  );
}
