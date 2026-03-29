"use client"

import { motion } from "framer-motion"
import { ResumeCard } from "./_components/ResumeCard"
import Link from "next/link"
import { LucidePlus } from "lucide-react"

// Mock Resumes
const MOCK_RESUMES = [
  { id: "1", title: "Software Engineer - Google", updatedAt: "2 hours ago" },
  { id: "2", title: "Frontend Lead - Startup", updatedAt: "1 day ago" },
]

export default function DashboardPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Your Resumes</h1>
          <p className="text-gray-400 mt-1">Manage and edit your existing CVs</p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {/* Create New Card */}
        <Link href="/builder" className="group">
          <div className="h-64 rounded-2xl border-2 border-dashed border-white/20 bg-white/5 flex flex-col items-center justify-center p-6 transition-all hover:bg-emerald-500/10 hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/10 group-hover:-translate-y-1">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-4 transition-transform group-hover:scale-110">
              <LucidePlus className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-semibold text-white group-hover:text-emerald-400 transition-colors">Start from Scratch</h3>
            <p className="text-center text-sm text-gray-500 mt-2 max-w-[200px]">Create an empty resume layout</p>
          </div>
        </Link>
        
        {/* Existing Resumes */}
        {MOCK_RESUMES.map(resume => (
          <ResumeCard key={resume.id} resume={resume} />
        ))}
      </motion.div>
    </div>
  )
}
