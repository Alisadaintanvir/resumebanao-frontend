import { LayoutTemplate, ShieldCheck, Zap } from "lucide-react"
import { HeroSection } from "./_components/HeroSection"

export default function Home() {
  return (
    <div className="flex flex-col flex-1">
      {/* Hero — Client Component (needs framer-motion) */}
      <HeroSection />

      {/* Features — Server rendered */}
      <section
        id="features"
        className="py-24 bg-muted/50 border-t border-border relative z-10"
      >
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-foreground">
              Why Choose Resume Banao?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need to land your next big opportunity.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl glass hover:-translate-y-1 transition-transform">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-6">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">
                Lightning Fast
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Our intuitive builder lets you create a professional resume in
                flat 5 minutes. Real-time preview included.
              </p>
            </div>

            <div className="p-6 rounded-2xl glass hover:-translate-y-1 transition-transform">
              <div className="w-12 h-12 bg-chart-1/10 text-chart-1 rounded-xl flex items-center justify-center mb-6">
                <LayoutTemplate className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">
                ATS-Friendly Templates
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Designed to pass Applicant Tracking Systems. Perfect formatting
                that recruiters love to read.
              </p>
            </div>

            <div className="p-6 rounded-2xl glass hover:-translate-y-1 transition-transform">
              <div className="w-12 h-12 bg-chart-3/10 text-chart-3 rounded-xl flex items-center justify-center mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">
                Private &amp; Secure
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Your data is encrypted and securely stored. We value your
                privacy above everything else.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
