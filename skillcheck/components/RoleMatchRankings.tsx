"use client"

import type { RoleRankResult } from "@/lib/roleRanker"

interface Props {
  rankings: RoleRankResult[]
}

export default function RoleMatchRankings({ rankings }: Props) {
  if (!rankings.length) return null

  return (
    <div style={{ backgroundColor: "#0f1117" }} className="rounded-2xl p-6 w-full">
      <h2 className="text-white font-bold text-base tracking-widest uppercase">Role Match Rankings</h2>
      <p className="text-xs mt-1 mb-5" style={{ color: "#9ca3af" }}>
        Scored across all career profiles
      </p>

      <div className="space-y-3">
        {rankings.map((role) => (
          <div key={role.roleName} style={{ backgroundColor: "#1a1d27" }} className="rounded-xl px-4 py-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {role.isTopMatch && (
                  <span
                    style={{ borderColor: "#f97316", color: "#f97316" }}
                    className="text-[10px] font-bold border px-2 py-0.5 rounded-full tracking-widest"
                  >
                    TOP MATCH
                  </span>
                )}
                <span style={{ color: "#ffffff" }} className="text-sm font-semibold">
                  {role.roleName}
                </span>
              </div>
              <span style={{ color: "#f97316" }} className="font-bold text-sm">
                {role.matchScore}%
              </span>
            </div>

            <div style={{ backgroundColor: "#2a2d3a" }} className="w-full rounded-full h-1.5">
              <div
                style={{
                  width: `${role.matchScore}%`,
                  backgroundColor: "#f97316",
                  transition: "width 0.6s ease",
                }}
                className="h-1.5 rounded-full"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
