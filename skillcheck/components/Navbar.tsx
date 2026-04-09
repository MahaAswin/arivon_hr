"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function Navbar() {
  const pathname = usePathname()

  const links = [
    { href: "/resume", label: "Resume Check" },
    { href: "/jobs", label: "Browse Jobs" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#0F172A]/80 backdrop-blur-xl">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/resume" className="font-black text-lg tracking-tighter uppercase">
          Skill<span className="text-[#F97316]">Check</span>
        </Link>
        <nav className="flex items-center gap-1">
          {links.map(({ href, label }) => {
            const active = pathname === href || pathname.startsWith(href + "/")
            return (
              <Link
                key={href}
                href={href}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  active
                    ? "bg-[#F97316]/20 text-[#F97316] shadow-[0_0_12px_rgba(249,115,22,0.2)]"
                    : "text-slate-400 hover:text-slate-100 hover:bg-white/5"
                }`}
              >
                {label}
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
