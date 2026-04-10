import PageShell from "@/components/PageShell";
import { Shield, Target, Eye, Heart } from "lucide-react";

export default function AboutPage() {
  return (
    <PageShell>
      <div className="text-center mb-16">
        <p className="text-sm font-semibold text-blue-400/80 tracking-widest uppercase mb-3">About us</p>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">We&apos;re fixing freelance payments</h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
          FreelanceShield was born from frustration. We got scammed -- as a client and as a freelancer -- and decided no one else should have to.
        </p>
      </div>

      {/* Origin Story */}
      <div className="card mb-12">
        <h2 className="text-xl font-bold mb-4">The story</h2>
        <div className="space-y-4 text-gray-400 leading-relaxed">
          <p>
            It started with two bad experiences. First, we hired a freelance developer and paid Rs 50,000 upfront. They delivered one screen and disappeared. No refund, no reply, no recourse.
          </p>
          <p>
            Then we freelanced for a startup. Built an entire dashboard. Delivered everything on time. &quot;Payment will come next Friday.&quot; That Friday never came. Four months of chasing, zero rupees received.
          </p>
          <p>
            We looked for solutions. Upwork has escrow, but it takes 20% and forces both sides into their marketplace. Bank transfers have zero protection. Contracts are useless without the money to enforce them.
          </p>
          <p>
            So we built FreelanceShield -- a simple payment protection layer that works with any freelancer and any client. Milestone-based escrow powered by Razorpay. Auto-release timers so money never gets stuck. Trust scores based on real behavior.
          </p>
          <p className="text-gray-300 font-medium">
            Our mission: make &quot;getting paid&quot; the boring, automatic part of freelancing -- not the stressful part.
          </p>
        </div>
      </div>

      {/* Values */}
      <div className="grid md:grid-cols-3 gap-5 mb-12">
        {[
          { icon: Target, title: "Fairness first", desc: "We protect both sides equally. Freelancers shouldn't work for free. Clients shouldn't pay for nothing. The system enforces fairness." },
          { icon: Eye, title: "Radical transparency", desc: "No hidden fees. No surprise charges. Both parties see exactly where the money is at all times. The escrow state is always visible." },
          { icon: Heart, title: "India-first, global next", desc: "We're building for the 23 million freelancers in India first, with UPI and Razorpay native. Then expanding globally." },
        ].map((value) => (
          <div key={value.title} className="card">
            <value.icon className="w-8 h-8 text-blue-400 mb-4" />
            <h3 className="font-semibold text-lg mb-2">{value.title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">{value.desc}</p>
          </div>
        ))}
      </div>

      {/* Numbers */}
      <div className="glass p-10 text-center">
        <h2 className="text-xl font-bold mb-8">FreelanceShield in numbers</h2>
        <div className="grid grid-cols-3 gap-6">
          {[
            { value: "23M+", label: "Freelancers in India" },
            { value: "1-2%", label: "Transaction fee" },
            { value: "Rs 0", label: "Monthly subscription" },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-3xl font-extrabold text-gradient">{stat.value}</p>
              <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
