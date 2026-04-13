"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import api from "@/lib/api";
import { X } from "lucide-react";

const SKILL_OPTIONS = [
  "React", "Next.js", "Python", "Node.js", "TypeScript", "Django", "FastAPI",
  "Flutter", "iOS", "Android", "UI/UX", "Figma", "Graphic Design", "WordPress",
  "SEO", "Copywriting", "Video Editing", "Data Analysis", "Machine Learning",
  "DevOps", "AWS", "PostgreSQL", "MongoDB",
];

const DURATION_OPTIONS = [
  { value: "less_than_1_week", label: "Less than 1 week" },
  { value: "1_to_2_weeks", label: "1-2 weeks" },
  { value: "2_to_4_weeks", label: "2-4 weeks" },
  { value: "1_to_3_months", label: "1-3 months" },
  { value: "3_plus_months", label: "3+ months" },
];

export default function NewProjectPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [budgetMin, setBudgetMin] = useState("");
  const [budgetMax, setBudgetMax] = useState("");
  const [currency, setCurrency] = useState("INR");
  const [duration, setDuration] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const toggleSkill = (skill: string) => {
    setSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/projects/", {
        title,
        description,
        skills,
        budget_min: budgetMin ? parseFloat(budgetMin) : null,
        budget_max: budgetMax ? parseFloat(budgetMax) : null,
        currency,
        duration: duration || null,
      });
      router.push(`/projects/${res.data.id}`);
    } catch {
      setError("Failed to create project. Check all fields.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-3xl mx-auto px-6 pt-24 pb-8">
        <h1 className="text-2xl font-bold mb-8">Post a Project</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="card space-y-5">
            <h2 className="text-lg font-semibold">Project Details</h2>

            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Title</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                className="input-field" placeholder="e.g. Build a mobile app for my restaurant" required />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Description</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)}
                className="input-field min-h-[150px]"
                placeholder="Describe what you need built, the requirements, and any relevant details..."
                required />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Skills Required</label>
              <div className="flex flex-wrap gap-2">
                {SKILL_OPTIONS.map((skill) => (
                  <button key={skill} type="button" onClick={() => toggleSkill(skill)}
                    className={`text-sm px-3 py-1.5 rounded-full border transition-colors ${
                      skills.includes(skill)
                        ? "bg-blue-600 border-blue-500 text-[#1A1A1A]"
                        : "bg-[#F0EDE8] border-[#D4D0C8] text-[#6B6560] hover:border-[#C4BFB8]"
                    }`}>
                    {skill}
                    {skills.includes(skill) && <X className="w-3 h-3 inline ml-1" />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="card space-y-5">
            <h2 className="text-lg font-semibold">Budget & Timeline</h2>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-[#6B6560] mb-1">Currency</label>
                <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="input-field">
                  <option value="INR">INR</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-[#6B6560] mb-1">Min Budget</label>
                <input type="number" value={budgetMin} onChange={(e) => setBudgetMin(e.target.value)}
                  className="input-field" placeholder="5000" />
              </div>
              <div>
                <label className="block text-sm text-[#6B6560] mb-1">Max Budget</label>
                <input type="number" value={budgetMax} onChange={(e) => setBudgetMax(e.target.value)}
                  className="input-field" placeholder="25000" />
              </div>
            </div>

            <div>
              <label className="block text-sm text-[#6B6560] mb-1">Expected Duration</label>
              <select value={duration} onChange={(e) => setDuration(e.target.value)} className="input-field w-64">
                <option value="">Select duration</option>
                {DURATION_OPTIONS.map((d) => (
                  <option key={d.value} value={d.value}>{d.label}</option>
                ))}
              </select>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full text-lg py-3">
            {loading ? "Posting..." : "Post Project"}
          </button>
        </form>
      </main>
    </div>
  );
}
