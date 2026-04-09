# SkillCheck

A Next.js 14 App Router application that parses resumes, extracts skills, and matches them against real job listings from the Adzuna API.

## Features

- **Resume Parsing** — Upload a PDF resume and automatically extract skills grouped by domain
- **Skill Matching** — Enter job keywords and get a match score with matched, partial, and missing skills
- **Job Browser** — Search real job listings and see instant match scores based on your resume
- **No database required** — Skills are stored in `/data/skills.json`, student skills persist in `localStorage`

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS + shadcn/ui
- pdf-parse (PDF text extraction)
- axios (Adzuna API)

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env.local
```

Open `.env.local` and add your Adzuna API credentials:

```
ADZUNA_APP_ID=your_app_id_here
ADZUNA_APP_KEY=your_app_key_here
```

Get a free Adzuna API key at: https://developer.adzuna.com

### 3. Run the development server

```bash
npm run dev
```

### 4. Open the app

Visit [http://localhost:3000](http://localhost:3000)

## Project Structure

```
/app
  /page.tsx                    → Home
  /resume/page.tsx             → Resume upload + skill match
  /jobs/page.tsx               → Job listings with match scores
  /jobs/[id]/page.tsx          → Job detail page
  /api/resume/parse/route.ts   → POST: parse PDF, return extracted skills
  /api/resume/score/route.ts   → POST: score student skills vs job keywords
  /api/jobs/route.ts           → GET: fetch jobs from Adzuna
  /api/jobs/check/route.ts     → POST: fetch jobs + score each against student skills
/components
  /SkillBadge.tsx              → Colored skill badge (green/amber/red/blue)
  /ScoreCard.tsx               → Match score display with breakdown
  /JobCard.tsx                 → Job listing card with match badge
  /ResumeUpload.tsx            → Drag-and-drop PDF upload
/lib
  /resumeParser.ts             → PDF parsing + skill extraction
  /skillScorer.ts              → Skill matching + scoring logic
  /adzuna.ts                   → Adzuna API client
/data
  /skills.json                 → Skill definitions with aliases by domain
/types
  /index.ts                    → TypeScript interfaces
```

## How Scoring Works

- **Exact match** → 1.0 credit (skill found directly)
- **Partial match** → 0.4 credit (different skill in same domain)
- **No match** → 0 credit
- **Score** = (total credits / total job keywords) × 100
- **Strong** ≥ 70% | **Partial** ≥ 40% | **Weak** < 40%

## Integration Notes

This app is designed as a standalone module for later integration into a larger platform:
- All skill data is in `/data/skills.json` — easy to extend
- No database, no auth, no Redis dependencies
- Student skills are stored in `localStorage` under the key `studentSkills`
- All API routes return clean JSON and handle errors gracefully
