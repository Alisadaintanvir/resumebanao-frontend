"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LucideArrowLeft, LucideDownload, LucideSave, LucideEye } from "lucide-react"
import Link from "next/link"

export default function BuilderPage() {
  const [activeTab, setActiveTab] = useState("personal")
  const [formData, setFormData] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "(555) 123-4567",
    jobTitle: "Senior Software Engineer",
    summary: "Passionate developer with 5+ years of experience building modern web applications."
  })

  // Handle Input Changes
  const h = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }))
  }

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden fixed inset-0 z-[100]">
      {/* Top Navbar specifically for builder */}
      <header className="absolute top-0 inset-x-0 h-14 border-b border-border bg-background/80 backdrop-blur-md z-20 flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
            <LucideArrowLeft className="w-5 h-5" />
          </Link>
          <span className="font-medium text-sm text-foreground">Untitled Resume</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="hidden md:flex gap-1 h-8">
            <LucideEye className="w-4 h-4" /> Preview View
          </Button>
          <Button variant="outline" size="sm" className="gap-1 h-8 border-primary/20 text-primary hover:bg-primary/10">
            <LucideSave className="w-4 h-4" /> Save
          </Button>
          <Button size="sm" className="gap-1 h-8 ml-2">
            <LucideDownload className="w-4 h-4" /> Export PDF
          </Button>
        </div>
      </header>

      {/* Editor Main Content: Sidebar + Preview */}
      <div className="flex w-full pt-14 h-full">
        {/* LEFT SIDEBAR (Controls & Forms) */}
        <div className="w-full md:w-[400px] flex shrink-0 flex-col border-r border-border bg-card z-10 overflow-y-auto">
          {/* Tabs */}
          <div className="flex p-2 border-b border-border overflow-x-auto gap-2">
            {["personal", "experience", "education", "skills"].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium capitalize whitespace-nowrap transition-colors ${
                  activeTab === tab ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Form Content */}
          <div className="p-6 space-y-6">
            {activeTab === "personal" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <h2 className="text-lg font-semibold text-foreground">Personal Information</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground font-medium">First Name</label>
                    <Input value={formData.firstName} onChange={h("firstName")} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground font-medium">Last Name</label>
                    <Input value={formData.lastName} onChange={h("lastName")} />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground font-medium">Job Title</label>
                  <Input value={formData.jobTitle} onChange={h("jobTitle")} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground font-medium">Email</label>
                    <Input type="email" value={formData.email} onChange={h("email")} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground font-medium">Phone</label>
                    <Input value={formData.phone} onChange={h("phone")} />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground font-medium">Professional Summary</label>
                  <textarea
                    rows={4}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none transition-colors duration-200"
                    value={formData.summary}
                    onChange={h("summary")}
                  />
                </div>
              </motion.div>
            )}

            {activeTab !== "personal" && (
              <div className="text-center py-10 opacity-50">
                <p className="text-sm">Mockup View: Switch to Personal Info to see interactivity.</p>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT PREVIEW SCREEN */}
        <div className="hidden md:flex flex-1 items-center justify-center p-8 bg-muted/50 relative overflow-y-auto">
          {/* Zoom Controls Mockup */}
          <div className="absolute bottom-6 right-6 flex items-center gap-2 bg-card/80 backdrop-blur border border-border rounded-full px-4 py-2 z-20 shadow-xl">
            <button className="text-muted-foreground hover:text-foreground">-</button>
            <span className="text-xs text-muted-foreground w-10 text-center">100%</span>
            <button className="text-muted-foreground hover:text-foreground">+</button>
          </div>

          {/* The A4 Document Preview */}
          <motion.div
            layoutId="resume-preview"
            className="w-[210mm] min-h-[297mm] bg-white text-black shadow-2xl p-10 shrink-0 select-text origin-top"
          >
            {/* Minimal Template based on data */}
            <header className="border-b-2 border-slate-800 pb-4 mb-6 text-center">
              <h1 className="text-4xl font-serif text-slate-900 tracking-tight uppercase">
                {formData.firstName} <span className="font-light">{formData.lastName}</span>
              </h1>
              <p className="text-lg text-slate-600 font-medium mt-1 uppercase tracking-widest">{formData.jobTitle}</p>
              <div className="flex items-center justify-center gap-4 text-sm text-slate-500 mt-3 font-mono">
                <span>{formData.email}</span>
                <span>•</span>
                <span>{formData.phone}</span>
                <span>•</span>
                <span>LinkedIn / GitHub</span>
              </div>
            </header>

            <section className="mb-6">
              <p className="text-slate-700 leading-relaxed text-sm">
                {formData.summary}
              </p>
            </section>

            <div className="grid grid-cols-[1fr_2fr] gap-8">
              <div className="space-y-6">
                 {/* Skills Fake */}
                 <section>
                   <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-3">Skills</h2>
                   <ul className="text-sm text-slate-700 space-y-1">
                     <li>React, Next.js, Vue</li>
                     <li>TypeScript, JavaScript</li>
                     <li>Tailwind CSS, SCSS</li>
                     <li>Python, Django, SQL</li>
                   </ul>
                 </section>
                 {/* Education Fake */}
                 <section>
                   <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-3">Education</h2>
                   <div className="text-sm">
                      <p className="font-semibold text-slate-800">BSc Computer Science</p>
                      <p className="text-slate-500">University of Tech</p>
                      <p className="text-slate-400 text-xs mt-0.5">2018 - 2022</p>
                   </div>
                 </section>
              </div>

              <div className="space-y-6">
                 {/* Experience Fake */}
                 <section>
                   <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-3">Experience</h2>
                   <div className="mb-4 text-sm">
                      <div className="flex justify-between items-baseline">
                         <h3 className="font-semibold text-slate-800 text-base">{formData.jobTitle}</h3>
                         <span className="text-slate-400 text-xs font-mono">2022 - Present</span>
                      </div>
                      <p className="text-slate-600 mb-2">Tech Solutions Inc • New York</p>
                      <ul className="list-disc list-inside text-slate-700 space-y-1 pl-1 leading-relaxed text-sm">
                        <li>Developed responsive, scalable frontend applications using React and Next.js.</li>
                        <li>Improved application load time by 40% through code splitting and asset optimization.</li>
                        <li>Collaborated closely with designers and backend engineering to deliver high-quality UI.</li>
                      </ul>
                   </div>

                   <div className="text-sm">
                      <div className="flex justify-between items-baseline">
                         <h3 className="font-semibold text-slate-800 text-base">Frontend Developer</h3>
                         <span className="text-slate-400 text-xs font-mono">2020 - 2022</span>
                      </div>
                      <p className="text-slate-600 mb-2">Creative Agency • Remote</p>
                      <ul className="list-disc list-inside text-slate-700 space-y-1 pl-1 leading-relaxed text-sm">
                        <li>Built landing pages and e-commerce platforms using modern web tooling.</li>
                        <li>Implemented complex animation sequences with Framer Motion and GSAP.</li>
                      </ul>
                   </div>
                 </section>
              </div>
            </div>

          </motion.div>
        </div>
      </div>
    </div>
  )
}
