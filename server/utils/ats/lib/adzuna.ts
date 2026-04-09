import axios from "axios"
import skillsData from "@/data/skills.json"
import type { Job } from "@/types"

function extractSkillsFromText(text: string): string[] {
  const lower = text.toLowerCase()
  const found: string[] = []
  for (const domain of skillsData.domains) {
    for (const skill of domain.skills) {
      const matched = skill.aliases.some((alias) =>
        new RegExp(`\\b${alias.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i").test(lower)
      )
      if (matched && !found.includes(skill.name)) found.push(skill.name)
    }
  }
  return found
}

export async function fetchJobs(role: string, location: string): Promise<Job[]> {
  try {
    const { data } = await axios.get("https://api.adzuna.com/v1/api/jobs/in/search/1", {
      params: {
        app_id: process.env.ADZUNA_APP_ID,
        app_key: process.env.ADZUNA_APP_KEY,
        what: role,
        where: location,
        results_per_page: 10,
      },
    })

    return (data.results ?? []).map((r: Record<string, unknown>) => {
      const description = (r.description as string) ?? ""
      return {
        id: String(r.id ?? ""),
        title: String(r.title ?? ""),
        company: String((r.company as Record<string, unknown>)?.display_name ?? "Unknown"),
        location: String((r.location as Record<string, unknown>)?.display_name ?? location),
        description,
        applyUrl: String(r.redirect_url ?? ""),
        postedDate: String(r.created ?? ""),
        extractedSkills: extractSkillsFromText(description),
      }
    })
  } catch {
    return []
  }
}
