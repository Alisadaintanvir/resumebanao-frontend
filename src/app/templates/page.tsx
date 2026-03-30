import { Suspense } from "react"
import { getTemplatesAction } from "@/actions/template.action"
import { TemplateGrid } from "./_components/TemplateGrid"
import { Sparkles, Loader2 } from "lucide-react"

// Force dynamic or let Next cache based on the fetch options.
// Since templates might update, we can revalidate.
export const revalidate = 3600 // 1 hour

export default async function TemplatesPage() {
  const response = await getTemplatesAction()
  
  // Exclude inactive ones if needed, but normally backend does it.
  const templates = response.success && response.data ? response.data.filter(t => t.is_active) : []

  return (
    <div className="flex flex-col flex-1 min-h-screen bg-background relative overflow-hidden">
      {/* Background glow effects for premium look */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-primary/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-chart-1/5 blur-[120px] rounded-full pointer-events-none" />
      
      <main className="container mx-auto px-6 py-24 md:py-32 relative z-10 flex-1 flex flex-col">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center justify-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-wider uppercase mb-6 border border-primary/20">
            <Sparkles className="w-3.5 h-3.5" />
            Resume Templates
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground mb-6">
            Find Your
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-chart-1 ml-3">
              Perfect Fit
            </span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            Choose from our curated collection of professional, ATS-friendly templates designed to get you hired faster.
          </p>
        </div>

        <div className="flex-1 w-full max-w-7xl mx-auto">
           {response.success ? (
              <Suspense 
                fallback={
                  <div className="flex items-center justify-center h-64 text-muted-foreground">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    <span className="ml-3 font-medium">Loading templates...</span>
                  </div>
                }
              >
                <TemplateGrid templates={templates} />
              </Suspense>
           ) : (
              <div className="flex flex-col items-center justify-center p-12 text-center glass rounded-xl border-destructive/20 mt-10">
                 <p className="text-destructive font-semibold mb-2">Failed to load templates</p>
                 <p className="text-sm text-muted-foreground">{response.error || "An unexpected error occurred."}</p>
              </div>
           )}
        </div>
      </main>
    </div>
  )
}
