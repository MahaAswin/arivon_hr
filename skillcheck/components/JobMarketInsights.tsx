"use client"

import type { RoleRankResult } from "@/lib/roleRanker"

interface Props {
  topRole?: RoleRankResult
}

const companyMap: Record<string, string[]> = {
  "Full Stack Developer": ["Accenture", "Capgemini", "Deloitte", "IBM", "Mindtree"],
  "MERN Developer": ["TCS", "Infosys", "Cognizant", "Wipro", "LTIMindtree"],
  "Frontend Developer": ["Google", "Adobe", "Razorpay", "Swiggy", "PhonePe"],
  "Backend Developer": ["Oracle", "Paytm", "Zoho", "Freshworks", "Flipkart"],
  "Java Backend Developer": ["Infosys", "Wipro", "Cognizant", "HCL", "Tech Mahindra"],
  "Data Analyst": ["Genpact", "Fractal", "Mu Sigma", "KPMG", "EY"],
  "Python Developer": ["Thoughtworks", "Nagarro", "Publicis Sapient", "CitiusTech", "EPAM"],
  "DevOps Engineer": ["AWS", "Microsoft", "Red Hat", "NVIDIA", "Siemens"],
  "Mobile Developer": ["Samsung", "Juspay", "Paytm", "Myntra", "Zomato"],
  "Cloud Engineer": ["Google Cloud", "AWS", "Azure", "TCS", "Capgemini"],
}

const defaultLocations = ["Bengaluru", "Hyderabad", "Pune", "Noida"]

export default function JobMarketInsights({ topRole }: Props) {
  if (!topRole) return null

  const openings = Math.max(120, Math.round(topRole.matchScore * 13.8))
  const demandLabel = topRole.matchScore >= 70 ? "HIGH DEMAND" : topRole.matchScore >= 40 ? "GROWING" : "EMERGING"
  const companies = companyMap[topRole.roleName] ?? ["Accenture", "Capgemini", "Deloitte", "IBM", "Mindtree"]

  return (
    <section className="glass-card p-6 md:p-7 space-y-5 transition-all duration-300 hover:shadow-[0_0_30px_rgba(249,115,22,0.14)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-white font-black uppercase tracking-tight text-lg">Job Market Insights</h3>
          <p className="text-sm text-slate-400">
            Based on your top match: <span className="text-[#F97316] font-semibold">{topRole.roleName}</span>
          </p>
        </div>
        <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-black tracking-wider text-emerald-400 animate-pulse">
          {demandLabel}
        </span>
      </div>

      <div className="flex items-baseline gap-2">
        <p className="text-5xl leading-none font-black text-[#F97316] tabular-nums">{openings.toLocaleString()}</p>
        <p className="text-slate-300 text-sm">open positions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 transition-transform duration-300 hover:-translate-y-0.5">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500 mb-2">Hiring Companies</p>
          <div className="flex flex-wrap gap-1.5">
            {companies.map((company) => (
              <span
                key={company}
                className="rounded-md border border-[#F97316]/25 bg-[#F97316]/10 px-2 py-0.5 text-xs font-semibold text-[#F97316] transition-colors duration-200 hover:bg-[#F97316]/20"
              >
                {company}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 transition-transform duration-300 hover:-translate-y-0.5">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500 mb-2">Top Locations</p>
          <div className="flex flex-wrap gap-1.5">
            {defaultLocations.map((location) => (
              <span
                key={location}
                className="rounded-md border border-sky-400/20 bg-sky-400/10 px-2 py-0.5 text-xs font-semibold text-sky-300 transition-colors duration-200 hover:bg-sky-400/20"
              >
                📍 {location}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
