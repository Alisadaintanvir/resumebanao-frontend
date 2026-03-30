import Image from "next/image"
import Link from "next/link"
import { ResumeTemplate } from "@/types"
import { Sparkles } from "lucide-react"

interface TemplateCardProps {
  template: ResumeTemplate
}

export function TemplateCard({ template }: TemplateCardProps) {
  return (
    <Link href={`/builder?templateId=${template.id}`} className="block group">
      <div className="relative overflow-hidden rounded-xl glass border border-border/50 hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-primary/5">
        
        {/* Image Container */}
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-muted/20 border-b border-border/50">
          {template.preview_image_url ? (
            <Image
              src={template.preview_image_url}
              alt={`${template.name} preview`}
              fill
              className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority={false}
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-muted-foreground/50">
              No Preview Available
            </div>
          )}

          {/* Subtle overlay on hover just for visual effect */}
          <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors duration-300" />
        </div>
        
        {/* Info Section - Always Visible */}
        <div className="p-5 bg-card/40 backdrop-blur-md flex flex-col items-start gap-2 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          
          <h3 className="text-lg font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
            {template.name}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 min-h-[40px]">
            {template.description}
          </p>
          
          <div className="flex items-center gap-2 mt-2 w-full justify-between">
            <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-primary/10 text-primary flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
              <Sparkles className="w-3 h-3" />
              Use Template
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
