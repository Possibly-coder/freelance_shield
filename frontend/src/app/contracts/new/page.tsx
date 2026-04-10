"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import api from "@/lib/api";
import { Trash2, Plus } from "lucide-react";

interface MilestoneForm {
  title: string;
  description: string;
  amount: string;
  due_date: string;
}

export default function NewContractPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [currency, setCurrency] = useState("INR");
  const [autoReleaseDays, setAutoReleaseDays] = useState("7");
  const [milestones, setMilestones] = useState<MilestoneForm[]>([
    { title: "", description: "", amount: "", due_date: "" },
  ]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const addMilestone = () => {
    setMilestones([...milestones, { title: "", description: "", amount: "", due_date: "" }]);
  };

  const removeMilestone = (index: number) => {
    setMilestones(milestones.filter((_, i) => i !== index));
  };

  const updateMilestone = (index: number, field: keyof MilestoneForm, value: string) => {
    const updated = [...milestones];
    updated[index] = { ...updated[index], [field]: value };
    setMilestones(updated);
  };

  const totalAmount = milestones.reduce((sum, m) => sum + (parseFloat(m.amount) || 0), 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const payload = {
        title,
        description,
        total_amount: totalAmount,
        currency,
        auto_release_days: parseInt(autoReleaseDays) || 7,
        milestones: milestones.map((m, i) => ({
          title: m.title,
          description: m.description || null,
          amount: parseFloat(m.amount),
          due_date: m.due_date || null,
          position: i,
        })),
      };

      const res = await api.post("/contracts/", payload);
      router.push(`/contracts/${res.data.id}`);
    } catch {
      setError("Failed to create contract. Check all fields.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8">Create New Contract</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="card space-y-5">
            <h2 className="text-lg font-semibold">Contract Details</h2>

            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Title</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                className="input-field" placeholder="e.g. Website Redesign" required />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Description</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)}
                className="input-field min-h-[100px]" placeholder="Describe the project scope..." />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Currency</label>
                <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="input-field">
                  <option value="INR">INR</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Auto-release (days)</label>
                <select value={autoReleaseDays} onChange={(e) => setAutoReleaseDays(e.target.value)} className="input-field">
                  <option value="3">3 days</option>
                  <option value="5">5 days</option>
                  <option value="7">7 days (recommended)</option>
                  <option value="14">14 days</option>
                  <option value="30">30 days</option>
                </select>
                <p className="text-xs text-[#9C9690] mt-1">If client doesn&apos;t respond after freelancer submits, funds auto-release.</p>
              </div>
            </div>
          </div>

          <div className="card space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Milestones</h2>
              <button type="button" onClick={addMilestone} className="btn-secondary text-sm flex items-center gap-1">
                <Plus className="w-4 h-4" /> Add Milestone
              </button>
            </div>

            {milestones.map((m, i) => (
              <div key={i} className="bg-[#F5F3F0] rounded-lg p-4 space-y-4 border border-[#E8E5DF]">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-[#6B6560]">Milestone {i + 1}</span>
                  {milestones.length > 1 && (
                    <button type="button" onClick={() => removeMilestone(i)} className="text-[#9C9690] hover:text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-[#6B6560] mb-1">Title</label>
                    <input type="text" value={m.title} onChange={(e) => updateMilestone(i, "title", e.target.value)}
                      className="input-field" placeholder="e.g. Design mockups" required />
                  </div>
                  <div>
                    <label className="block text-sm text-[#6B6560] mb-1">Amount ({currency})</label>
                    <input type="number" value={m.amount} onChange={(e) => updateMilestone(i, "amount", e.target.value)}
                      className="input-field" placeholder="5000" required min="1" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-[#6B6560] mb-1">Description</label>
                  <input type="text" value={m.description} onChange={(e) => updateMilestone(i, "description", e.target.value)}
                    className="input-field" placeholder="What needs to be delivered?" />
                </div>

                <div className="w-48">
                  <label className="block text-sm text-[#6B6560] mb-1">Due Date (optional)</label>
                  <input type="date" value={m.due_date} onChange={(e) => updateMilestone(i, "due_date", e.target.value)}
                    className="input-field" />
                </div>
              </div>
            ))}

            <div className="flex justify-between items-center pt-4 border-t border-[#E8E5DF]">
              <span className="text-[#6B6560]">Total Contract Value:</span>
              <span className="text-xl font-bold">{currency} {totalAmount.toLocaleString()}</span>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full text-lg py-3">
            {loading ? "Creating..." : "Create Contract"}
          </button>
        </form>
      </main>
    </div>
  );
}
