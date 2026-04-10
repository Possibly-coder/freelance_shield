import Link from "next/link";
import { Shield } from "lucide-react";

export default function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="fixed top-0 w-full z-50 h-16">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center">
          <div className="flex-grow flex items-center">
            <div className="glass-card px-4 py-2 rounded-full flex items-center gap-3 soft-shadow">
              <Shield className="w-5 h-5 text-[#1f2fe7]" />
              <Link href="/" className="text-sm font-black tracking-tight uppercase">FreelanceShield</Link>
            </div>
          </div>
          <Link href="/" className="btn-primary text-xs">Join Waitlist</Link>
        </div>
      </header>

      <main className="pt-24 max-w-4xl mx-auto px-6 py-12">{children}</main>

      <footer className="py-12 bg-white/40 backdrop-blur-xl border-t border-[#1f2fe7]/5 mt-20">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
          <p className="text-[10px] text-[#5f5e5e] font-medium tracking-wider uppercase">&copy; {new Date().getFullYear()} FreelanceShield. Built in India.</p>
          <div className="flex gap-6 mt-4 md:mt-0 text-xs text-[#5f5e5e]">
            <Link href="/privacy" className="hover:text-[#1f2fe7] transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-[#1f2fe7] transition-colors">Terms</Link>
            <Link href="/contact" className="hover:text-[#1f2fe7] transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
