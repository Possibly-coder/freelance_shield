"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import StatusBadge from "@/components/StatusBadge";
import api from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { useAnchorProvider } from "@/lib/useProgram";
import { acceptContractOnChain } from "@/lib/program-client";
import { useWallet } from "@solana/wallet-adapter-react";
import { Contract } from "@/lib/types";
import { Shield, CheckCircle, Wallet } from "lucide-react";
import { PublicKey } from "@solana/web3.js";

export default function InvitePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [contract, setContract] = useState<Contract | null>(null);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get(`/contracts/invite/${token}`)
      .then((res) => setContract(res.data))
      .catch(() => setError("Invalid or expired invite link"))
      .finally(() => setLoading(false));
  }, [token]);

  const provider = useAnchorProvider();
  const { publicKey, connected } = useWallet();

  const handleAccept = async () => {
    if (!user) {
      router.push(`/auth/signup?redirect=/contracts/invite/${token}`);
      return;
    }

    setAccepting(true);
    try {
      // Accept on Solana if wallet connected
      if (provider && publicKey && contract?.client_id) {
        try {
          const clientKey = new PublicKey(contract.client_id);
          const { getContractPda } = await import("@/lib/solana");
          const contractPda = getContractPda(clientKey, parseInt(contract.id.split("-")[0], 16));
          await acceptContractOnChain(provider, contractPda);
        } catch { /* Solana accept is best-effort, backend handles state */ }
      }

      // Always accept on backend too
      const res = await api.post(`/contracts/invite/${token}/accept`);
      router.push(`/contracts/${res.data.id}`);
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail || "Failed to accept contract";
      setError(message);
    } finally {
      setAccepting(false);
    }
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[#6B6560]">Loading...</div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="card text-center max-w-md">
          <p className="text-red-600 mb-4">{error}</p>
        </div>
      </div>
    );
  }

  if (!contract) return null;

  return (
    <div className="min-h-screen">
      {user ? <Navbar /> : (
        <nav className="max-w-6xl mx-auto px-4 h-16 flex items-center">
          <div className="flex items-center gap-2 font-bold text-xl">
            <Shield className="w-6 h-6 text-blue-600" />
            FreelanceShield
          </div>
        </nav>
      )}

      <main className="max-w-2xl mx-auto px-6 pt-24 pb-16">
        <div className="card text-center">
          <h1 className="text-2xl font-bold mb-2">You&apos;ve been invited to a contract</h1>
          <p className="text-[#6B6560] mb-8">Review the details below and accept to get started.</p>

          <div className="text-left space-y-4 mb-8">
            <div className="bg-[#F5F3F0] rounded-lg p-4">
              <p className="text-sm text-[#6B6560]">Contract</p>
              <p className="font-semibold text-lg">{contract.title}</p>
              {contract.description && <p className="text-sm text-[#6B6560] mt-1">{contract.description}</p>}
            </div>

            <div className="bg-[#F5F3F0] rounded-lg p-4 flex justify-between">
              <div>
                <p className="text-sm text-[#6B6560]">Client</p>
                <p className="font-medium">{contract.client?.name}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-[#6B6560]">Total Value</p>
                <p className="font-semibold">{contract.currency} {contract.total_amount.toLocaleString()}</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-[#6B6560] mb-3">Milestones ({contract.milestones.length})</p>
              <div className="space-y-2">
                {contract.milestones.map((m, i) => (
                  <div key={m.id} className="flex justify-between items-center bg-[#FAFAF8] rounded-lg px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-[#9C9690]">#{i + 1}</span>
                      <span>{m.title}</span>
                    </div>
                    <span className="font-medium">{contract.currency} {m.amount.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {contract.freelancer_id ? (
            <div className="flex items-center justify-center gap-2 text-emerald-600">
              <CheckCircle className="w-5 h-5" />
              <span>This contract has already been accepted</span>
            </div>
          ) : (
            <button onClick={handleAccept} disabled={accepting} className="btn-primary w-full text-lg py-3 flex items-center justify-center gap-2">
              {accepting ? "Accepting..." : user
                ? <>{connected && <Wallet className="w-5 h-5" />} Accept Contract {connected ? "(on Solana)" : ""}</>
                : "Sign up to Accept"}
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
