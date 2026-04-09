import { NextRequest, NextResponse } from "next/server"
import { fetchJobs } from "@/lib/adzuna"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const role = searchParams.get("role") ?? ""
  const location = searchParams.get("location") ?? ""
  if (!role) return NextResponse.json({ error: "role is required" }, { status: 400 })
  const jobs = await fetchJobs(role, location)
  return NextResponse.json(jobs)
}
