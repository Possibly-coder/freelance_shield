"use client";

import { useEffect, useState, use } from "react";
import Navbar from "@/components/Navbar";
import StatusBadge from "@/components/StatusBadge";
import api from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { useAnchorProvider } from "@/lib/useProgram";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  fundMilestoneOnChain,
  submitMilestoneOnChain,
  approveMilestoneOnChain,
  releaseMilestoneOnChain,
  autoReleaseOnChain,
  raiseDisputeOnChain,
} from "@/lib/program-client";
import { getContractPda } from "@/lib/solana";
import { Contract, Milestone } from "@/lib/types";
import { Copy, Check, AlertTriangle, Timer, Wallet, Zap } from "lucide-react";
import { PublicKey } from "@solana/web3.js";

export default function ContractDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user } = useAuth();
  const provider = useAnchorProvider();
  const { publicKey, connected } = useWallet();
  const [contract, setContract] = useState<Contract | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [txSignature, setTxSignature] = useState<string | null>(null);

  const fetchContract = async () => {
    try {
      const res = await api.get(`/contracts/${id}`);
      setContract(res.data);
    } catch { /* not found */ }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchContract(); }, [id]);

  const copyInviteLink = () => {
    if (!contract) return;
    const link = `${window.location.origin}/contracts/invite/${contract.invite_token}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSolanaAction = async (
    action: string,
    milestoneId: string,
    milestoneIndex: number,
    fn: () => Promise<void>,
  ) => {
    setActionLoading(milestoneId);
    setTxSignature(null);
    try {
      await fn();
      setTxSignature("success");
      await fetchContract();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Transaction failed";
      alert(`${action} failed: ${msg}`);
    } finally {
      setActionLoading(null);
    }
  };

  const fundMilestone = async (milestoneId: string, milestoneIndex: number) => {
    if (!provider || !publicKey || !contract) return;
    const contractPda = getContractPda(publicKey, parseInt(contract.id.split("-")[0], 16));
    await handleSolanaAction("Fund", milestoneId, milestoneIndex, () =>
      fundMilestoneOnChain(provider, contractPda, milestoneIndex)
    );
  };

  const fundMilestoneFiat = async (milestoneId: string) => {
    setActionLoading(milestoneId);
    try {
      await api.post("/payments/fund-demo", { milestone_id: milestoneId });
      await fetchContract();
    } catch { alert("Failed to fund milestone"); }
    finally { setActionLoading(null); }
  };

  const useSolana = (c: Contract | null) => c?.currency === "USDC" && !!provider && !!publicKey;

  const submitMilestone = async (milestoneId: string, milestoneIndex: number) => {
    if (useSolana(contract)) {
      const contractPda = getContractPda(publicKey!, parseInt(contract!.id.split("-")[0], 16));
      await handleSolanaAction("Submit", milestoneId, milestoneIndex, () =>
        submitMilestoneOnChain(provider!, contractPda, milestoneIndex)
      );
    } else {
      setActionLoading(milestoneId);
      try {
        await api.post(`/milestones/${milestoneId}/submit?description=Work completed`);
        await fetchContract();
      } catch { alert("Failed to submit milestone"); }
      finally { setActionLoading(null); }
    }
  };

  const approveMilestone = async (milestoneId: string, milestoneIndex: number) => {
    if (useSolana(contract)) {
      const contractPda = getContractPda(publicKey!, parseInt(contract!.id.split("-")[0], 16));
      await handleSolanaAction("Approve", milestoneId, milestoneIndex, () =>
        approveMilestoneOnChain(provider!, contractPda, milestoneIndex)
      );
    } else {
      setActionLoading(milestoneId);
      try {
        await api.post(`/milestones/${milestoneId}/approve`);
        await fetchContract();
      } catch { alert("Failed to approve milestone"); }
      finally { setActionLoading(null); }
    }
  };

  const releaseFunds = async (milestoneId: string, milestoneIndex: number) => {
    if (useSolana(contract) && contract?.freelancer_id) {
      const contractPda = getContractPda(publicKey!, parseInt(contract!.id.split("-")[0], 16));
      const freelancerKey = new PublicKey(contract!.freelancer_id);
      await handleSolanaAction("Release", milestoneId, milestoneIndex, () =>
        releaseMilestoneOnChain(provider!, contractPda, milestoneIndex, freelancerKey)
      );
    } else {
      setActionLoading(milestoneId);
      try {
        await api.post(`/payments/release/${milestoneId}`);
        await fetchContract();
      } catch { alert("Failed to release funds"); }
      finally { setActionLoading(null); }
    }
  };

  const raiseDispute = async (milestoneId: string, milestoneIndex: number) => {
    const reason = prompt("Reason for dispute:");
    if (!reason) return;

    if (useSolana(contract)) {
      const contractPda = getContractPda(publicKey!, parseInt(contract!.id.split("-")[0], 16));
      await handleSolanaAction("Dispute", milestoneId, milestoneIndex, () =>
        raiseDisputeOnChain(provider!, contractPda, milestoneIndex)
      );
    }

    try {
      await api.post("/disputes/", { contract_id: id, milestone_id: milestoneId, reason });
    } catch { /* best effort */ }
    await fetchContract();
  };

  if (loading) {
    return (
      <div className="min-h-screen"><Navbar />
        <div className="flex items-center justify-center py-32 text-[#6B6560]">Loading...</div>
      </div>
    );
  }
  if (!contract) {
    return (
      <div className="min-h-screen"><Navbar />
        <div className="flex items-center justify-center py-32 text-[#6B6560]">Contract not found</div>
      </div>
    );
  }

  const isClient = user?.id === contract.client_id;
  const isFreelancer = user?.id === contract.freelancer_id;
  const isSolanaContract = contract.currency === "USDC";

  const getMilestoneActions = (m: Milestone, index: number) => {
    const actions: { label: string; onClick: () => void; variant: string; icon?: string }[] = [];
    const isLoading = actionLoading === m.id;

    if (isClient && m.status === "pending") {
      if (isSolanaContract && connected) {
        actions.push({ label: isLoading ? "..." : "Fund on Solana", onClick: () => fundMilestone(m.id, index), variant: "btn-primary", icon: "solana" });
      } else {
        actions.push({ label: isLoading ? "..." : "Fund (Razorpay)", onClick: () => fundMilestoneFiat(m.id), variant: "btn-primary" });
      }
    }
    if (isFreelancer && (m.status === "funded" || m.status === "in_progress")) {
      actions.push({ label: isLoading ? "..." : "Submit Work", onClick: () => submitMilestone(m.id, index), variant: "btn-primary" });
    }
    if (isClient && m.status === "submitted") {
      actions.push({ label: isLoading ? "..." : "Approve", onClick: () => approveMilestone(m.id, index), variant: "btn-primary" });
      actions.push({ label: "Dispute", onClick: () => raiseDispute(m.id, index), variant: "btn-danger" });
    }
    if (isClient && m.status === "approved") {
      actions.push({ label: isLoading ? "..." : "Release Funds", onClick: () => releaseFunds(m.id, index), variant: "btn-primary" });
    }
    if ((isClient || isFreelancer) && ["funded", "submitted"].includes(m.status)) {
      actions.push({ label: "Dispute", onClick: () => raiseDispute(m.id, index), variant: "btn-danger" });
    }
    return actions;
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 pt-24 pb-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">{contract.title}</h1>
            <p className="text-[#6B6560] mt-1">{contract.description}</p>
          </div>
          <StatusBadge status={contract.status} />
        </div>

        {/* Solana info banner */}
        {connected && isSolanaContract && (
          <div className="card mb-4 bg-[#1f2fe7]/5 border-[#1f2fe7]/20 flex items-center gap-3">
            <Zap className="w-5 h-5 text-[#1f2fe7]" />
            <div>
              <p className="text-sm font-semibold text-[#1f2fe7]">Solana Escrow Active</p>
              <p className="text-xs text-[#5f5e5e]">
                Payments are secured on-chain. USDC is locked in program-owned vaults until milestones are approved.
              </p>
            </div>
          </div>
        )}

        {txSignature && (
          <div className="card mb-4 bg-emerald-50 border-emerald-200">
            <p className="text-sm text-emerald-700 font-medium flex items-center gap-2">
              <Check className="w-4 h-4" /> Transaction confirmed on Solana
            </p>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <div className="card">
            <p className="text-sm text-[#6B6560] mb-1">Client</p>
            <p className="font-medium">{contract.client?.name || "---"}</p>
            <p className="text-sm text-[#9C9690]">{contract.client?.email}</p>
          </div>
          <div className="card">
            <p className="text-sm text-[#6B6560] mb-1">Freelancer</p>
            {contract.freelancer ? (
              <>
                <p className="font-medium">{contract.freelancer.name}</p>
                <p className="text-sm text-[#9C9690]">{contract.freelancer.email}</p>
              </>
            ) : (
              <div className="flex items-center gap-3 mt-2">
                <p className="text-amber-600 text-sm">Waiting for freelancer to accept</p>
                <button onClick={copyInviteLink} className="btn-secondary text-xs flex items-center gap-1">
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  {copied ? "Copied!" : "Copy Invite Link"}
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="card mb-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-[#6B6560]">Total Contract Value</span>
            <span className="text-xl font-bold">{contract.currency} {contract.total_amount.toLocaleString()}</span>
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Milestones</h2>
          {contract.milestones.map((m, i) => {
            const actions = getMilestoneActions(m, i);
            return (
              <div key={m.id} className="card">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-[#9C9690] font-mono">#{i + 1}</span>
                    <h3 className="font-medium">{m.title}</h3>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold">{contract.currency} {m.amount.toLocaleString()}</span>
                    <StatusBadge status={m.status} />
                  </div>
                </div>
                {m.description && <p className="text-sm text-[#6B6560] mb-3">{m.description}</p>}
                {m.due_date && <p className="text-xs text-[#9C9690] mb-3">Due: {new Date(m.due_date).toLocaleDateString()}</p>}

                {m.status === "submitted" && m.auto_release_at && (() => {
                  const releaseDate = new Date(m.auto_release_at);
                  const now = new Date();
                  const daysLeft = Math.max(0, Math.ceil((releaseDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
                  return (
                    <div className={`flex items-center gap-2 text-sm mb-3 px-3 py-2 rounded-lg ${
                      daysLeft <= 2
                        ? "bg-amber-50 border border-amber-200 text-amber-600"
                        : "bg-blue-50 border border-blue-200 text-blue-600"
                    }`}>
                      <Timer className="w-4 h-4" />
                      {daysLeft === 0
                        ? connected
                          ? "Auto-release ready — anyone can trigger it on-chain now!"
                          : isClient
                            ? "Auto-releasing today -- approve or raise a dispute now"
                            : "Funds auto-release today!"
                        : isClient
                          ? `${daysLeft} day${daysLeft !== 1 ? "s" : ""} to review before ${connected ? "permissionless" : ""} auto-release`
                          : `Funds auto-release in ${daysLeft} day${daysLeft !== 1 ? "s" : ""} if client doesn't respond`
                      }
                    </div>
                  );
                })()}

                {actions.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-3 border-t border-[#E8E5DF]">
                    {actions.map((a, j) => (
                      <button key={j} onClick={a.onClick} className={`${a.variant} text-sm flex items-center gap-1`}>
                        {a.icon === "solana" && <Wallet className="w-3 h-3" />}
                        {a.label === "Dispute" && <AlertTriangle className="w-3 h-3" />}
                        {a.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
