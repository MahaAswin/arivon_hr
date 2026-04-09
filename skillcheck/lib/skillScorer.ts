import skillsData from "@/data/skills.json"
import { Domain, ScoreResult } from "@/types"

const EXACT_CREDIT = 1.0
const PARTIAL_CREDIT = 0.4

function getGrade(score: number): string {
  if (score >= 90) return "A+"
  if (score >= 80) return "A"
  if (score >= 70) return "B"
  if (score >= 60) return "C"
  if (score >= 40) return "D"
  return "F"
}

function getVerdict(score: number): "strong" | "partial" | "weak" {
  if (score >= 70) return "strong"
  if (score >= 40) return "partial"
  return "weak"
}

function findSkillByAlias(alias: string): { skillName: string; domainName: string } | null {
  const domains: Domain[] = skillsData.domains
  for (const domain of domains) {
    for (const skill of domain.skills) {
      if (skill.aliases.some((a) => a.toLowerCase() === alias.toLowerCase())) {
        return { skillName: skill.name, domainName: domain.name }
      }
    }
  }
  return null
}

function findDomainBySkillName(skillName: string): string | null {
  const domains: Domain[] = skillsData.domains
  for (const domain of domains) {
    for (const skill of domain.skills) {
      if (skill.name === skillName) return domain.name
    }
  }
  return null
}

export function scoreResume(studentSkills: string[], jobKeywords: string[]): ScoreResult {
  if (!jobKeywords.length) {
    return {
      matchScore: 0,
      grade: "F",
      matchedSkills: [],
      partialSkills: [],
      missingSkills: [],
      verdict: "weak",
    }
  }

  let totalCredits = 0
  const matchedSkills: string[] = []
  const partialSkills: { yourSkill: string; jobSkill: string; credit: number }[] = []
  const missingSkills: string[] = []

  for (const keyword of jobKeywords) {
    const jobSkillInfo = findSkillByAlias(keyword)
    if (!jobSkillInfo) {
      missingSkills.push(keyword)
      continue
    }

    const { skillName: jobSkillName, domainName: jobDomain } = jobSkillInfo

    if (studentSkills.includes(jobSkillName)) {
      totalCredits += EXACT_CREDIT
      matchedSkills.push(jobSkillName)
      continue
    }

    const partialMatch = studentSkills.find((s) => findDomainBySkillName(s) === jobDomain)
    if (partialMatch) {
      totalCredits += PARTIAL_CREDIT
      partialSkills.push({
        yourSkill: partialMatch,
        jobSkill: jobSkillName,
        credit: PARTIAL_CREDIT,
      })
      continue
    }

    missingSkills.push(jobSkillName)
  }

  const matchScore = Math.round((totalCredits / jobKeywords.length) * 100)

  return {
    matchScore,
    grade: getGrade(matchScore),
    matchedSkills,
    partialSkills,
    missingSkills,
    verdict: getVerdict(matchScore),
  }
}
