"use client";

import { useEffect, useState } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { useAnchorProvider } from "@/lib/useProgram";
import { fetchTrustScoreOnChain } from "@/lib/program-client";
import { ShieldCheck, TrendingUp } from "lucide-react";

interface TrustData {
  contractsCompleted: number;
  contractsFunded: number;
  onTimeDeliveries: number;
  totalDeliveries: number;
  disputesRaised: number;
  disputesLost: number;
  totalPaid: number;
  totalEarned: number;
}

export default function TrustScoreCard() {
  const { publicKey, connected } = useWallet();
  const provider = useAnchorProvider();
  const [trust, setTrust] = useState<TrustData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!provider || !publicKey) return;

    setLoading(true);
    fetchTrustScoreOnChain(provider, publicKey)
      .then((data) => {
        if (data) {
          setTrust({
            contractsCompleted: data.contractsCompleted,
            contractsFunded: data.contractsFunded,
            onTimeDeliveries: data.onTimeDeliveries,
            totalDeliveries: data.totalDeliveries,
            disputesRaised: data.disputesRaised,
            disputesLost: data.disputesLost,
            totalPaid: Number(data.totalPaid) / 1_000_000,
            totalEarned: Number(data.totalEarned) / 1_000_000,
          });
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [provider, publicKey]);

  if (!connected) return null;

  const score = trust
    ? Math.min(100, Math.round(
        ((trust.onTimeDeliveries / Math.max(trust.totalDeliveries, 1)) * 50) +
        ((1 - trust.disputesLost / Math.max(trust.disputesRaised, 1)) * 30) +
        (Math.min(trust.contractsCompleted + trust.contractsFunded, 20) / 20 * 20)
      ))
    : 0;

  return (
    <div className="card">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-[#1f2fe7]/10 flex items-center justify-center">
          <ShieldCheck className="w-5 h-5 text-[#1f2fe7]" />
        </div>
        <div>
          <h3 className="font-bold text-sm">On-Chain Trust Score</h3>
          <p className="text-[10px] text-[#9C9690] uppercase tracking-wider">Solana &middot; Portable &middot; Verified</p>
        </div>
        {trust && (
          <div className="ml-auto text-right">
            <p className="text-2xl font-black text-[#1f2fe7]">{score}</p>
            <p className="text-[8px] uppercase font-bold tracking-wider text-[#5f5e5e]">Score</p>
          </div>
        )}
      </div>

      {loading ? (
        <p className="text-sm text-[#9C9690]">Fetching from Solana...</p>
      ) : trust ? (
        <div className="space-y-3">
          {[
            { label: "On-time delivery", value: trust.totalDeliveries > 0 ? Math.round((trust.onTimeDeliveries / trust.totalDeliveries) * 100) : 0, color: "from-emerald-400 to-emerald-500" },
            { label: "Contracts", value: Math.min(100, (trust.contractsCompleted + trust.contractsFunded) * 10), color: "from-blue-400 to-blue-500" },
            { label: "Dispute-free", value: trust.disputesRaised > 0 ? Math.round((1 - trust.disputesLost / trust.disputesRaised) * 100) : 100, color: "from-violet-400 to-violet-500" },
          ].map((bar) => (
            <div key={bar.label}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-[#9C9690]">{bar.label}</span>
                <span className="text-[#5f5e5e] font-medium">{bar.value}%</span>
              </div>
              <div className="w-full bg-[#F0EDE8] rounded-full h-1.5">
                <div className={`bg-gradient-to-r ${bar.color} h-1.5 rounded-full`} style={{ width: `${bar.value}%` }} />
              </div>
            </div>
          ))}
          <div className="pt-3 border-t border-[#E8E5DF] grid grid-cols-2 gap-4 text-xs text-[#9C9690]">
            <div>
              <span>Earned: </span>
              <span className="font-bold text-[#1A1A1A]">{trust.totalEarned.toLocaleString()} USDC</span>
            </div>
            <div>
              <span>Paid: </span>
              <span className="font-bold text-[#1A1A1A]">{trust.totalPaid.toLocaleString()} USDC</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-4">
          <TrendingUp className="w-8 h-8 text-[#E8E5DF] mx-auto mb-2" />
          <p className="text-sm text-[#9C9690]">No trust score yet</p>
          <p className="text-xs text-[#C4BFB8]">Complete your first contract to start building reputation</p>
        </div>
      )}
    </div>
  );
}
