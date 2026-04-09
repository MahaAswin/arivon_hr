import { NextRequest, NextResponse } from "next/server"
import { fetchJobs } from "@/lib/adzuna"
import { scoreResume } from "@/lib/skillScorer"

export async function POST(req: NextRequest) {
  try {
    const { studentSkills, role, location } = await req.json()
    if (!role) return NextResponse.json({ error: "role is required" }, { status: 400 })

    const jobs = await fetchJobs(role, location ?? "")
    const scored = jobs.map((job) => ({
      ...job,
      scoreResult: scoreResume(studentSkills ?? [], job.extractedSkills ?? []),
    }))

    scored.sort((a, b) => (b.scoreResult?.matchScore ?? 0) - (a.scoreResult?.matchScore ?? 0))
    return NextResponse.json(scored)
  } catch {
    return NextResponse.json({ error: "Failed to check jobs" }, { status: 500 })
  }
}
