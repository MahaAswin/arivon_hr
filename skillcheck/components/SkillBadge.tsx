type Variant = "green" | "amber" | "red" | "blue" | "orange" | "default"

const variantClasses: Record<Variant, string> = {
  green: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  amber: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  red: "bg-red-500/15 text-red-400 border-red-500/30",
  blue: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  orange: "bg-[#F97316]/15 text-[#F97316] border-[#F97316]/30",
  default: "bg-white/5 text-slate-400 border-white/10",
}

export function SkillBadge({ label, variant = "default" }: { label: string; variant?: Variant }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${variantClasses[variant]}`}>
      {label}
    </span>
  )
}
