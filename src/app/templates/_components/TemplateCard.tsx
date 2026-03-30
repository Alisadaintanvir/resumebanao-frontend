import Image from "next/image"
import Link from "next/link"
import { ResumeTemplate } from "@/types"
import { Button } from "@/components/ui/button"
import { Eye, Plus } from "lucide-react"

interface TemplateCardProps {
  template: ResumeTemplate
}

export function TemplateCard({ template }: TemplateCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-xl glass border-border/50 hover:border-primary/50 transition-all duration-300">
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-muted/20">
        {template.preview_image_url ? (
          <Image
            src={template.preview_image_url}
            alt={`${template.name} preview`}
            fill
            className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={false}
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-muted-foreground/50">
            No Preview Available
          </div>
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-4 p-6">
          <h3 className="text-xl font-bold text-foreground text-center line-clamp-2">
            {template.name}
          </h3>
          <p className="text-sm text-muted-foreground text-center line-clamp-3">
            {template.description}
          </p>
          <div className="flex gap-3 mt-4 w-full justify-center">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full bg-background/50 backdrop-blur-md border-primary/20 hover:bg-primary/10 hover:text-primary transition-all"
              title="Preview Template"
            >
              <Eye className="w-5 h-5" />
            </Button>
            
            <Link href={`/builder/new?templateId=${template.id}`} passHref>
              <Button
                className="rounded-full font-semibold px-6 shadow-[0_0_20px_rgba(var(--primary),0.3)] hover:shadow-[0_0_25px_rgba(var(--primary),0.5)] transition-all"
              >
                <Plus className="w-4 h-4 mr-2" />
                Use Template
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Mobile/Compact Info (visible without hover on touch devices usually, or below) */}
      <div className="p-4 bg-card/50 flex items-center justify-between border-t border-border/50 lg:hidden">
         <div>
            <h3 className="font-semibold text-foreground line-clamp-1">{template.name}</h3>
         </div>
         <Link href={`/builder/new?templateId=${template.id}`}>
          <Button size="sm" variant="ghost" className="text-primary hover:bg-primary/10">
            Use
          </Button>
         </Link>
      </div>
    </div>
  )
}
