import PageShell from "@/components/PageShell";
import { Briefcase, Lock, Zap, CheckCircle, Timer, ShieldCheck, AlertTriangle } from "lucide-react";

export default function HowItWorksPage() {
  return (
    <PageShell>
      <div className="text-center mb-16">
        <p className="text-sm font-semibold text-blue-600 tracking-widest uppercase mb-3">How it works</p>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">Payments that protect both sides</h1>
        <p className="text-lg text-[#6B6560] max-w-2xl mx-auto">
          FreelanceShield uses milestone-based escrow to ensure freelancers get paid and clients get delivery. Every time.
        </p>
      </div>

      {/* Steps */}
      <div className="space-y-8 mb-20">
        {[
          { step: "1", icon: Briefcase, color: "from-blue-500 to-blue-600", title: "Client creates a contract", desc: "Define the project scope, break it into milestones, and set payment amounts for each. Share an invite link with your freelancer -- they can be someone you found on LinkedIn, Twitter, a referral, or our built-in project board." },
          { step: "2", icon: Lock, color: "from-violet-500 to-violet-600", title: "Fund milestones into escrow", desc: "Before work begins, the client funds the milestone via Razorpay. The money is held securely -- the freelancer can see it's locked, but neither party can touch it until the milestone is complete." },
          { step: "3", icon: Zap, color: "from-amber-500 to-amber-600", title: "Freelancer delivers work", desc: "The freelancer completes the work and submits their deliverables through the platform. The client is notified to review. A configurable auto-release timer starts counting down." },
          { step: "4", icon: CheckCircle, color: "from-emerald-500 to-emerald-600", title: "Client approves, money releases", desc: "If the work is good, the client approves and funds are instantly transferred to the freelancer. The milestone is marked complete. Both sides move to the next one." },
        ].map((s) => (
          <div key={s.step} className="card flex items-start gap-6">
            <div className={`w-14 h-14 bg-gradient-to-br ${s.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
              <s.icon className="w-6 h-6 text-[#1A1A1A]" />
            </div>
            <div>
              <div className="text-xs text-[#C4BFB8] font-mono mb-1">Step {s.step}</div>
              <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">{s.title}</h3>
              <p className="text-[#6B6560] leading-relaxed">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* What if things go wrong */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-8 text-center">What if things go wrong?</h2>
        <div className="grid md:grid-cols-2 gap-5">
          <div className="card border-t-2 border-t-amber-500/40">
            <Timer className="w-8 h-8 text-amber-600 mb-3" />
            <h3 className="font-semibold text-lg mb-2">Client doesn&apos;t respond?</h3>
            <p className="text-[#6B6560] text-sm leading-relaxed">
              Every milestone has an auto-release timer (3-30 days, set by the client). If the client doesn&apos;t approve or raise a dispute before it expires, funds automatically release to the freelancer. No money stuck in limbo.
            </p>
          </div>
          <div className="card border-t-2 border-t-red-500/40">
            <AlertTriangle className="w-8 h-8 text-red-600 mb-3" />
            <h3 className="font-semibold text-lg mb-2">Disagreement on quality?</h3>
            <p className="text-[#6B6560] text-sm leading-relaxed">
              Either party can raise a dispute. Funds are frozen immediately. Both sides present their case. The dispute is resolved through the platform, and funds are released to the rightful party.
            </p>
          </div>
          <div className="card border-t-2 border-t-emerald-500/40">
            <ShieldCheck className="w-8 h-8 text-emerald-600 mb-3" />
            <h3 className="font-semibold text-lg mb-2">Freelancer disappears?</h3>
            <p className="text-[#6B6560] text-sm leading-relaxed">
              If the freelancer doesn&apos;t submit work, the client can cancel the milestone and get a full refund of the escrowed amount. Your money is always protected.
            </p>
          </div>
          <div className="card border-t-2 border-t-blue-500/40">
            <Lock className="w-8 h-8 text-blue-600 mb-3" />
            <h3 className="font-semibold text-lg mb-2">Is my money safe?</h3>
            <p className="text-[#6B6560] text-sm leading-relaxed">
              All payments are processed through Razorpay, India&apos;s leading payment gateway. Funds are held in a secure escrow state with 256-bit SSL encryption. We never touch your money directly.
            </p>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
