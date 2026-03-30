"use client"

import { memo } from "react"
import { motion, AnimatePresence, Variants } from "framer-motion"
import { ResumeTemplate } from "@/types"
import { TemplateCard } from "./TemplateCard"
import { FileWarning } from "lucide-react"

interface TemplateGridProps {
  templates: ResumeTemplate[]
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
}

export const TemplateGrid = memo(function TemplateGrid({
  templates,
}: TemplateGridProps) {
  if (!templates || templates.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 mt-10 text-center glass rounded-2xl border-border/50">
        <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mb-4 text-muted-foreground">
          <FileWarning className="w-8 h-8 opacity-50" />
        </div>
        <h3 className="text-xl font-semibold mb-2">No Templates Found</h3>
        <p className="text-sm text-muted-foreground max-w-[280px]">
          We couldn&apos;t find any active resume templates at the moment. Please check back later.
        </p>
      </div>
    )
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 py-10"
    >
      <AnimatePresence>
        {templates.map((template) => (
          <motion.div
            key={template.id}
            variants={itemVariants}
            layoutId={`template-${template.id}`}
            whileHover={{ y: -8 }}
            className="will-change-transform"
          >
            <TemplateCard template={template} />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  )
})
