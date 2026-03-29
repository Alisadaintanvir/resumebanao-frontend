"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, LayoutTemplate, ShieldCheck, Zap } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <div className="flex flex-col flex-1">
      {/* Hero Section */}
      <section className="relative flex-1 flex flex-col items-center justify-center py-32 px-6 overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/20 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-sm font-medium mb-8"
          >
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered Resume Builder is Live</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tight mb-8"
          >
            Create Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">Dream Resume</span>
            <br /> in Minutes.
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10"
          >
            Stand out from the crowd with beautifully designed, ATS-friendly resumes
            optimized by AI. Completely free to use.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/register">
              <Button variant="gradient" size="lg" className="w-full sm:w-auto h-12 px-8 text-base">
                Build My Resume Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <p className="text-sm text-gray-500 hidden sm:block">No credit card required</p>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-black/50 border-t border-white/5 relative z-10">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Choose NeoResume?</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Everything you need to land your next big opportunity.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl glass hover:-translate-y-1 transition-transform">
              <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center mb-6">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Lightning Fast</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Our intuitive builder lets you create a professional resume in flat 5 minutes. Real-time preview included.
              </p>
            </div>
            
            <div className="p-6 rounded-2xl glass hover:-translate-y-1 transition-transform">
              <div className="w-12 h-12 bg-blue-500/10 text-blue-400 rounded-xl flex items-center justify-center mb-6">
                <LayoutTemplate className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">ATS-Friendly Templates</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Designed to pass Applicant Tracking Systems. Perfect formatting that recruiters love to read.
              </p>
            </div>
            
            <div className="p-6 rounded-2xl glass hover:-translate-y-1 transition-transform">
              <div className="w-12 h-12 bg-purple-500/10 text-purple-400 rounded-xl flex items-center justify-center mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Private & Secure</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Your data is encrypted and securely stored. We value your privacy above everything else.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
