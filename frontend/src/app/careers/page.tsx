import PageShell from "@/components/PageShell";
import Link from "next/link";
import { Rocket } from "lucide-react";

export default function CareersPage() {
  return (
    <PageShell>
      <div className="text-center mb-16">
        <p className="text-sm font-semibold text-blue-400/80 tracking-widest uppercase mb-3">Careers</p>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">Join the mission</h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
          We&apos;re building the payment infrastructure for the global freelance economy. Want to help?
        </p>
      </div>

      <div className="card text-center py-16 mb-12">
        <Rocket className="w-14 h-14 text-gray-700 mx-auto mb-6" />
        <h2 className="text-2xl font-bold mb-3">No open positions right now</h2>
        <p className="text-gray-400 max-w-md mx-auto mb-6">
          We&apos;re currently a solo-founder operation. As we grow, we&apos;ll be looking for passionate people who care about fixing freelance payments.
        </p>
        <p className="text-gray-500 text-sm mb-8">
          Interested in joining early? Reach out anyway -- we love talking to motivated people.
        </p>
        <Link href="/contact" className="btn-primary">Get in Touch</Link>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-6 text-center">What we&apos;ll look for when we hire</h2>
        <div className="grid md:grid-cols-3 gap-5">
          {[
            { title: "Builders", desc: "People who ship. Not people who plan to ship. If you've built something and put it in front of users, we want to talk." },
            { title: "Empathy for users", desc: "Our users are freelancers and small business owners. Understanding their daily frustrations is more important than any technical skill." },
            { title: "Ownership", desc: "We don't micromanage. You own your work end-to-end. That means deciding what to build, building it, and making sure it actually works." },
          ].map((trait) => (
            <div key={trait.title} className="card">
              <h3 className="font-semibold text-lg mb-2">{trait.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{trait.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
