export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  phone: string | null;
  avatar_url: string | null;
  created_at: string;
}

export interface Milestone {
  id: string;
  contract_id: string;
  title: string;
  description: string | null;
  amount: number;
  due_date: string | null;
  position: number;
  status: "pending" | "funded" | "in_progress" | "submitted" | "approved" | "disputed";
  funded_at: string | null;
  submitted_at: string | null;
  approved_at: string | null;
  auto_release_at: string | null;
}

export interface Contract {
  id: string;
  title: string;
  description: string | null;
  client_id: string;
  freelancer_id: string | null;
  status: "draft" | "active" | "completed" | "disputed" | "cancelled";
  total_amount: number;
  currency: string;
  auto_release_days: number;
  invite_token: string;
  created_at: string;
  signed_at: string | null;
  completed_at: string | null;
  milestones: Milestone[];
  client: User | null;
  freelancer: User | null;
}

export interface Payment {
  id: string;
  milestone_id: string;
  payer_id: string;
  payee_id: string | null;
  amount: number;
  currency: string;
  type: "escrow_in" | "release" | "refund";
  status: "pending" | "captured" | "transferred" | "refunded" | "failed";
  razorpay_payment_id: string | null;
  razorpay_order_id: string | null;
  created_at: string;
}

export interface Dispute {
  id: string;
  contract_id: string;
  milestone_id: string | null;
  raised_by: string;
  reason: string;
  status: string;
  resolution: string | null;
  created_at: string;
  resolved_at: string | null;
}

export interface Project {
  id: string;
  client_id: string;
  title: string;
  description: string;
  skills: string[] | null;
  budget_min: number | null;
  budget_max: number | null;
  currency: string;
  duration: string | null;
  status: "open" | "in_progress" | "closed" | "cancelled";
  proposal_count: number;
  created_at: string;
  client: User | null;
}

export interface Proposal {
  id: string;
  project_id: string;
  freelancer_id: string;
  cover_letter: string;
  proposed_amount: number;
  estimated_duration: string | null;
  status: "pending" | "accepted" | "rejected" | "withdrawn";
  created_at: string;
  freelancer: User | null;
}
