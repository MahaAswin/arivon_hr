export interface Skill {
  name: string
  aliases: string[]
}

export interface Domain {
  name: string
  skills: Skill[]
}

export interface ExtractedResult {
  extractedSkills: string[]
  rawText: string
  domainBreakdown: Record<string, string[]>
}

export interface ScoreResult {
  matchScore: number
  grade: string
  matchedSkills: string[]
  partialSkills: { yourSkill: string; jobSkill: string; credit: number }[]
  missingSkills: string[]
  verdict: "strong" | "partial" | "weak"
}

export interface RoleRankResult {
  roleName: string
  matchScore: number
  grade: string
  verdict: "strong" | "partial" | "weak"
  isTopMatch: boolean
}

export interface Job {
  id: string
  title: string
  company: string
  location: string
  description: string
  applyUrl: string
  postedDate: string
  extractedSkills?: string[]
  scoreResult?: ScoreResult
}
