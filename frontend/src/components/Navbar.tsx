"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { Shield, LogOut, Plus, Briefcase, FileText } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-50" style={{ background: "rgba(5, 10, 24, 0.8)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)" }}>
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Shield className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">FreelanceShield</span>
          </Link>

          {user && (
            <div className="hidden md:flex items-center gap-0.5 text-sm">
              <Link href="/dashboard" className="px-3 py-1.5 rounded-lg text-gray-400 hover:text-gray-200 hover:bg-white/[0.04] transition-all flex items-center gap-1.5">
                <FileText className="w-4 h-4" />
                Contracts
              </Link>
              <Link href="/projects" className="px-3 py-1.5 rounded-lg text-gray-400 hover:text-gray-200 hover:bg-white/[0.04] transition-all flex items-center gap-1.5">
                <Briefcase className="w-4 h-4" />
                Find Work
              </Link>
            </div>
          )}
        </div>

        {user && (
          <div className="flex items-center gap-3">
            <Link href="/projects/new" className="hidden md:flex btn-secondary text-sm items-center gap-1.5">
              <Briefcase className="w-4 h-4" />
              Post Project
            </Link>
            <Link href="/contracts/new" className="btn-primary flex items-center gap-1.5 text-sm">
              <Plus className="w-4 h-4" />
              New Contract
            </Link>
            <div className="hidden md:block text-sm text-gray-500 ml-1">{user.name}</div>
            <button onClick={logout} className="text-gray-600 hover:text-gray-400 transition-colors ml-1">
              <LogOut className="w-4.5 h-4.5" />
            </button>
          </div>
        )}
      </div>
      {/* Gradient bottom border */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#1a2744] to-transparent" />
    </nav>
  );
}
