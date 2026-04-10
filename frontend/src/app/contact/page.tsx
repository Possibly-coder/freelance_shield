"use client";

import { useState } from "react";
import PageShell from "@/components/PageShell";
import { Mail, MessageCircle, CheckCircle } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <PageShell>
      <div className="text-center mb-16">
        <p className="text-sm font-semibold text-blue-600 tracking-widest uppercase mb-3">Contact</p>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">Let&apos;s talk</h1>
        <p className="text-lg text-[#6B6560] max-w-2xl mx-auto">
          Got a question, partnership idea, or just want to say hi? We&apos;d love to hear from you.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Contact form */}
        <div className="card">
          {submitted ? (
            <div className="text-center py-12">
              <CheckCircle className="w-14 h-14 text-emerald-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Message received!</h3>
              <p className="text-[#6B6560]">We&apos;ll get back to you within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-[#6B6560] mb-1.5">Name</label>
                <input type="text" className="input-field" placeholder="Your name" required />
              </div>
              <div>
                <label className="block text-sm text-[#6B6560] mb-1.5">Email</label>
                <input type="email" className="input-field" placeholder="you@email.com" required />
              </div>
              <div>
                <label className="block text-sm text-[#6B6560] mb-1.5">Subject</label>
                <select className="input-field">
                  <option>General inquiry</option>
                  <option>Partnership opportunity</option>
                  <option>Enterprise pricing</option>
                  <option>Bug report</option>
                  <option>Feature request</option>
                  <option>Press / Media</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-[#6B6560] mb-1.5">Message</label>
                <textarea className="input-field min-h-[140px]" placeholder="What's on your mind?" required />
              </div>
              <button type="submit" className="btn-primary w-full">Send Message</button>
            </form>
          )}
        </div>

        {/* Contact info */}
        <div className="space-y-5">
          <div className="card">
            <Mail className="w-6 h-6 text-blue-600 mb-3" />
            <h3 className="font-semibold mb-1">Email us</h3>
            <p className="text-[#6B6560] text-sm">For general inquiries and support</p>
            <p className="text-blue-600 text-sm mt-2">hello@freelanceshield.com</p>
          </div>
          <div className="card">
            <MessageCircle className="w-6 h-6 text-emerald-600 mb-3" />
            <h3 className="font-semibold mb-1">Twitter / X</h3>
            <p className="text-[#6B6560] text-sm">Follow us for updates and DM for quick questions</p>
            <p className="text-blue-600 text-sm mt-2">@FreelanceShield</p>
          </div>
          <div className="card">
            <div className="text-sm text-[#9C9690] leading-relaxed">
              <p className="font-semibold text-[#1A1A1A] mb-2">Response times</p>
              <p>General inquiries: within 24 hours</p>
              <p>Partnership: within 48 hours</p>
              <p>Enterprise: within 24 hours</p>
              <p>Bug reports: within 12 hours</p>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
