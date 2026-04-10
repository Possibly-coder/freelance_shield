const colors: Record<string, string> = {
  draft: "bg-gray-100 text-gray-600 border border-gray-200",
  active: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  completed: "bg-blue-50 text-blue-700 border border-blue-200",
  disputed: "bg-red-50 text-red-700 border border-red-200",
  cancelled: "bg-gray-100 text-gray-500 border border-gray-200",
  pending: "bg-gray-100 text-gray-600 border border-gray-200",
  funded: "bg-amber-50 text-amber-700 border border-amber-200",
  in_progress: "bg-blue-50 text-blue-700 border border-blue-200",
  submitted: "bg-violet-50 text-violet-700 border border-violet-200",
  approved: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  captured: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  transferred: "bg-blue-50 text-blue-700 border border-blue-200",
  refunded: "bg-amber-50 text-amber-700 border border-amber-200",
  failed: "bg-red-50 text-red-700 border border-red-200",
  open: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  under_review: "bg-amber-50 text-amber-700 border border-amber-200",
  resolved: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  resolved_client: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  resolved_freelancer: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  accepted: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  rejected: "bg-red-50 text-red-700 border border-red-200",
  withdrawn: "bg-gray-100 text-gray-500 border border-gray-200",
};

export default function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full ${colors[status] || "bg-gray-100 text-gray-600 border border-gray-200"}`}>
      {status.replace(/_/g, " ")}
    </span>
  );
}
