import Link from "next/link"
import { LucideFileText, LucideMoreVertical, LucideEdit3, LucideDownload, LucideTrash } from "lucide-react"

export interface ResumeCardProps {
  id: string
  title: string
  updatedAt: string
}

export function ResumeCard({ resume }: { resume: ResumeCardProps }) {
  return (
    <div className="group relative glass rounded-2xl p-0 overflow-hidden transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10 flex flex-col h-64">
      {/* Top Banner indicating Resume Style/Color */}
      <div className="h-2 bg-gradient-to-r from-primary to-primary/60 w-full" />
      
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <div className="w-10 h-10 rounded-lg bg-muted border border-border flex items-center justify-center text-primary">
            <LucideFileText className="w-5 h-5" />
          </div>
          <button className="text-muted-foreground hover:text-foreground transition-colors">
            <LucideMoreVertical className="w-5 h-5" />
          </button>
        </div>

        <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
          {resume.title}
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Last updated • {resume.updatedAt}
        </p>

        <div className="mt-auto flex justify-between gap-2 border-t border-border pt-4">
          <Link href={`/builder?id=${resume.id}`} className="text-xs font-medium text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors">
            <LucideEdit3 className="w-4 h-4" /> Edit
          </Link>
          <button className="text-xs font-medium text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors">
            <LucideDownload className="w-4 h-4" /> Export
          </button>
          <button className="text-xs font-medium text-destructive/80 hover:text-destructive flex items-center gap-1 transition-colors">
            <LucideTrash className="w-4 h-4" /> Delete
          </button>
        </div>
      </div>
    </div>
  )
}
