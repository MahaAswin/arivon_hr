"use client"
import { useState } from "react"
import { ResumeUpload } from "@/components/ResumeUpload"
import { SkillBadge } from "@/components/SkillBadge"
import { ScoreCard } from "@/components/ScoreCard"
import { rankRoles, RoleRankResult } from "@/lib/roleRanker"
import RoleMatchRankings from "@/components/RoleMatchRankings"
import JobMarketInsights from "@/components/JobMarketInsights"
import type { ExtractedResult, ScoreResult } from "@/types"

const DOMAIN_VARIANTS: Record<string, "green" | "blue" | "amber" | "red" | "orange" | "default"> = {
  Backend: "blue",
  Frontend: "green",
  DevOps: "amber",
  Database: "red",
  "Data & AI": "orange",
}

const DOMAIN_ICONS: Record<string, string> = {
  Backend: "⚙️",
  Frontend: "🎨",
  DevOps: "🚀",
  Database: "🗄️",
  "Data & AI": "🤖",
}

function DomainStrengthBar({ domain, skills, total }: { domain: string; skills: string[]; total: number }) {
  const pct = total > 0 ? Math.round((skills.length / total) * 100) : 0
  const level = pct >= 70 ? "strong" : pct >= 35 ? "partial" : "weak"
  const barColor =
    level === "strong" ? "bg-emerald-500" : level === "partial" ? "bg-amber-500" : "bg-red-500"
  const textColor =
    level === "strong" ? "text-emerald-400" : level === "partial" ? "text-amber-400" : "text-red-400"

  return (
    <div className="glass-card p-4 space-y-2">
      <div className="flex items-center justify-between">
        <span className="font-bold text-slate-200 text-sm">
          {DOMAIN_ICONS[domain] ?? "🔧"} {domain}
        </span>
        <span className={`text-xs font-black uppercase tracking-wider ${textColor}`}>
          {level === "strong" ? "Strong" : level === "partial" ? "Moderate" : "Weak"}
        </span>
      </div>
      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-700 ${barColor}`} style={{ width: `${pct}%` }} />
      </div>
      <div className="flex flex-wrap gap-1 pt-1">
        {skills.map((s) => (
          <SkillBadge key={s} label={s} variant={DOMAIN_VARIANTS[domain] ?? "default"} />
        ))}
      </div>
    </div>
  )
}

export default function ResumePage() {
  const [loading, setLoading] = useState(false)
  const [extracted, setExtracted] = useState<ExtractedResult | null>(null)
  const [keywords, setKeywords] = useState("")
  const [scoring, setScoring] = useState(false)
  const [scoreResult, setScoreResult] = useState<ScoreResult | null>(null)
  const [roleRankings, setRoleRankings] = useState<RoleRankResult[]>([])
  const [error, setError] = useState<string | null>(null)

  async function handleFile(file: File) {
    setLoading(true)
    setError(null)
    setExtracted(null)
    setScoreResult(null)
    try {
      const form = new FormData()
      form.append("resume", file)
      const res = await fetch("/api/resume/parse", { method: "POST", body: form })
      if (!res.ok) throw new Error("Parse failed")
      const data: ExtractedResult = await res.json()
      setExtracted(data)
      const rankings = rankRoles(data.extractedSkills)
      setRoleRankings(rankings)
      if (rankings.length > 0) {
        const top = rankings[0]
        setScoreResult({
          matchScore: top.matchScore,
          grade: top.grade,
          matchedSkills: [],
          partialSkills: [],
          missingSkills: [],
          verdict: top.verdict,
        })
      }
      localStorage.setItem("studentSkills", JSON.stringify(data.extractedSkills))
    } catch {
      setError("Failed to parse resume. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  async function handleScore() {
    if (!extracted) return
    const jobKeywords = keywords.split(",").map((k) => k.trim()).filter(Boolean)
    if (!jobKeywords.length) return
    setScoring(true)
    setError(null)
    try {
      const res = await fetch("/api/resume/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentSkills: extracted.extractedSkills, jobKeywords }),
      })
      if (!res.ok) throw new Error("Score failed")
      setScoreResult(await res.json())
    } catch {
      setError("Failed to score. Please try again.")
    } finally {
      setScoring(false)
    }
  }

  const totalSkillsInData = Object.values(extracted?.domainBreakdown ?? {}).reduce(
    (acc, skills) => acc + skills.length, 0
  )

  return (
    <main className="min-h-screen bg-[#0F172A] py-10 px-4">
      {/* Background blobs */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-[#F97316]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-6 relative">
        {/* Header */}
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-[#F97316] mb-1">ATS Resume Tracker</p>
          <h1 className="text-3xl font-black tracking-tighter text-white uppercase">Know Where You Stand</h1>
          <p className="text-sm text-slate-400 mt-1">Upload your PDF to extract skills and check your ATS score</p>
        </div>

        {/* Step 1: Upload */}
        <div className="glass-card p-5 max-w-2xl mx-auto w-full">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">Step 01 — Upload Resume</p>
          <ResumeUpload onFile={handleFile} loading={loading} />
          {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
        </div>

        <div className="flex flex-wrap items-start gap-6">
          {/* Left column */}
          <div className="flex-[0.95] min-w-[320px] space-y-6">
            {/* Step 2: Domain Strength */}
            {extracted && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
                    Step 02 — Skill Breakdown
                  </p>
                  <span className="text-xs font-bold text-[#F97316]">
                    {extracted.extractedSkills.length} skills detected
                  </span>
                </div>

                {extracted.extractedSkills.length === 0 ? (
                  <div className="glass-card p-6 text-center text-slate-500 text-sm">
                    No recognizable skills found. Try a different resume.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-3">
                    {Object.entries(extracted.domainBreakdown).map(([domain, skills]) => (
                      <DomainStrengthBar
                        key={domain}
                        domain={domain}
                        skills={skills}
                        total={skills.length}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Job Match */}
            {extracted && extracted.extractedSkills.length > 0 && (
              <div className="glass-card p-5 space-y-4">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Step 03 — Check Job Match</p>
                <p className="text-sm text-slate-400">
                  Enter job keywords separated by commas (e.g. react, node.js, sql)
                </p>
                <div className="flex gap-2">
                  <input
                    className="glass-input flex-1 text-sm"
                    placeholder="java, spring boot, sql, docker…"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleScore()}
                  />
                  <button
                    onClick={handleScore}
                    disabled={scoring || !keywords.trim()}
                    className="glow-button text-sm whitespace-nowrap"
                  >
                    {scoring ? "Checking…" : "Check Match"}
                  </button>
                </div>
              </div>
            )}

            {/* Score Result */}
            {scoreResult && (
              <ScoreCard
                result={scoreResult}
                domainBreakdown={extracted?.domainBreakdown}
                jobKeywords={keywords.split(",").map((k) => k.trim()).filter(Boolean)}
              />
            )}
          </div>

          {/* Right column */}
          <div className="flex-[1.25] min-w-[360px] space-y-6">
            {roleRankings.length > 0 && <RoleMatchRankings rankings={roleRankings} />}
            {roleRankings.length > 0 && <JobMarketInsights topRole={roleRankings[0]} />}
          </div>
        </div>
      </div>
    </main>
  )
}
