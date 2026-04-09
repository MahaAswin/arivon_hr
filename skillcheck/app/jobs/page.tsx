"use client"
import { useState, useEffect } from "react"
import { JobCard } from "@/components/JobCard"
import { ScoreCard } from "@/components/ScoreCard"
import type { Job } from "@/types"
import Link from "next/link"

export default function JobsPage() {
  const [role, setRole] = useState("")
  const [location, setLocation] = useState("")
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [hasSkills, setHasSkills] = useState<boolean | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem("studentSkills")
    setHasSkills(!!stored && JSON.parse(stored).length > 0)
  }, [])

  async function handleSearch() {
    if (!role.trim()) return
    setLoading(true)
    setError(null)
    setSelectedJob(null)
    try {
      const stored = localStorage.getItem("studentSkills")
      const studentSkills: string[] = stored ? JSON.parse(stored) : []

      const res = studentSkills.length
        ? await fetch("/api/jobs/check", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ studentSkills, role, location }),
          })
        : await fetch(`/api/jobs?role=${encodeURIComponent(role)}&location=${encodeURIComponent(location)}`)

      if (!res.ok) throw new Error("Failed to fetch jobs")
      setJobs(await res.json())
    } catch {
      setError("Failed to fetch jobs. Check your API keys or try again.")
    } finally {
      setLoading(false)
    }
  }

  if (hasSkills === null) return null

  if (!hasSkills) {
    return (
      <main className="min-h-screen bg-[#0F172A] flex items-center justify-center px-4">
        <div className="fixed top-0 right-1/4 w-96 h-96 bg-[#F97316]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="fixed bottom-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="glass-card p-10 max-w-md w-full text-center space-y-5 relative">
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-40 h-40 bg-[#F97316]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="text-5xl">📄</div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#F97316] mb-2">Resume Required</p>
            <h2 className="text-2xl font-black tracking-tighter text-white uppercase">Upload Your Resume First</h2>
            <p className="text-sm text-slate-400 mt-2 leading-relaxed">
              We need your resume to extract your skills and calculate match scores against job listings.
            </p>
          </div>
          <Link href="/resume">
            <button className="glow-button w-full mt-2">Go to Resume Tracker →</button>
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#0F172A] py-10 px-4">
      <div className="fixed top-0 right-1/4 w-96 h-96 bg-[#F97316]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-3xl mx-auto space-y-6 relative">
        {/* Header */}
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-[#F97316] mb-1">Job Finder</p>
          <h1 className="text-3xl font-black tracking-tighter text-white uppercase">Find Your Next Role</h1>
          <p className="text-sm text-slate-400 mt-1">Match scores calculated from your parsed resume</p>
        </div>

        {/* Search */}
        <div className="glass-card p-5">
          <div className="flex gap-2 flex-wrap">
            <input
              className="glass-input flex-1 min-w-[160px] text-sm"
              placeholder="Role (e.g. backend developer)"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <input
              className="glass-input flex-1 min-w-[140px] text-sm"
              placeholder="Location (e.g. bangalore)"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <button onClick={handleSearch} disabled={loading || !role.trim()} className="glow-button text-sm">
              {loading ? "Searching…" : "Find Jobs →"}
            </button>
          </div>
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        {/* Skeletons */}
        {loading && (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="glass-card p-4 space-y-2 animate-pulse">
                <div className="h-4 bg-white/5 rounded w-2/3" />
                <div className="h-3 bg-white/5 rounded w-1/3" />
                <div className="h-3 bg-white/5 rounded w-1/2" />
              </div>
            ))}
          </div>
        )}

        {/* Job list */}
        {!loading && jobs.length > 0 && (
          <div className="space-y-3">
            {jobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onSelect={() => setSelectedJob(selectedJob?.id === job.id ? null : job)}
              />
            ))}
          </div>
        )}

        {!loading && jobs.length === 0 && role && !error && (
          <p className="text-center text-slate-500 py-10">No jobs found. Try a different role or location.</p>
        )}

        {/* Expanded detail */}
        {selectedJob && (
          <div className="glass-card p-6 space-y-4 border-[#F97316]/20">
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-[#F97316]/10 rounded-full blur-2xl pointer-events-none" />
            <div>
              <h2 className="text-xl font-black tracking-tighter text-white">{selectedJob.title}</h2>
              <p className="text-sm text-slate-400">{selectedJob.company} · {selectedJob.location}</p>
            </div>
            <p className="text-sm text-slate-300 whitespace-pre-line line-clamp-10 leading-relaxed">
              {selectedJob.description}
            </p>
            {selectedJob.scoreResult && <ScoreCard result={selectedJob.scoreResult} />}
            <a href={selectedJob.applyUrl} target="_blank" rel="noopener noreferrer">
              <button className="glow-button">Apply Now →</button>
            </a>
          </div>
        )}
      </div>
    </main>
  )
}
