"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Shield, Lock, CheckCircle, ArrowRight, Briefcase,
  AlertTriangle, IndianRupee, Users, Zap, Timer,
  ShieldCheck, Globe, Fingerprint, Check, Minus,
  Mail, MessageCircle, Code, Star, Sparkles, Send,
  Receipt, Clock, Building
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
    <div className="min-h-screen">

      {/* ===== TOP BAR ===== */}
      <header className="fixed top-0 w-full z-50 h-16">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center">
          <div className="flex-grow flex items-center">
            <div className="glass-card px-4 py-2 rounded-full flex items-center gap-3 soft-shadow">
              <Shield className="w-5 h-5 text-[#1f2fe7]" />
              <span className="text-sm font-black tracking-tight uppercase">FreelanceShield</span>
              <div className="h-4 w-px bg-[#c5c5d9] mx-2" />
              <nav className="hidden md:flex gap-6">
                <Link href="/" className="text-xs font-bold text-[#1f2fe7]">Home</Link>
                <Link href="/how-it-works" className="text-xs font-semibold text-[#5f5e5e] hover:text-[#1f2fe7] transition-colors">Features</Link>
                <Link href="/pricing" className="text-xs font-semibold text-[#5f5e5e] hover:text-[#1f2fe7] transition-colors">Pricing</Link>
              </nav>
            </div>
          </div>
          <button onClick={() => document.getElementById("waitlist-form")?.scrollIntoView({ behavior: "smooth" })}
            className="btn-primary">
            Join Waitlist
          </button>
        </div>
      </header>

      <main className="pt-24">

        {/* ===== HERO ===== */}
        <section className="relative px-6 pb-20 overflow-hidden">
          <div className="max-w-5xl mx-auto text-center animate-fade-in-up">
            <div className="inline-flex items-center px-4 py-1 mb-6 rounded-full glass-card text-[#1f2fe7] text-[10px] font-bold tracking-widest uppercase border border-[#1f2fe7]/10">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1f2fe7] mr-2 animate-pulse-soft" />
              {totalSignups > 0 ? `Trusted by ${totalSignups}+ Professionals` : "Launching Soon — Early Access"}
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[1.05] mb-6 text-[#1b1c1c]">
              The Trust Layer for <br /><span className="text-[#1f2fe7] italic">Modern Freelancing</span>
            </h1>

            <p className="text-base md:text-lg text-[#5f5e5e] mb-8 max-w-xl mx-auto leading-relaxed">
              Milestone-based escrow that protects your work and payments. <br className="hidden md:block" /> No 20% fees. Just pure protection.
            </p>

            {/* Waitlist Form */}
            <div id="waitlist-form">
              {submitted ? (
                <div className="max-w-md mx-auto glass-card rounded-2xl p-8 soft-shadow animate-fade-in-up">
                  <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
                  <h3 className="text-xl font-black mb-2">You&apos;re in!</h3>
                  <p className="text-[#5f5e5e] text-sm">You&apos;re #{position} on the waitlist. We&apos;ll email you when we launch.</p>
                </div>
              ) : (
                <div className="max-w-md mx-auto">
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-3">
                      {error}
                    </div>
                  )}
                  <div className="flex flex-col gap-3 mb-4">
                    <div className="flex gap-2 justify-center">
                      {[
                        { value: "client", label: "I hire freelancers" },
                        { value: "freelancer", label: "I'm a freelancer" },
                        { value: "both", label: "Both" },
                      ].map((opt) => (
                        <button key={opt.value} type="button" onClick={() => setRole(opt.value)}
                          className={`text-xs px-4 py-2 rounded-full font-semibold transition-all duration-200 ${
                            role === opt.value
                              ? "bg-[#1f2fe7]/10 text-[#1f2fe7] border border-[#1f2fe7]/20"
                              : "glass-card text-[#5f5e5e] hover:text-[#1f2fe7]"
                          }`}>
                          {opt.label}
                        </button>
                      ))}
                    </div>
                    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 p-2 glass-card rounded-2xl soft-shadow">
                      <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                        placeholder="Name (optional)" className="flex-grow bg-transparent border-none rounded-xl px-4 py-3 text-sm focus:ring-0 focus:outline-none" />
                      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your work email" className="flex-grow bg-transparent border-none rounded-xl px-4 py-3 text-sm focus:ring-0 focus:outline-none" required />
                      <button type="submit" disabled={loading}
                        className="hero-gradient text-white px-6 py-3 rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all whitespace-nowrap">
                        {loading ? "..." : "Secure Early Access"}
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>

            {/* Trust signals */}
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 mt-12 opacity-50 hover:opacity-80 transition-all duration-500">
              {[
                { icon: Lock, label: "Razorpay" },
                { icon: Fingerprint, label: "SSL Secure" },
                { icon: ShieldCheck, label: "Escrow Protected" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2">
                  <Icon className="w-4 h-4" />
                  <span className="text-[10px] font-bold tracking-widest uppercase">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== PROBLEM + AUTO-RELEASE ===== */}
        <section className="py-20 px-6 bg-white/40 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="animate-fade-in-up">
                <span className="text-[#1f2fe7] font-bold text-xs tracking-widest uppercase mb-4 block">The Protocol</span>
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-[#1b1c1c] leading-tight mb-6">
                  Never Wait on a <br />Silent Client Again.
                </h2>
                <p className="text-[#5f5e5e] leading-relaxed mb-8 max-w-md">
                  Our Smart-Release system ensures you get paid. Once submitted, the clock starts. No response? The ledger moves automatically.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { value: "68%", label: "Ghosted" },
                    { value: "73%", label: "Scammed" },
                    { value: "₹4.2L", label: "Avg. Loss" },
                  ].map((stat) => (
                    <div key={stat.label} className="glass-card p-6 rounded-2xl border-l-4 border-[#1f2fe7]">
                      <div className="text-3xl font-black tracking-tighter mb-1">{stat.value}</div>
                      <p className="text-[10px] font-bold text-[#5f5e5e] uppercase tracking-wider">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Smart-Release Card */}
              <div className="relative group animate-fade-in-up delay-200">
                <div className="absolute -inset-4 bg-[#1f2fe7]/5 rounded-[3rem] blur-2xl group-hover:bg-[#1f2fe7]/10 transition-colors" />
                <div className="relative glass-card p-8 rounded-3xl soft-shadow border-white/60">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h4 className="text-lg font-bold">Project Alpha</h4>
                      <p className="text-[10px] text-[#5f5e5e] font-bold uppercase tracking-wider">Awaiting Review &bull; 48h Timer</p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-[#1f2fe7]/10 flex items-center justify-center text-[#1f2fe7]">
                      <Timer className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="w-full bg-[#f5f3f3] h-2 rounded-full mb-6 overflow-hidden">
                    <div className="hero-gradient h-full w-[85%] rounded-full shadow-[0_0_10px_rgba(31,47,231,0.5)]" />
                  </div>
                  <div className="p-4 bg-[#1f2fe7]/5 rounded-2xl border border-[#1f2fe7]/10">
                    <p className="text-sm font-bold text-[#1f2fe7] mb-1 flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Smart-Release Active
                    </p>
                    <p className="text-xs text-[#5f5e5e] leading-relaxed">Funds release to your wallet automatically if client is silent for 48h.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== TRUST SCORES ===== */}
        <section className="py-24 px-6 relative overflow-hidden">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 animate-fade-in-up">
              <h2 className="text-4xl font-black tracking-tighter text-[#1b1c1c] mb-6">Reputation as <br />Infrastructure</h2>
              <p className="text-[#5f5e5e] mb-8">Your trust score is portable, verified, and impossible to fake. Use your history to land better clients instantly.</p>
              <Link href="/how-it-works" className="text-[#1f2fe7] font-bold text-sm flex items-center gap-2 group">
                Learn about Trust Scores
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="lg:col-span-7 relative min-h-[360px]">
              {/* Freelancer Profile */}
              <div className="glass-card p-6 rounded-3xl max-w-[340px] soft-shadow absolute z-20 top-0 left-0 md:left-4 hover:-translate-y-1 transition-transform duration-300 animate-fade-in-up delay-100">
                <div className="flex gap-4 items-center mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-100 to-blue-100 ring-4 ring-white shadow-sm flex items-center justify-center">
                    <span className="text-lg font-black text-[#1f2fe7]">AD</span>
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-bold">Ananya D.</h3>
                    <p className="text-[10px] text-[#5f5e5e] font-bold uppercase tracking-widest">Product Designer</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-black text-[#1f2fe7]">98</div>
                    <div className="text-[8px] uppercase font-bold tracking-wider text-[#5f5e5e]">Score</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 border-t border-[#1f2fe7]/5 pt-4">
                  <div>
                    <p className="text-[10px] text-[#5f5e5e] mb-1">On-time</p>
                    <p className="text-sm font-bold">99.2%</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-[#5f5e5e] mb-1">Milestones</p>
                    <p className="text-sm font-bold">142</p>
                  </div>
                </div>
              </div>

              {/* Client Profile */}
              <div className="glass-card p-6 rounded-3xl max-w-[340px] soft-shadow absolute z-10 top-28 right-0 md:right-4 bg-slate-50/80 hover:-translate-y-1 transition-transform duration-300 animate-fade-in-up delay-300">
                <div className="flex gap-4 items-center mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-[#1b1c1c] flex items-center justify-center shrink-0">
                    <Building className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-bold">TechNova</h3>
                    <p className="text-[10px] text-[#5f5e5e] font-bold uppercase tracking-widest">B2B SaaS</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-black text-[#1f2fe7]">95</div>
                    <div className="text-[8px] uppercase font-bold tracking-wider text-[#5f5e5e]">Score</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 border-t border-[#1f2fe7]/5 pt-4">
                  <div>
                    <p className="text-[10px] text-[#5f5e5e] mb-1">Pay Speed</p>
                    <p className="text-sm font-bold text-green-600">Instant</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-[#5f5e5e] mb-1">Avg Project</p>
                    <p className="text-sm font-bold">₹8.5L</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== COMPARISON + PRODUCT PREVIEW ===== */}
        <section className="py-24 px-6 bg-white/40">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-12 gap-16 items-start">
              {/* Comparison Table */}
              <div className="lg:col-span-5 animate-fade-in-up">
                <h2 className="text-3xl font-black tracking-tighter mb-8">Escape the Trap</h2>
                <div className="glass-card rounded-3xl overflow-hidden soft-shadow">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="bg-[#1f2fe7]/5">
                        <th className="p-5 font-bold text-[10px] uppercase tracking-widest text-[#5f5e5e]">Feature</th>
                        <th className="p-5 font-bold text-[10px] uppercase tracking-widest text-[#1f2fe7]">Shield</th>
                        <th className="p-5 font-bold text-[10px] uppercase tracking-widest text-[#5f5e5e]">Others</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { feature: "Fee", us: "2%", them: "20%" },
                        { feature: "Security", us: "Escrow", them: "Disputes" },
                        { feature: "Auto-Release", us: "check", them: "—" },
                        { feature: "Own Clients", us: "check", them: "—" },
                        { feature: "UPI Native", us: "check", them: "—" },
                      ].map((row, i) => (
                        <tr key={i} className="border-b border-[#1f2fe7]/5 last:border-none">
                          <td className="p-5 font-semibold">{row.feature}</td>
                          <td className="p-5 text-[#1f2fe7] font-bold">
                            {row.us === "check" ? <Check className="w-4 h-4" /> : row.us}
                          </td>
                          <td className="p-5 text-[#5f5e5e]">{row.them}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Product Preview (Dark) */}
              <div className="lg:col-span-7 animate-fade-in-up delay-200">
                <div className="bg-slate-950 rounded-[2.5rem] p-3 md:p-6 shadow-2xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-transparent opacity-30" />
                  <div className="relative glass-card border-slate-700 bg-slate-900/50 rounded-3xl p-6 md:p-8" style={{ border: "1px solid rgb(51 65 85 / 0.5)" }}>
                    <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-800">
                      <div className="flex gap-4 items-center">
                        <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                          <Receipt className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-slate-500 text-[9px] font-bold uppercase tracking-widest">Active Milestone</p>
                          <h5 className="text-white font-bold">Frontend Implementation</h5>
                        </div>
                      </div>
                      <span className="bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded-full text-[10px] font-bold border border-indigo-500/20">Escrowed ₹1,20,000</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-8">
                      <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800">
                        <p className="text-slate-500 text-[9px] font-bold uppercase mb-1">Due Date</p>
                        <p className="text-slate-200 text-xs font-medium">Nov 24, 2026</p>
                      </div>
                      <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800">
                        <p className="text-slate-500 text-[9px] font-bold uppercase mb-1">Contractor</p>
                        <p className="text-slate-200 text-xs font-medium">Priya Sharma</p>
                      </div>
                    </div>
                    <button className="w-full hero-gradient py-4 rounded-2xl text-white font-bold text-sm shadow-xl flex items-center justify-center gap-2">
                      Submit for Approval
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== HOW IT WORKS ===== */}
        <section className="py-24 px-6">
          <div className="max-w-5xl mx-auto text-center">
            <span className="text-[#1f2fe7] font-bold text-xs tracking-widest uppercase mb-4 block">How It Works</span>
            <h2 className="text-4xl font-black tracking-tighter mb-16">Four steps. Zero risk.</h2>
            <div className="grid md:grid-cols-4 gap-6 relative">
              <div className="hidden md:block absolute top-8 left-[12.5%] right-[12.5%] h-px border-t-2 border-dashed border-[#e9e8e8]" />
              {[
                { step: "01", title: "Create", desc: "Set milestones & amounts", icon: Briefcase, color: "from-blue-600 to-indigo-600" },
                { step: "02", title: "Fund", desc: "Lock money in escrow", icon: Lock, color: "from-violet-600 to-purple-600" },
                { step: "03", title: "Deliver", desc: "Submit your work", icon: Zap, color: "from-amber-500 to-orange-500" },
                { step: "04", title: "Release", desc: "Instant payout", icon: CheckCircle, color: "from-emerald-500 to-green-600" },
              ].map((s, i) => (
                <div key={s.step} className="glass-card p-6 rounded-3xl text-center relative animate-fade-in-up"
                  style={{ animationDelay: `${i * 150}ms` }}>
                  <div className={`w-14 h-14 bg-gradient-to-br ${s.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                    <s.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-[10px] text-[#5f5e5e] font-bold tracking-widest uppercase mb-2">{s.step}</div>
                  <h3 className="font-black text-lg mb-1">{s.title}</h3>
                  <p className="text-xs text-[#5f5e5e]">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== FINAL CTA ===== */}
        <section className="py-32 px-6">
          <div className="max-w-4xl mx-auto glass-card rounded-[3rem] p-12 md:p-20 text-center soft-shadow border-white/80">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-[#1b1c1c] leading-tight mb-8">
              Stop working on <br />a handshake.
            </h2>
            <p className="text-lg text-[#5f5e5e] mb-12 max-w-xl mx-auto leading-relaxed">
              Join the next generation of professionals who value their work as much as their freedom.
            </p>
            {!submitted ? (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto p-2 glass-card rounded-2xl mb-8 soft-shadow bg-white/40">
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your work email"
                  className="flex-grow bg-transparent border-none rounded-xl px-4 py-3 text-sm focus:ring-0 focus:outline-none" required />
                <button type="submit" disabled={loading}
                  className="hero-gradient text-white px-8 py-3 rounded-xl font-bold text-sm shadow-md transition-all whitespace-nowrap">
                  {loading ? "..." : "Join Waitlist"}
                </button>
              </form>
            ) : (
              <div className="flex items-center justify-center gap-2 text-emerald-600 font-bold mb-8">
                <CheckCircle className="w-5 h-5" />
                You&apos;re on the list!
              </div>
            )}
            <div className="flex items-center justify-center gap-3">
              <div className="flex -space-x-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gradient-to-br from-slate-200 to-slate-400" />
                ))}
              </div>
              <span className="text-xs font-bold text-[#5f5e5e]">
                Join {totalSignups > 0 ? `${totalSignups}+` : "500+"} professionals
              </span>
            </div>
          </div>
        </section>
      </main>

      {/* ===== FOOTER ===== */}
      <footer className="py-16 bg-white/40 backdrop-blur-xl border-t border-[#1f2fe7]/5">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <Shield className="w-5 h-5 text-[#1f2fe7]" />
              <span className="text-base font-black tracking-tight uppercase">FreelanceShield</span>
            </div>
            <p className="text-xs text-[#5f5e5e] leading-relaxed max-w-xs">Building the trust infrastructure for the global creative economy.</p>
          </div>
          <div>
            <h6 className="text-[10px] font-bold uppercase tracking-widest text-[#1b1c1c] mb-6">Product</h6>
            <ul className="space-y-3 text-xs text-[#5f5e5e]">
              <li><Link href="/how-it-works" className="hover:text-[#1f2fe7] transition-colors">How it Works</Link></li>
              <li><Link href="/pricing" className="hover:text-[#1f2fe7] transition-colors">Pricing</Link></li>
              <li><Link href="/project-board" className="hover:text-[#1f2fe7] transition-colors">Project Board</Link></li>
              <li><Link href="/for-freelancers" className="hover:text-[#1f2fe7] transition-colors">For Freelancers</Link></li>
            </ul>
          </div>
          <div>
            <h6 className="text-[10px] font-bold uppercase tracking-widest text-[#1b1c1c] mb-6">Legal</h6>
            <ul className="space-y-3 text-xs text-[#5f5e5e]">
              <li><Link href="/privacy" className="hover:text-[#1f2fe7] transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-[#1f2fe7] transition-colors">Terms</Link></li>
              <li><Link href="/refund-policy" className="hover:text-[#1f2fe7] transition-colors">Refund Policy</Link></li>
            </ul>
          </div>
          <div>
            <h6 className="text-[10px] font-bold uppercase tracking-widest text-[#1b1c1c] mb-6">Connect</h6>
            <div className="flex gap-3">
              <Link href="#" className="w-8 h-8 rounded-full glass-card flex items-center justify-center hover:text-[#1f2fe7] transition-colors text-[#5f5e5e]">
                <Globe className="w-4 h-4" />
              </Link>
              <Link href="#" className="w-8 h-8 rounded-full glass-card flex items-center justify-center hover:text-[#1f2fe7] transition-colors text-[#5f5e5e]">
                <Mail className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-[#1f2fe7]/5 text-center md:text-left">
          <p className="text-[10px] text-[#5f5e5e] font-medium tracking-wider uppercase">&copy; {new Date().getFullYear()} FreelanceShield. Built in India.</p>
        </div>
      </footer>
    </div>
  );
}
