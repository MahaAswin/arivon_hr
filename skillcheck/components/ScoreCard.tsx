import { SkillBadge } from "./SkillBadge"
import type { ScoreResult } from "@/types"

const verdictConfig = {
  strong: {
    color: "text-emerald-400",
    glow: "shadow-[0_0_30px_rgba(34,197,94,0.2)]",
    bar: "bg-emerald-500",
    label: "Strong Match",
    icon: "🚀",
  },
  partial: {
    color: "text-amber-400",
    glow: "shadow-[0_0_30px_rgba(245,158,11,0.2)]",
    bar: "bg-amber-500",
    label: "Partial Match",
    icon: "⚡",
  },
  weak: {
    color: "text-red-400",
    glow: "shadow-[0_0_30px_rgba(239,68,68,0.2)]",
    bar: "bg-red-500",
    label: "Weak Match",
    icon: "📉",
  },
}

interface DomainStrength {
  domain: string
  matched: number
  total: number
  pct: number
  level: "strong" | "partial" | "weak"
}

interface Props {
  result: ScoreResult
  domainBreakdown?: Record<string, string[]>
  jobKeywords?: string[]
}

function getDomainStrengths(
  domainBreakdown: Record<string, string[]>,
  jobKeywords: string[]
): DomainStrength[] {
  const lower = jobKeywords.map((k) => k.toLowerCase())
  return Object.entries(domainBreakdown)
    .map(([domain, skills]) => {
      const matched = skills.filter((s) => lower.some((k) => s.toLowerCase().includes(k) || k.includes(s.toLowerCase()))).length
      const total = skills.length
      const pct = total > 0 ? Math.round((matched / total) * 100) : 0
      return {
        domain,
        matched,
        total,
        pct,
        level: pct >= 70 ? "strong" : pct >= 35 ? "partial" : "weak",
      }
    })
    .sort((a, b) => b.pct - a.pct)
}

const domainBarColor: Record<string, string> = {
  Backend: "bg-blue-500",
  Frontend: "bg-emerald-500",
  DevOps: "bg-amber-500",
  Database: "bg-red-400",
  "Data & AI": "bg-purple-500",
}

export function ScoreCard({ result, domainBreakdown, jobKeywords }: Props) {
  const cfg = verdictConfig[result.verdict]
  const domainStrengths =
    domainBreakdown && jobKeywords?.length
      ? getDomainStrengths(domainBreakdown, jobKeywords)
      : []

  return (
    <div className={`glass-card p-6 space-y-6 ${cfg.glow}`}>
      {/* Glow blob */}
      <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-[#F97316]/10 blur-3xl pointer-events-none" />

      {/* Score header */}
      <div className="flex items-center gap-5">
        <div className="relative">
          <svg className="w-24 h-24 -rotate-90" viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="15.9" fill="none" stroke="#1E293B" strokeWidth="3" />
            <circle
              cx="18" cy="18" r="15.9" fill="none"
              stroke={result.verdict === "strong" ? "#22C55E" : result.verdict === "partial" ? "#F59E0B" : "#EF4444"}
              strokeWidth="3"
              strokeDasharray={`${result.matchScore} ${100 - result.matchScore}`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-2xl font-black ${cfg.color}`}>{result.matchScore}%</span>
            <span className={`text-[10px] font-bold tracking-[0.18em] uppercase ${cfg.color}`}>
              {result.verdict === "strong" ? "Excellent" : result.verdict === "partial" ? "Moderate" : "Needs Work"}
            </span>
          </div>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">ATS Score</p>
          <div className="flex flex-wrap items-center gap-2">
            <p className={`text-2xl font-black tracking-tighter ${cfg.color}`}>
              {cfg.icon} {cfg.label}
            </p>
            <span className="inline-flex items-center rounded-lg border border-[#F97316]/40 bg-[#F97316]/10 px-2.5 py-1 text-sm font-black text-[#F97316]">
              Grade {result.grade}
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            {result.matchedSkills.length} matched · {result.partialSkills.length} partial · {result.missingSkills.length} missing
          </p>
        </div>
      </div>

      {/* Domain strength breakdown */}
      {domainStrengths.length > 0 && (
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Strength by Domain</p>
          <div className="space-y-2.5">
            {domainStrengths.map(({ domain, pct, level }) => (
              <div key={domain}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-semibold text-slate-300">{domain}</span>
                  <span className={`text-xs font-bold ${
                    level === "strong" ? "text-emerald-400" : level === "partial" ? "text-amber-400" : "text-red-400"
                  }`}>
                    {pct}% {level === "strong" ? "💪" : level === "partial" ? "⚡" : "📉"}
                  </span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${domainBarColor[domain] ?? "bg-slate-500"}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Matched */}
      {result.matchedSkills.length > 0 && (
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">✅ Matched Skills</p>
          <div className="flex flex-wrap gap-1.5">
            {result.matchedSkills.map((s) => <SkillBadge key={s} label={s} variant="green" />)}
          </div>
        </div>
      )}

      {/* Partial */}
      {result.partialSkills.length > 0 && (
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">⚡ Partial Matches</p>
          <div className="flex flex-wrap gap-1.5">
            {result.partialSkills.map((p) => (
              <span key={p.jobSkill} title={`You have: ${p.yourSkill}`}>
                <SkillBadge label={`${p.jobSkill} → ${p.yourSkill}`} variant="amber" />
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Missing */}
      {result.missingSkills.length > 0 && (
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">❌ Missing Skills</p>
          <div className="flex flex-wrap gap-1.5">
            {result.missingSkills.map((s) => <SkillBadge key={s} label={s} variant="red" />)}
          </div>
        </div>
      )}
    </div>
  )
}
