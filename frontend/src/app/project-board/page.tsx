import PageShell from "@/components/PageShell";
import Link from "next/link";
import { Search, Briefcase, Send, CheckCircle, Users, DollarSign } from "lucide-react";

export default function ProjectBoardPage() {
  return (
    <PageShell>
      <div className="text-center mb-16">
        <p className="text-sm font-semibold text-blue-600 tracking-widest uppercase mb-3">Project board</p>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
          Find work. Hire talent.<br />
          <span className="text-gradient">Every payment protected.</span>
        </h1>
        <p className="text-lg text-[#6B6560] max-w-2xl mx-auto">
          Unlike other job boards, every project on FreelanceShield comes with built-in escrow. When you get hired, your payment is already secured.
        </p>
      </div>

      {/* How the board works */}
      <div className="grid md:grid-cols-2 gap-5 mb-16">
        <div>
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            For Clients
          </h2>
          <div className="space-y-4">
            {[
              { icon: Briefcase, title: "Post your project", desc: "Describe what you need, set your budget range, required skills, and timeline." },
              { icon: Search, title: "Review proposals", desc: "Freelancers apply with their rate, estimated timeline, and a cover letter. Compare and pick the best fit." },
              { icon: CheckCircle, title: "Accept and start", desc: "When you accept a proposal, a contract with escrow is automatically created. Fund the first milestone and work begins." },
            ].map((step, i) => (
              <div key={i} className="card flex items-start gap-4">
                <step.icon className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-sm mb-1">{step.title}</h3>
                  <p className="text-[#9C9690] text-sm">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-600" />
            For Freelancers
          </h2>
          <div className="space-y-4">
            {[
              { icon: Search, title: "Browse open projects", desc: "Filter by skill, budget range, and duration. Find projects that match your expertise." },
              { icon: Send, title: "Submit a proposal", desc: "Write a quick pitch, set your rate, and estimate the timeline. Stand out with your trust score." },
              { icon: CheckCircle, title: "Get hired with escrow", desc: "When accepted, the contract is auto-created with your proposed amount already in escrow. Start working with confidence." },
            ].map((step, i) => (
              <div key={i} className="card flex items-start gap-4">
                <step.icon className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-sm mb-1">{step.title}</h3>
                  <p className="text-[#9C9690] text-sm">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mock preview */}
      <div className="card p-0 overflow-hidden mb-16">
        <div className="px-6 py-4 border-b border-[#E8E5DF] flex items-center justify-between">
          <h3 className="font-semibold">Sample Open Projects</h3>
          <span className="text-xs text-[#9C9690]">Preview -- live board available at launch</span>
        </div>
        {[
          { title: "Build a Restaurant Ordering App", skills: ["React", "Node.js", "PostgreSQL"], budget: "25,000 - 50,000", proposals: 8 },
          { title: "Logo and Brand Identity Design", skills: ["Figma", "Graphic Design"], budget: "8,000 - 15,000", proposals: 12 },
          { title: "Shopify Store Setup + Custom Theme", skills: ["Shopify", "CSS", "JavaScript"], budget: "15,000 - 30,000", proposals: 5 },
        ].map((project, i) => (
          <div key={i} className="px-6 py-4 border-b border-[#E8E5DF]/60 hover:bg-[#FAFAF8] transition-colors">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-[#1A1A1A]">{project.title}</h4>
              <span className="text-sm text-[#9C9690]">INR {project.budget}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                {project.skills.map((s) => (
                  <span key={s} className="text-xs bg-white border border-[#E8E5DF] text-[#6B6560] px-2 py-0.5 rounded-full">{s}</span>
                ))}
              </div>
              <span className="text-xs text-[#C4BFB8]">{project.proposals} proposals</span>
            </div>
          </div>
        ))}
      </div>

      <div className="glass p-10 text-center glow-blue">
        <h2 className="text-2xl font-bold mb-3">The project board launches soon</h2>
        <p className="text-[#6B6560] mb-6">Join the waitlist to get early access when we go live.</p>
        <Link href="/" className="btn-primary text-lg px-8 py-3">Join the Waitlist</Link>
      </div>
    </PageShell>
  );
}
