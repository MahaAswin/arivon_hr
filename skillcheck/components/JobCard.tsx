"use client"
import { SkillBadge } from "./SkillBadge"
import type { Job } from "@/types"

function MatchBadge({ score, verdict }: { score: number; verdict: string }) {
  const variant = verdict === "strong" ? "green" : verdict === "partial" ? "amber" : "red"
  const glow =
    verdict === "strong"
      ? "shadow-[0_0_12px_rgba(34,197,94,0.3)]"
      : verdict === "partial"
      ? "shadow-[0_0_12px_rgba(245,158,11,0.3)]"
      : "shadow-[0_0_12px_rgba(239,68,68,0.3)]"
  return (
    <span className={`${glow} rounded-full`}>
      <SkillBadge label={`${score}% match`} variant={variant} />
    </span>
  )
}

export function JobCard({ job, onSelect }: { job: Job; onSelect?: () => void }) {
  const date = job.postedDate ? new Date(job.postedDate).toLocaleDateString() : ""
  return (
    <div className="glass-card p-4 hover:border-white/20 hover:shadow-[0_0_20px_rgba(249,115,22,0.08)] transition-all duration-300">
      <div className="flex items-start justify-between gap-2 flex-wrap">
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-slate-100 truncate">{job.title}</h3>
          <p className="text-sm text-slate-400">{job.company} · {job.location}</p>
          {date && <p className="text-xs text-slate-600 mt-0.5">{date}</p>}
        </div>
        {job.scoreResult && (
          <MatchBadge score={job.scoreResult.matchScore} verdict={job.scoreResult.verdict} />
        )}
      </div>

      {job.extractedSkills && job.extractedSkills.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2.5">
          {job.extractedSkills.slice(0, 5).map((s) => <SkillBadge key={s} label={s} variant="blue" />)}
          {job.extractedSkills.length > 5 && (
            <span className="text-xs text-slate-500 self-center">+{job.extractedSkills.length - 5} more</span>
          )}
        </div>
      )}

      <div className="flex gap-2 mt-3">
        {onSelect && (
          <button
            onClick={onSelect}
            className="px-3 py-1.5 rounded-lg text-sm font-semibold bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white transition-all duration-200"
          >
            View Details
          </button>
        )}
        <a href={job.applyUrl} target="_blank" rel="noopener noreferrer">
          <button className="glow-button text-sm py-1.5 px-4">Apply →</button>
        </a>
      </div>
    </div>
  )
}
