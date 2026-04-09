import { NextRequest, NextResponse } from "next/server"
import { extractSkills } from "@/lib/resumeParser"

export const runtime = "nodejs"

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get("resume") as File | null
    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 })

    const buffer = Buffer.from(await file.arrayBuffer())
    const result = await extractSkills(buffer)
    return NextResponse.json(result)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Failed to parse resume" }, { status: 500 })
  }
}
