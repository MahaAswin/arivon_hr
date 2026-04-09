import rolesData from "@/data/roles.json"
import { scoreResume } from "@/lib/skillScorer"

export interface RoleRankResult {
  roleName: string
  matchScore: number
  grade: string
  verdict: "strong" | "partial" | "weak"
  isTopMatch: boolean
}

export function rankRoles(studentSkills: string[]): RoleRankResult[] {
  const results: RoleRankResult[] = rolesData.roles.map((role) => {
    const score = scoreResume(studentSkills, role.keywords)
    return {
      roleName: role.name,
      matchScore: score.matchScore,
      grade: score.grade,
      verdict: score.verdict,
      isTopMatch: false,
    }
  })

  results.sort((a, b) => b.matchScore - a.matchScore)

  if (results.length > 0) results[0].isTopMatch = true

  return results
}
