"use client"
import { useCallback, useState } from "react"

interface Props {
  onFile: (file: File) => void
  loading?: boolean
}

export function ResumeUpload({ onFile, loading }: Props) {
  const [dragging, setDragging] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)

  const handleFile = useCallback((file: File) => {
    if (file.type !== "application/pdf") return alert("Please upload a PDF file.")
    setFileName(file.name)
    onFile(file)
  }, [onFile])

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }, [handleFile])

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
      className={`relative border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-300 cursor-pointer ${
        dragging
          ? "border-[#F97316] bg-[#F97316]/10 shadow-[0_0_30px_rgba(249,115,22,0.2)]"
          : "border-white/10 bg-white/5 hover:border-[#F97316]/50 hover:bg-[#F97316]/5"
      }`}
      onClick={() => !loading && document.getElementById("resume-input")?.click()}
    >
      <div className="text-5xl mb-3">📄</div>
      <p className="text-slate-200 mb-1 font-semibold">
        {fileName ? fileName : "Drag & drop your resume PDF here"}
      </p>
      <p className="text-sm text-slate-500 mb-5">or click to browse</p>
      <button
        disabled={loading}
        className="glow-button text-sm"
        onClick={(e) => { e.stopPropagation(); document.getElementById("resume-input")?.click() }}
      >
        {loading ? "Parsing…" : "Choose File"}
      </button>
      <input
        id="resume-input"
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
      />
    </div>
  )
}
