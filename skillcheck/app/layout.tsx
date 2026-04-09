import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Navbar } from "@/components/Navbar"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

export const metadata: Metadata = {
  title: "SkillCheck — Know where you stand",
  description: "Parse your resume, extract skills, and match against real job listings.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans bg-[#0F172A] text-slate-100 min-h-screen">
        <Navbar />
        {children}
      </body>
    </html>
  )
}
