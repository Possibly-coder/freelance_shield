"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import StatusBadge from "@/components/StatusBadge";
import api from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { Project, Proposal } from "@/lib/types";
import { Clock, DollarSign, Users, Send, CheckCircle, XCircle, User as UserIcon } from "lucide-react";

const DURATION_LABELS: Record<string, string> = {
  less_than_1_week: "< 1 week",
  "1_to_2_weeks": "1-2 weeks",
  "2_to_4_weeks": "2-4 weeks",
  "1_to_3_months": "1-3 months",
  "3_plus_months": "3+ months",
};

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user } = useAuth();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);

  const [coverLetter, setCoverLetter] = useState("");
  const [proposedAmount, setProposedAmount] = useState("");
  const [estDuration, setEstDuration] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const isClient = user?.id === project?.client_id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const projRes = await api.get(`/projects/${id}`);
        setProject(projRes.data);
        if (user && projRes.data.client_id === user.id) {
          const propRes = await api.get(`/proposals/project/${id}`);
          setProposals(propRes.data);
        }
      } catch { /* not found */ }
      setLoading(false);
    };
    fetchData();
  }, [id, user]);

  const handleSubmitProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/proposals/", {
        project_id: id,
        cover_letter: coverLetter,
        proposed_amount: parseFloat(proposedAmount),
        estimated_duration: estDuration || null,
      });
      setSubmitted(true);
      if (project) {
        setProject({ ...project, proposal_count: project.proposal_count + 1 });
      }
    } catch {
      alert("Failed to submit proposal. You may have already applied.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAccept = async (proposalId: string) => {
    setActionLoading(proposalId);
    try {
      const res = await api.post(`/proposals/${proposalId}/accept`);
      router.push(`/contracts/${res.data.id}`);
    } catch {
      alert("Failed to accept proposal");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (proposalId: string) => {
    setActionLoading(proposalId);
    try {
      await api.post(`/proposals/${proposalId}/reject`);
      setProposals((prev) =>
        prev.map((p) => (p.id === proposalId ? { ...p, status: "rejected" } : p))
      );
    } catch {
      alert("Failed to reject proposal");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center py-32 text-[#6B6560]">Loading...</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center py-32 text-[#6B6560]">Project not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">{project.title}</h1>
            <p className="text-sm text-[#9C9690] mt-1">
              Posted by {project.client?.name} &middot; {new Date(project.created_at).toLocaleDateString()}
            </p>
          </div>
          <StatusBadge status={project.status} />
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          {(project.budget_min || project.budget_max) && (
            <div className="card flex items-center gap-3">
              <DollarSign className="w-6 h-6 text-emerald-600" />
              <div>
                <p className="text-xs text-[#6B6560]">Budget</p>
                <p className="font-semibold">
                  {project.currency}{" "}
                  {project.budget_min && project.budget_max
                    ? `${project.budget_min.toLocaleString()} - ${project.budget_max.toLocaleString()}`
                    : (project.budget_max || project.budget_min || 0).toLocaleString()}
                </p>
              </div>
            </div>
          )}
          {project.duration && (
            <div className="card flex items-center gap-3">
              <Clock className="w-6 h-6 text-blue-600" />
              <div>
                <p className="text-xs text-[#6B6560]">Duration</p>
                <p className="font-semibold">{DURATION_LABELS[project.duration]}</p>
              </div>
            </div>
          )}
          <div className="card flex items-center gap-3">
            <Users className="w-6 h-6 text-violet-600" />
            <div>
              <p className="text-xs text-[#6B6560]">Proposals</p>
              <p className="font-semibold">{project.proposal_count}</p>
            </div>
          </div>
        </div>

        <div className="card mb-6">
          <h2 className="text-lg font-semibold mb-3">Description</h2>
          <p className="text-[#1A1A1A] whitespace-pre-wrap">{project.description}</p>

          {project.skills && project.skills.length > 0 && (
            <div className="mt-4 pt-4 border-t border-[#E8E5DF]">
              <p className="text-sm text-[#6B6560] mb-2">Skills Required</p>
              <div className="flex flex-wrap gap-2">
                {project.skills.map((skill) => (
                  <span key={skill} className="text-sm bg-[#F0EDE8] text-[#1A1A1A] px-3 py-1 rounded-full">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Client view: see proposals */}
        {isClient && proposals.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-4">Proposals ({proposals.length})</h2>
            <div className="space-y-3">
              {proposals.map((proposal) => (
                <div key={proposal.id} className="card">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#F0EDE8] rounded-full flex items-center justify-center">
                        <UserIcon className="w-5 h-5 text-[#6B6560]" />
                      </div>
                      <div>
                        <p className="font-medium">{proposal.freelancer?.name}</p>
                        <p className="text-sm text-[#9C9690]">{proposal.freelancer?.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{project.currency} {proposal.proposed_amount.toLocaleString()}</p>
                      {proposal.estimated_duration && (
                        <p className="text-xs text-[#9C9690]">{proposal.estimated_duration}</p>
                      )}
                    </div>
                  </div>

                  <p className="text-sm text-[#1A1A1A] mb-4">{proposal.cover_letter}</p>

                  {proposal.status === "pending" ? (
                    <div className="flex gap-2 pt-3 border-t border-[#E8E5DF]">
                      <button onClick={() => handleAccept(proposal.id)}
                        disabled={actionLoading === proposal.id}
                        className="btn-primary text-sm flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" />
                        {actionLoading === proposal.id ? "..." : "Accept & Create Contract"}
                      </button>
                      <button onClick={() => handleReject(proposal.id)}
                        disabled={actionLoading === proposal.id}
                        className="btn-danger text-sm flex items-center gap-1">
                        <XCircle className="w-4 h-4" />
                        Reject
                      </button>
                    </div>
                  ) : (
                    <StatusBadge status={proposal.status} />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Freelancer view: submit proposal */}
        {user && !isClient && project.status === "open" && (
          <div className="card">
            {submitted ? (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Proposal Submitted!</h3>
                <p className="text-[#6B6560]">The client will review your proposal and get back to you.</p>
              </div>
            ) : (
              <>
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Send className="w-5 h-5 text-blue-600" />
                  Submit a Proposal
                </h2>
                <form onSubmit={handleSubmitProposal} className="space-y-4">
                  <div>
                    <label className="block text-sm text-[#6B6560] mb-1">Cover Letter</label>
                    <textarea value={coverLetter} onChange={(e) => setCoverLetter(e.target.value)}
                      className="input-field min-h-[120px]"
                      placeholder="Introduce yourself and explain why you're the right fit..."
                      required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-[#6B6560] mb-1">Your Rate ({project.currency})</label>
                      <input type="number" value={proposedAmount} onChange={(e) => setProposedAmount(e.target.value)}
                        className="input-field" placeholder="15000" required min="1" />
                    </div>
                    <div>
                      <label className="block text-sm text-[#6B6560] mb-1">Estimated Duration</label>
                      <input type="text" value={estDuration} onChange={(e) => setEstDuration(e.target.value)}
                        className="input-field" placeholder="e.g. 2 weeks" />
                    </div>
                  </div>
                  <button type="submit" disabled={submitting} className="btn-primary w-full">
                    {submitting ? "Submitting..." : "Submit Proposal"}
                  </button>
                </form>
              </>
            )}
          </div>
        )}

        {!user && project.status === "open" && (
          <div className="card text-center py-8">
            <p className="text-[#6B6560] mb-4">Sign up or log in to submit a proposal</p>
            <a href="/auth/signup" className="btn-primary">Get Started</a>
          </div>
        )}
      </main>
    </div>
  );
}
