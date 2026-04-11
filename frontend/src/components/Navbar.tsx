"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { Shield, LogOut, Plus, Briefcase, FileText } from "lucide-react";
import WalletButton from "./WalletButton";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="fixed top-0 w-full z-50 h-16">
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center">
        <div className="flex-grow flex items-center">
          <div className="glass-card px-4 py-2 rounded-full flex items-center gap-3 soft-shadow">
            <Shield className="w-5 h-5 text-[#1f2fe7]" />
            <Link href="/dashboard" className="text-sm font-black tracking-tight uppercase">FreelanceShield</Link>
            {user && (
              <>
                <div className="h-4 w-px bg-[#c5c5d9] mx-1" />
                <nav className="hidden md:flex gap-4">
                  <Link href="/dashboard" className="text-xs font-semibold text-[#5f5e5e] hover:text-[#1f2fe7] transition-colors flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5" /> Contracts
                  </Link>
                  <Link href="/projects" className="text-xs font-semibold text-[#5f5e5e] hover:text-[#1f2fe7] transition-colors flex items-center gap-1">
                    <Briefcase className="w-3.5 h-3.5" /> Find Work
                  </Link>
                </nav>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {user && (
            <>
              <Link href="/projects/new" className="hidden md:flex btn-secondary text-xs items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5" /> Post Project
              </Link>
              <Link href="/contracts/new" className="hidden md:flex btn-primary items-center gap-1.5 text-xs">
                <Plus className="w-3.5 h-3.5" /> New Contract
              </Link>
              <span className="hidden lg:block text-xs font-semibold text-[#5f5e5e] ml-1">{user.name}</span>
              <button onClick={logout} className="text-[#c5c5d9] hover:text-[#5f5e5e] transition-colors">
                <LogOut className="w-4 h-4" />
              </button>
            </>
          )}
          <WalletButton />
        </div>
      </div>
    </header>
  );
}
