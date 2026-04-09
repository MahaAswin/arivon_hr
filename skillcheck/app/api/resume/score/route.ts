import { NextRequest, NextResponse } from "next/server"
import { scoreResume } from "@/lib/skillScorer"

export async function POST(req: NextRequest) {
  try {
    const { studentSkills, jobKeywords } = await req.json()
    if (!Array.isArray(studentSkills) || !Array.isArray(jobKeywords)) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 })
    }
    return NextResponse.json(scoreResume(studentSkills, jobKeywords))
  } catch {
    return NextResponse.json({ error: "Failed to score resume" }, { status: 500 })
  }
}
