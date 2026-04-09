const colors: Record<string, string> = {
  draft: "bg-gray-700 text-gray-300",
  active: "bg-emerald-900/50 text-emerald-400 border border-emerald-800",
  completed: "bg-blue-900/50 text-blue-400 border border-blue-800",
  disputed: "bg-red-900/50 text-red-400 border border-red-800",
  cancelled: "bg-gray-800 text-gray-500",
  pending: "bg-gray-700 text-gray-300",
  funded: "bg-amber-900/50 text-amber-400 border border-amber-800",
  in_progress: "bg-blue-900/50 text-blue-400 border border-blue-800",
  submitted: "bg-purple-900/50 text-purple-400 border border-purple-800",
  approved: "bg-emerald-900/50 text-emerald-400 border border-emerald-800",
  captured: "bg-emerald-900/50 text-emerald-400 border border-emerald-800",
  transferred: "bg-blue-900/50 text-blue-400 border border-blue-800",
  refunded: "bg-amber-900/50 text-amber-400 border border-amber-800",
  failed: "bg-red-900/50 text-red-400 border border-red-800",
  open: "bg-red-900/50 text-red-400 border border-red-800",
  under_review: "bg-amber-900/50 text-amber-400 border border-amber-800",
  resolved: "bg-emerald-900/50 text-emerald-400 border border-emerald-800",
  resolved_client: "bg-emerald-900/50 text-emerald-400 border border-emerald-800",
  resolved_freelancer: "bg-emerald-900/50 text-emerald-400 border border-emerald-800",
};

export default function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full ${colors[status] || "bg-gray-700 text-gray-300"}`}>
      {status.replace(/_/g, " ")}
    </span>
  );
}
