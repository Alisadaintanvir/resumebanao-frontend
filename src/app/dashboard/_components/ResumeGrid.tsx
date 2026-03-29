"use client"

import { motion } from "framer-motion"
import { ResumeCard, ResumeCardProps } from "./ResumeCard"
import Link from "next/link"
import { LucidePlus } from "lucide-react"

export function ResumeGrid({ resumes }: { resumes: ResumeCardProps[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {/* Create New Card */}
      <Link href="/builder" className="group">
        <div className="h-64 rounded-2xl border-2 border-dashed border-border bg-card/50 flex flex-col items-center justify-center p-6 transition-all hover:bg-primary/5 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 group-hover:-translate-y-1">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4 transition-transform group-hover:scale-110">
            <LucidePlus className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
            Start from Scratch
          </h3>
          <p className="text-center text-sm text-muted-foreground mt-2 max-w-[200px]">
            Create an empty resume layout
          </p>
        </div>
      </Link>

      {/* Existing Resumes */}
      {resumes.map((resume) => (
        <ResumeCard key={resume.id} resume={resume} />
      ))}
    </motion.div>
  )
}
