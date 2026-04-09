"use client"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { ScoreCard } from "@/components/ScoreCard"
import { SkillBadge } from "@/components/SkillBadge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import type { Job, ScoreResult } from "@/types"
import Link from "next/link"

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [job, setJob] = useState<Job | null>(null)
  const [score, setScore] = useState<ScoreResult | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem("lastJobSearch")
    if (stored) {
      const jobs: Job[] = JSON.parse(stored)
      const found = jobs.find((j) => j.id === id)
      if (found) {
        setJob(found)
        if (found.scoreResult) setScore(found.scoreResult)
      }
    }
    setLoading(false)
  }, [id])

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 py-10 px-4">
        <div className="max-w-2xl mx-auto space-y-4">
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-32 w-full" />
        </div>
      </main>
    )
  }

  if (!job) {
    return (
      <main className="min-h-screen bg-gray-50 py-10 px-4 flex items-center justify-center">
        <div className="text-center space-y-3">
          <p className="text-gray-500">Job not found. Please go back and search again.</p>
          <Link href="/jobs">
            <Button variant="outline">← Back to Jobs</Button>
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto space-y-5">
        <Link href="/jobs" className="text-sm text-blue-600 hover:underline">
          ← Back to Jobs
        </Link>

        <div>
          <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
          <p className="text-gray-500">{job.company} · {job.location}</p>
          {job.postedDate && (
            <p className="text-xs text-gray-400">{new Date(job.postedDate).toLocaleDateString()}</p>
          )}
        </div>

        {job.extractedSkills && job.extractedSkills.length > 0 && (
          <Card>
            <CardContent className="pt-4 pb-4">
              <p className="text-sm font-medium text-gray-600 mb-2">Skills Required</p>
              <div className="flex flex-wrap gap-1.5">
                {job.extractedSkills.map((s) => (
                  <SkillBadge key={s} label={s} variant="blue" />
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {score && <ScoreCard result={score} />}

        <Card>
          <CardContent className="pt-4 pb-4">
            <p className="text-sm font-medium text-gray-600 mb-2">Job Description</p>
            <p className="text-sm text-gray-700 whitespace-pre-line">{job.description}</p>
          </CardContent>
        </Card>

        <a href={job.applyUrl} target="_blank" rel="noopener noreferrer" className="block">
          <Button size="lg" className="w-full">Apply Now →</Button>
        </a>
      </div>
    </main>
  )
}
