import pdfParse from "pdf-parse"
import skillsData from "@/data/skills.json"
import type { ExtractedResult } from "@/types"

export async function extractSkills(pdfBuffer: Buffer): Promise<ExtractedResult> {
  const data = await pdfParse(pdfBuffer)
  const rawText = data.text
  const lowerText = rawText.toLowerCase()

  const domainBreakdown: Record<string, string[]> = {}
  const extractedSkills: string[] = []

  for (const domain of skillsData.domains) {
    const found: string[] = []
    for (const skill of domain.skills) {
      const matched = skill.aliases.some((alias) =>
        new RegExp(`\\b${alias.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i").test(lowerText)
      )
      if (matched) {
        found.push(skill.name)
        if (!extractedSkills.includes(skill.name)) {
          extractedSkills.push(skill.name)
        }
      }
    }
    if (found.length > 0) {
      domainBreakdown[domain.name] = found
    }
  }

  return { extractedSkills, rawText, domainBreakdown }
}
