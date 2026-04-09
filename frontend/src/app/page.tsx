"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Shield, Lock, CheckCircle, ArrowRight, Briefcase,
  AlertTriangle, IndianRupee, Users, Zap, Timer,
  ShieldCheck, Globe, Fingerprint, Check, Minus,
  Mail, MessageCircle, Code
} from "lucide-react";
import api from "@/lib/api";

export default function Home() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("both");
  const [submitted, setSubmitted] = useState(false);
  const [position, setPosition] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [totalSignups, setTotalSignups] = useState(0);

  useEffect(() => {
    api.get("/waitlist/count").then((res) => setTotalSignups(res.data.count)).catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/waitlist/", { email, name: name || null, role });
      setPosition(res.data.position);
      setTotalSignups(res.data.position);
      setSubmitted(true);
    } catch (err: unknown) {
      const detail = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
      setError(detail || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">

      {/* Background effects */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[#050a18]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-[radial-gradient(ellipse_at_center,rgba(37,99,235,0.08)_0%,transparent_70%)]" />
        <div className="absolute bottom-0 left-1/4 w-[600px] h-[400px] bg-[radial-gradient(ellipse_at_center,rgba(52,211,153,0.04)_0%,transparent_70%)]" />
      </div>

      {/* Dot grid pattern behind hero */}
      <div className="absolute inset-0 -z-5 opacity-[0.03]"
        style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

      {/* ===== NAV ===== */}
      <nav className="relative z-10 max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
            <Shield className="w-4.5 h-4.5 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight">FreelanceShield</span>
        </div>
        <div className="flex items-center gap-6">
          {totalSignups > 0 && (
            <div className="hidden md:flex items-center gap-2 text-sm text-gray-500">
              <div className="flex -space-x-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500/30 to-emerald-500/30 border-2 border-[#050a18]" />
                ))}
              </div>
              <span><span className="text-gray-300 font-medium">{totalSignups}+</span> on waitlist</span>
            </div>
          )}
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Lock className="w-3 h-3" />
            <span>Secured by Razorpay</span>
          </div>
        </div>
      </nav>

      {/* ===== HERO ===== */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pt-16 md:pt-24 pb-20 text-center">
        <div className="animate-fade-in-up">
          <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full glass text-sm text-gray-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-soft" />
            Launching soon -- join the early access list
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-[1.05] mb-8">
            Stop losing money
            <br />
            <span className="text-gradient">to broken promises.</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-14 leading-relaxed">
            FreelanceShield locks payments in escrow until milestones are delivered and approved.
            Freelancers get guaranteed pay. Clients get guaranteed work.
          </p>
        </div>

        {/* Waitlist Form */}
        <div className="animate-fade-in-up delay-200">
          {submitted ? (
            <div className="max-w-md mx-auto glass p-8 glow-blue">
              <CheckCircle className="w-14 h-14 text-emerald-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">You&apos;re in!</h3>
              <p className="text-gray-400 mb-1">You&apos;re #{position} on the waitlist.</p>
              <p className="text-sm text-gray-500">We&apos;ll email you the moment we launch.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="max-w-lg mx-auto glass p-8 glow-blue">
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-lg mb-4">
                  {error}
                </div>
              )}
              <div className="flex flex-col gap-3">
                <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                  placeholder="Your name (optional)"
                  className="input-field text-center" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  className="input-field text-center text-lg" required />
                <div className="flex gap-2 justify-center">
                  {[
                    { value: "client", label: "I hire freelancers" },
                    { value: "freelancer", label: "I'm a freelancer" },
                    { value: "both", label: "Both" },
                  ].map((opt) => (
                    <button key={opt.value} type="button" onClick={() => setRole(opt.value)}
                      className={`text-sm px-4 py-2 rounded-lg border transition-all duration-200 ${
                        role === opt.value
                          ? "bg-blue-600/20 border-blue-500/50 text-blue-300"
                          : "bg-transparent border-[#1a2744] text-gray-500 hover:border-gray-600 hover:text-gray-400"
                      }`}>
                      {opt.label}
                    </button>
                  ))}
                </div>
                <button type="submit" disabled={loading}
                  className="btn-primary text-lg py-3.5 flex items-center justify-center gap-2 w-full mt-1">
                  {loading ? "Joining..." : <>Join the Waitlist <ArrowRight className="w-5 h-5" /></>}
                </button>
              </div>
              <p className="text-xs text-gray-600 mt-4">No spam, ever. Just a single launch notification.</p>
            </form>
          )}
        </div>
      </section>

      {/* ===== TRUST BAR ===== */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 pb-20">
        <div className="flex flex-wrap justify-center gap-8 md:gap-14 text-sm text-gray-500">
          {[
            { icon: ShieldCheck, label: "Payments secured by Razorpay" },
            { icon: Fingerprint, label: "256-bit SSL encryption" },
            { icon: Lock, label: "Escrow-protected funds" },
            { icon: Globe, label: "Works globally" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2 animate-fade-in">
              <Icon className="w-4 h-4 text-gray-600" />
              <span>{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ===== PROBLEM STATS ===== */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 py-20">
        <p className="text-sm font-semibold text-blue-400/80 tracking-widest uppercase text-center mb-3">The problem</p>
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-14">Trust is broken on both sides</h2>
        <div className="grid md:grid-cols-3 gap-5">
          {[
            { value: "68%", color: "from-red-500/20 to-red-500/0", border: "border-t-red-500/40", icon: AlertTriangle, iconColor: "text-red-400", desc: "of freelancers have been ghosted after delivering work" },
            { value: "4.2L", color: "from-amber-500/20 to-amber-500/0", border: "border-t-amber-500/40", icon: IndianRupee, iconColor: "text-amber-400", desc: "average annual income lost by Indian freelancers to payment defaults" },
            { value: "73%", color: "from-blue-500/20 to-blue-500/0", border: "border-t-blue-500/40", icon: Users, iconColor: "text-blue-400", desc: "of businesses have paid a freelancer who then disappeared" },
          ].map((stat, i) => (
            <div key={i} className={`card border-t-2 ${stat.border} animate-fade-in-up`}
              style={{ animationDelay: `${i * 120}ms` }}>
              <div className={`absolute inset-0 bg-gradient-to-b ${stat.color} rounded-xl pointer-events-none`} />
              <div className="relative">
                <stat.icon className={`w-8 h-8 ${stat.iconColor} mb-4 opacity-80`} />
                <p className="text-4xl font-extrabold text-white mb-2">{stat.value}</p>
                <p className="text-sm text-gray-400 leading-relaxed">{stat.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== AUTO-RELEASE FEATURE ===== */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 py-20">
        <div className="card overflow-hidden border-blue-500/10 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.04] to-emerald-500/[0.02] pointer-events-none" />
          <div className="relative flex flex-col md:flex-row items-center gap-10 p-2">
            <div className="flex-1">
              <div className="inline-flex items-center gap-1.5 mb-4 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
                <ShieldCheck className="w-3 h-3" />
                Built-in protection
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-4 leading-snug">
                Client not responding?
                <br />
                <span className="text-gradient">You still get paid.</span>
              </h2>
              <p className="text-gray-400 mb-4 leading-relaxed">
                Every milestone has an auto-release timer. If the client doesn&apos;t approve
                or raise a dispute within the agreed window, escrowed funds are automatically
                released to the freelancer.
              </p>
              <p className="text-gray-500 text-sm">
                No more chasing. No more money stuck in limbo. The system enforces fairness.
              </p>
            </div>
            <div className="flex-shrink-0 w-72 animate-float">
              <div className="glass p-6 space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Homepage Redesign</span>
                  <span className="text-xs text-emerald-400 font-medium bg-emerald-500/10 px-2 py-0.5 rounded-full">submitted</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">INR 25,000</span>
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                </div>
                <div className="w-full bg-[#0a1128] rounded-full h-2 overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-500 to-emerald-400 h-2 rounded-full transition-all" style={{ width: "72%" }} />
                </div>
                <div className="flex items-center gap-2 text-amber-400 text-sm">
                  <div className="relative">
                    <Timer className="w-4 h-4" />
                    <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-amber-400 rounded-full animate-pulse-soft" />
                  </div>
                  <span className="font-medium">Auto-release in 3 days</span>
                </div>
                <div className="text-xs text-gray-600 pt-3 border-t border-[#1a2744]">
                  Client must approve or dispute before timer expires
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TRUST SCORES ===== */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 py-20">
        <p className="text-sm font-semibold text-blue-400/80 tracking-widest uppercase text-center mb-3">Trust scores</p>
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Know who you&apos;re working with</h2>
        <p className="text-gray-400 text-center mb-14 max-w-2xl mx-auto">
          Every client and freelancer earns a reputation score based on real behavior -- not just reviews.
        </p>

        <div className="grid md:grid-cols-2 gap-5">
          {/* Freelancer score card */}
          <div className="card relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.04] to-transparent pointer-events-none" />
            <div className="relative">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border border-emerald-500/20 flex items-center justify-center">
                    <span className="text-sm font-bold text-emerald-400">PS</span>
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm">Priya Sharma</p>
                    <p className="text-xs text-gray-500">Freelancer &middot; React Developer</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-extrabold text-emerald-400">9.4</p>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider">Trust Score</p>
                </div>
              </div>
              <div className="space-y-3">
                {[
                  { label: "On-time delivery", value: 96, color: "from-emerald-500 to-emerald-400" },
                  { label: "Milestone completion", value: 100, color: "from-blue-500 to-blue-400" },
                  { label: "Client satisfaction", value: 92, color: "from-violet-500 to-violet-400" },
                ].map((bar) => (
                  <div key={bar.label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-500">{bar.label}</span>
                      <span className="text-gray-400 font-medium">{bar.value}%</span>
                    </div>
                    <div className="w-full bg-[#050a18] rounded-full h-1.5">
                      <div className={`bg-gradient-to-r ${bar.color} h-1.5 rounded-full`} style={{ width: `${bar.value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-[#1a2744] flex items-center gap-4 text-xs text-gray-500">
                <span>12 contracts completed</span>
                <span>&middot;</span>
                <span>0 disputes</span>
                <span>&middot;</span>
                <span>Avg. 2 day delivery</span>
              </div>
            </div>
          </div>

          {/* Client score card */}
          <div className="card relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.04] to-transparent pointer-events-none" />
            <div className="relative">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/20 flex items-center justify-center">
                    <span className="text-sm font-bold text-blue-400">AM</span>
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm">Arjun Mehta</p>
                    <p className="text-xs text-gray-500">Client &middot; Startup Founder</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-extrabold text-blue-400">8.7</p>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider">Trust Score</p>
                </div>
              </div>
              <div className="space-y-3">
                {[
                  { label: "Pays on time", value: 88, color: "from-emerald-500 to-emerald-400" },
                  { label: "Approval speed", value: 82, color: "from-amber-500 to-amber-400" },
                  { label: "Freelancer satisfaction", value: 94, color: "from-blue-500 to-blue-400" },
                ].map((bar) => (
                  <div key={bar.label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-500">{bar.label}</span>
                      <span className="text-gray-400 font-medium">{bar.value}%</span>
                    </div>
                    <div className="w-full bg-[#050a18] rounded-full h-1.5">
                      <div className={`bg-gradient-to-r ${bar.color} h-1.5 rounded-full`} style={{ width: `${bar.value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-[#1a2744] flex items-center gap-4 text-xs text-gray-500">
                <span>8 contracts funded</span>
                <span>&middot;</span>
                <span>1 dispute (resolved)</span>
                <span>&middot;</span>
                <span>Avg. 3 day approval</span>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-sm text-gray-500 mt-8 max-w-lg mx-auto">
          Scores are calculated from real platform data -- delivery times, payment history, dispute rate,
          and milestone completion. No fake reviews. No gaming the system.
        </p>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 py-20">
        <p className="text-sm font-semibold text-blue-400/80 tracking-widest uppercase text-center mb-3">How it works</p>
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Four steps to protected payments</h2>
        <p className="text-gray-400 text-center mb-16 max-w-xl mx-auto">
          Use your existing freelancer or find one on our project board. Either way, every payment is protected.
        </p>

        <div className="grid md:grid-cols-4 gap-5 relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-10 left-[12.5%] right-[12.5%] h-px border-t border-dashed border-[#1a2744]" />

          {[
            { step: "1", title: "Create Contract", desc: "Set milestones and payment amounts", icon: Briefcase, color: "from-blue-500 to-blue-600" },
            { step: "2", title: "Fund Escrow", desc: "Money locked safely until delivery", icon: Lock, color: "from-violet-500 to-violet-600" },
            { step: "3", title: "Deliver Work", desc: "Freelancer submits deliverables", icon: Zap, color: "from-amber-500 to-amber-600" },
            { step: "4", title: "Get Paid", desc: "Approve and funds release instantly", icon: CheckCircle, color: "from-emerald-500 to-emerald-600" },
          ].map((s, i) => (
            <div key={s.step} className="card text-center relative animate-fade-in-up"
              style={{ animationDelay: `${i * 150}ms` }}>
              <div className={`w-12 h-12 bg-gradient-to-br ${s.color} rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                <s.icon className="w-5 h-5 text-white" />
              </div>
              <div className="text-xs text-gray-600 font-mono mb-2">Step {s.step}</div>
              <h3 className="font-semibold text-white mb-1.5">{s.title}</h3>
              <p className="text-sm text-gray-500">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== COMPARISON TABLE ===== */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 py-20">
        <p className="text-sm font-semibold text-blue-400/80 tracking-widest uppercase text-center mb-3">Comparison</p>
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-14">Why not just use Upwork?</h2>

        <div className="card overflow-hidden p-0">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#1a2744]">
                <th className="py-4 px-6 text-sm font-medium text-gray-500 w-1/3">Feature</th>
                <th className="py-4 px-6 text-sm font-medium text-gray-500 w-1/3">Upwork / Fiverr</th>
                <th className="py-4 px-6 text-sm font-semibold text-blue-400 w-1/3">FreelanceShield</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {[
                { feature: "Escrow protection", upwork: "Locked to their marketplace", us: "Works with ANY freelancer" },
                { feature: "Platform fee", upwork: "10-20% from freelancer", us: "1-2% total" },
                { feature: "Bring your own freelancer", upwork: "Not allowed", us: "Invite anyone via link" },
                { feature: "Find freelancers", upwork: "Marketplace only", us: "Built-in project board" },
                { feature: "India payments (UPI)", upwork: "Clunky international rails", us: "Native Razorpay + UPI" },
                { feature: "Auto-release protection", upwork: "No", us: "Configurable 3-30 day timer" },
              ].map((row, i) => (
                <tr key={i} className={`border-b border-[#1a2744]/50 ${i % 2 === 0 ? "bg-white/[0.01]" : ""}`}>
                  <td className="py-3.5 px-6 font-medium text-gray-300">{row.feature}</td>
                  <td className="py-3.5 px-6 text-gray-500">
                    <span className="flex items-center gap-2">
                      <Minus className="w-3.5 h-3.5 text-gray-600 flex-shrink-0" />
                      {row.upwork}
                    </span>
                  </td>
                  <td className="py-3.5 px-6 text-gray-200">
                    <span className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                      {row.us}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ===== PRODUCT PREVIEW ===== */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 py-20">
        <p className="text-sm font-semibold text-blue-400/80 tracking-widest uppercase text-center mb-3">Product preview</p>
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-14">See what you&apos;re getting</h2>

        <div className="glass p-1.5 glow-blue">
          <div className="bg-[#0a1128] rounded-lg p-6 md:p-8 space-y-4">
            {/* Mock browser bar */}
            <div className="flex items-center gap-2 pb-4 border-b border-[#1a2744]">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/40" />
                <div className="w-3 h-3 rounded-full bg-amber-500/40" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/40" />
              </div>
              <div className="flex-1 mx-4">
                <div className="bg-[#050a18] rounded-md px-4 py-1.5 text-xs text-gray-600 max-w-sm mx-auto text-center">
                  freelanceshield.com/contracts/website-redesign
                </div>
              </div>
            </div>

            {/* Mock contract UI */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="md:col-span-2 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-white">Website Redesign Project</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Client: Arjun Mehta &middot; Freelancer: Priya Sharma</p>
                  </div>
                  <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-full font-medium border border-emerald-500/20">active</span>
                </div>

                {[
                  { title: "Design Mockups", amount: "15,000", status: "approved", statusColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
                  { title: "Frontend Development", amount: "25,000", status: "submitted", statusColor: "text-purple-400 bg-purple-500/10 border-purple-500/20" },
                  { title: "Testing & Launch", amount: "10,000", status: "funded", statusColor: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
                ].map((m, i) => (
                  <div key={i} className="flex items-center justify-between bg-[#050a18] rounded-lg px-4 py-3 border border-[#1a2744]/50">
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-600 font-mono w-5">#{i+1}</span>
                      <span className="text-sm text-gray-300">{m.title}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-400 font-medium">INR {m.amount}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${m.statusColor}`}>{m.status}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <div className="bg-[#050a18] rounded-lg p-4 border border-[#1a2744]/50">
                  <p className="text-xs text-gray-500 mb-1">Total Value</p>
                  <p className="text-xl font-bold text-white">INR 50,000</p>
                </div>
                <div className="bg-[#050a18] rounded-lg p-4 border border-[#1a2744]/50">
                  <p className="text-xs text-gray-500 mb-1">In Escrow</p>
                  <p className="text-xl font-bold text-amber-400">INR 35,000</p>
                </div>
                <div className="bg-[#050a18] rounded-lg p-4 border border-[#1a2744]/50">
                  <p className="text-xs text-gray-500 mb-1">Released</p>
                  <p className="text-xl font-bold text-emerald-400">INR 15,000</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="relative z-10 py-24">
        <div className="max-w-4xl mx-auto px-6">
          <div className="glass p-12 md:p-16 text-center relative overflow-hidden glow-blue">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.06] to-violet-500/[0.04] pointer-events-none" />
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to protect your payments?</h2>
              <p className="text-gray-400 mb-10 max-w-lg mx-auto">
                Join {totalSignups > 0 ? `${totalSignups}+ people` : "the waitlist"} and be the first to access FreelanceShield when we launch.
              </p>
              {!submitted ? (
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@email.com"
                    className="input-field flex-1 text-center sm:text-left" required />
                  <button type="submit" disabled={loading} className="btn-primary whitespace-nowrap px-8">
                    {loading ? "..." : "Join Waitlist"}
                  </button>
                </form>
              ) : (
                <div className="flex items-center justify-center gap-2 text-emerald-400 font-medium">
                  <CheckCircle className="w-5 h-5" />
                  You&apos;re on the list. We&apos;ll be in touch!
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="relative z-10 border-t border-[#1a2744] mt-10">
        <div className="max-w-6xl mx-auto px-6 py-14">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <Shield className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="font-bold text-sm">FreelanceShield</span>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">
                Milestone-based escrow payments for freelancers and clients.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-300 mb-4">Product</h4>
              <ul className="space-y-2.5 text-sm text-gray-500">
                <li><Link href="#" className="hover:text-gray-300 transition-colors">How it Works</Link></li>
                <li><Link href="#" className="hover:text-gray-300 transition-colors">Pricing</Link></li>
                <li><Link href="#" className="hover:text-gray-300 transition-colors">Project Board</Link></li>
                <li><Link href="#" className="hover:text-gray-300 transition-colors">For Freelancers</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-300 mb-4">Company</h4>
              <ul className="space-y-2.5 text-sm text-gray-500">
                <li><Link href="#" className="hover:text-gray-300 transition-colors">About</Link></li>
                <li><Link href="#" className="hover:text-gray-300 transition-colors">Blog</Link></li>
                <li><Link href="#" className="hover:text-gray-300 transition-colors">Careers</Link></li>
                <li><Link href="#" className="hover:text-gray-300 transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-300 mb-4">Legal</h4>
              <ul className="space-y-2.5 text-sm text-gray-500">
                <li><Link href="#" className="hover:text-gray-300 transition-colors">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-gray-300 transition-colors">Terms of Service</Link></li>
                <li><Link href="#" className="hover:text-gray-300 transition-colors">Refund Policy</Link></li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-[#1a2744]">
            <p className="text-sm text-gray-600">
              &copy; {new Date().getFullYear()} FreelanceShield. Built in India.
            </p>
            <div className="flex items-center gap-4 mt-4 md:mt-0">
              <Link href="#" className="text-gray-600 hover:text-gray-400 transition-colors"><MessageCircle className="w-4 h-4" /></Link>
              <Link href="#" className="text-gray-600 hover:text-gray-400 transition-colors"><Mail className="w-4 h-4" /></Link>
              <Link href="#" className="text-gray-600 hover:text-gray-400 transition-colors"><Code className="w-4 h-4" /></Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
