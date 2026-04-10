"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import Navbar from "@/components/Navbar";
import StatusBadge from "@/components/StatusBadge";
import api from "@/lib/api";
import { Contract } from "@/lib/types";
import { FileText, Plus, DollarSign, Clock, CheckCircle } from "lucide-react";

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && user) {
      api.get("/contracts/").then((res) => {
        setContracts(res.data);
        setLoading(false);
      });
    }
  }, [user, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-[#6B6560]">Loading...</div>
      </div>
    );
  }

  const stats = {
    total: contracts.length,
    active: contracts.filter((c) => c.status === "active").length,
    totalValue: contracts.reduce((sum, c) => sum + c.total_amount, 0),
    completed: contracts.filter((c) => c.status === "completed").length,
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-[#6B6560] mt-1">Welcome back, {user?.name}</p>
          </div>
          <Link href="/contracts/new" className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" /> New Contract
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="card flex items-center gap-4">
            <FileText className="w-8 h-8 text-blue-600" />
            <div>
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-sm text-[#6B6560]">Contracts</p>
            </div>
          </div>
          <div className="card flex items-center gap-4">
            <Clock className="w-8 h-8 text-amber-600" />
            <div>
              <p className="text-2xl font-bold">{stats.active}</p>
              <p className="text-sm text-[#6B6560]">Active</p>
            </div>
          </div>
          <div className="card flex items-center gap-4">
            <DollarSign className="w-8 h-8 text-emerald-600" />
            <div>
              <p className="text-2xl font-bold">{stats.totalValue.toLocaleString()}</p>
              <p className="text-sm text-[#6B6560]">Total Value</p>
            </div>
          </div>
          <div className="card flex items-center gap-4">
            <CheckCircle className="w-8 h-8 text-violet-600" />
            <div>
              <p className="text-2xl font-bold">{stats.completed}</p>
              <p className="text-sm text-[#6B6560]">Completed</p>
            </div>
          </div>
        </div>

        {contracts.length === 0 ? (
          <div className="card text-center py-16">
            <FileText className="w-12 h-12 text-[#C4BFB8] mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No contracts yet</h3>
            <p className="text-[#6B6560] mb-6">Create your first contract and invite a freelancer.</p>
            <Link href="/contracts/new" className="btn-primary">Create Contract</Link>
          </div>
        ) : (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold mb-4">Your Contracts</h2>
            {contracts.map((contract) => (
              <Link key={contract.id} href={`/contracts/${contract.id}`}
                className="card block hover:border-[#D4D0C8] transition-colors cursor-pointer">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-lg">{contract.title}</h3>
                    <p className="text-sm text-[#6B6560] mt-1">
                      {contract.client?.name && `Client: ${contract.client.name}`}
                      {contract.freelancer?.name && ` · Freelancer: ${contract.freelancer.name}`}
                    </p>
                  </div>
                  <div className="text-right">
                    <StatusBadge status={contract.status} />
                    <p className="text-sm text-[#6B6560] mt-2">
                      {contract.currency} {contract.total_amount.toLocaleString()}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
