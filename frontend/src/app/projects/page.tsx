"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import StatusBadge from "@/components/StatusBadge";
import api from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { Project } from "@/lib/types";
import { Search, Briefcase, Clock, DollarSign, Users } from "lucide-react";

const DURATION_LABELS: Record<string, string> = {
  less_than_1_week: "< 1 week",
  "1_to_2_weeks": "1-2 weeks",
  "2_to_4_weeks": "2-4 weeks",
  "1_to_3_months": "1-3 months",
  "3_plus_months": "3+ months",
};

const SKILL_OPTIONS = [
  "React", "Next.js", "Python", "Node.js", "TypeScript", "Django", "FastAPI",
  "Flutter", "iOS", "Android", "UI/UX", "Figma", "Graphic Design", "WordPress",
  "SEO", "Copywriting", "Video Editing", "Data Analysis", "Machine Learning",
  "DevOps", "AWS", "PostgreSQL", "MongoDB",
];

function BrowseProjectsContent() {
  const { user } = useAuth();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSkill, setSelectedSkill] = useState("");

  const fetchProjects = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (searchTerm) params.set("search", searchTerm);
    if (selectedSkill) params.set("skill", selectedSkill);
    try {
      const res = await api.get(`/projects/?${params.toString()}`);
      setProjects(res.data);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [selectedSkill]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProjects();
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-6xl mx-auto px-6 pt-24 pb-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Find Projects</h1>
            <p className="text-[#6B6560] mt-1">Browse open projects and submit proposals</p>
          </div>
          {user && (
            <Link href="/projects/new" className="btn-primary">
              Post a Project
            </Link>
          )}
        </div>

        <form onSubmit={handleSearch} className="flex gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9C9690]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search projects..."
              className="input-field pl-10"
            />
          </div>
          <select
            value={selectedSkill}
            onChange={(e) => setSelectedSkill(e.target.value)}
            className="input-field w-48"
          >
            <option value="">All Skills</option>
            {SKILL_OPTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <button type="submit" className="btn-primary">Search</button>
        </form>

        {loading ? (
          <div className="text-center py-16 text-[#6B6560]">Loading projects...</div>
        ) : projects.length === 0 ? (
          <div className="card text-center py-16">
            <Briefcase className="w-12 h-12 text-[#C4BFB8] mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No projects found</h3>
            <p className="text-[#6B6560]">
              {searchTerm || selectedSkill ? "Try different filters" : "Be the first to post a project!"}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {projects.map((project) => (
              <Link key={project.id} href={`/projects/${project.id}`}
                className="card block hover:border-[#D4D0C8] transition-colors cursor-pointer">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{project.title}</h3>
                    <p className="text-sm text-[#6B6560] mt-1 line-clamp-2">{project.description}</p>

                    {project.skills && project.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {project.skills.map((skill) => (
                          <span key={skill} className="text-xs bg-[#F0EDE8] text-[#1A1A1A] px-2 py-0.5 rounded-full">
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-4 mt-3 text-sm text-[#9C9690]">
                      {(project.budget_min || project.budget_max) && (
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-3.5 h-3.5" />
                          {project.budget_min && project.budget_max
                            ? `${project.currency} ${project.budget_min.toLocaleString()} - ${project.budget_max.toLocaleString()}`
                            : project.budget_max
                              ? `Up to ${project.currency} ${project.budget_max.toLocaleString()}`
                              : `From ${project.currency} ${project.budget_min?.toLocaleString()}`}
                        </span>
                      )}
                      {project.duration && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {DURATION_LABELS[project.duration] || project.duration}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" />
                        {project.proposal_count} proposal{project.proposal_count !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>

                  <div className="text-right ml-4">
                    <StatusBadge status={project.status} />
                    <p className="text-xs text-[#9C9690] mt-2">
                      {new Date(project.created_at).toLocaleDateString()}
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

export default function BrowseProjectsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-[#6B6560]">Loading...</div>}>
      <BrowseProjectsContent />
    </Suspense>
  );
}
