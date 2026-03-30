"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  LucideArrowLeft, 
  LucideDownload, 
  LucideSave, 
  LucideEye,
  CheckCircle2,
  Sparkles,
  Plus,
  Trash2
} from "lucide-react"
import Link from "next/link"

const STEPS = [
  { id: "personal", label: "Personal Info" },
  { id: "experience", label: "Experience" },
  { id: "education", label: "Education" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
]

export function BuilderEditor() {
  const [activeTab, setActiveTab] = useState("personal")
  const [formData, setFormData] = useState({
    personal: {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      phone: "(555) 123-4567",
      jobTitle: "Senior Software Engineer",
      summary: "Passionate developer with 5+ years of experience building modern web applications. Specialized in React and Node.js ecosystems."
    },
    experience: [
      { id: "1", title: "Frontend Developer", company: "Tech Solutions Inc", date: "2022 - Present", description: "Developed responsive, scalable frontend applications using React and Next.js.\nImproved application load time by 40%." }
    ],
    education: [
      { id: "1", degree: "BSc Computer Science", school: "University of Tech", date: "2018 - 2022" }
    ],
    skills: "React, Next.js, Vue\nTypeScript, JavaScript\nTailwind CSS, SCSS\nPython, Django, SQL",
    projects: [
      { id: "1", name: "E-Commerce Platform", link: "github.com/johndoe/shop", description: "Built a full-stack e-commerce platform handling 10k+ monthly users." }
    ]
  })

  // Basic validation to indicate completely filled step (mock logic for visual indicator)
  const isStepComplete = (stepId: string) => {
    switch (stepId) {
      case "personal":
        return formData.personal.firstName.length > 0 && formData.personal.email.length > 0
      case "experience":
        return formData.experience.length > 0 && formData.experience[0].title.length > 0
      case "education":
        return formData.education.length > 0 && formData.education[0].school.length > 0
      case "skills":
        return formData.skills.length > 0
      case "projects":
        return true // Projects are optional
      default:
        return false
    }
  }

  // Handle Input Changes for flat objects
  const hPersonal = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ 
      ...prev, 
      personal: { ...prev.personal, [field]: e.target.value } 
    }))
  }

  const handleArrayChange = (key: "experience" | "education" | "projects", id: string, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [key]: prev[key].map(item => item.id === id ? { ...item, [field]: value } : item)
    }))
  }

  const addArrayItem = (key: "experience" | "education" | "projects", defaultItem: Record<string, string>) => {
    setFormData(prev => ({
      ...prev,
      [key]: [...prev[key], { ...defaultItem, id: Date.now().toString() }]
    }))
  }

  const removeArrayItem = (key: "experience" | "education" | "projects", id: string) => {
    setFormData(prev => ({
      ...prev,
      [key]: prev[key].filter(item => item.id !== id)
    }))
  }

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden fixed inset-0 z-[100]">
      {/* Top Navbar */}
      <header className="absolute top-0 inset-x-0 h-16 border-b border-border bg-background/80 backdrop-blur-md z-20 flex items-center justify-between px-6">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="p-1.5 rounded-lg bg-primary/10 text-primary group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg hidden sm:block">ResumeBanao</span>
          </Link>
          <div className="h-6 w-px bg-border hidden sm:block"></div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 text-sm font-medium">
              <LucideArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </Link>
            <span className="text-muted-foreground/30">•</span>
            <span className="font-medium text-sm text-foreground">Untitled Resume</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="hidden lg:flex gap-1.5 h-9">
            <LucideEye className="w-4 h-4" /> Preview
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5 h-9 border-primary/20 text-primary hover:bg-primary/10">
            <LucideSave className="w-4 h-4" /> Save
          </Button>
          <Button size="sm" className="gap-1.5 h-9 ml-2 shadow-[0_0_15px_rgba(var(--primary),0.3)]">
            <LucideDownload className="w-4 h-4" /> Export
          </Button>
        </div>
      </header>

      {/* Editor Main Content */}
      <div className="flex w-full pt-16 h-full">
        {/* TIMELINE SIDEBAR (Steps) */}
        <div className="hidden md:flex flex-col w-[200px] border-r border-border bg-card/50 p-6 z-10 shrink-0">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-6">Progress</h3>
          <div className="relative flex flex-col gap-6">
            <div className="absolute left-[11px] top-4 bottom-4 w-0.5 bg-border -z-10"></div>
            {STEPS.map((step) => {
              const isActive = activeTab === step.id
              const isComplete = isStepComplete(step.id)
              
              return (
                <button
                  key={step.id}
                  onClick={() => setActiveTab(step.id)}
                  className={`flex items-center gap-3 text-left transition-colors ${isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center bg-background border-2 ${isActive ? "border-primary shadow-[0_0_10px_rgba(var(--primary),0.3)]" : isComplete ? "border-primary" : "border-muted-foreground/30"}`}>
                    {isComplete && !isActive ? <CheckCircle2 className="w-4 h-4 text-primary" /> : <div className={`w-2 h-2 rounded-full ${isActive ? "bg-primary" : "bg-transparent"}`} />}
                  </div>
                  <span className={`text-sm tracking-wide ${isActive ? "font-semibold" : "font-medium"}`}>{step.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* FORMS SIDEBAR */}
        <div className="w-full md:w-[450px] flex shrink-0 flex-col border-r border-border bg-card z-10 overflow-y-auto relative">
          {/* Mobile Steps selector (since Left purely-timeline sidebar is hidden on mobile) */}
          <div className="md:hidden flex p-4 border-b border-border overflow-x-auto gap-2">
            {STEPS.map(step => (
              <button
                key={step.id}
                onClick={() => setActiveTab(step.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize whitespace-nowrap transition-colors border ${
                  activeTab === step.id ? "bg-primary/10 text-primary border-primary/30" : "bg-transparent text-muted-foreground border-border hover:border-foreground/20"
                }`}
              >
                {step.label}
              </button>
            ))}
          </div>

          <div className="p-6 pb-24 space-y-8 min-h-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                
                {/* PERSONAL INFO */}
                {activeTab === "personal" && (
                  <div className="space-y-5">
                    <h2 className="text-xl font-bold text-foreground">Personal Details</h2>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs text-muted-foreground font-medium">First Name</label>
                        <Input value={formData.personal.firstName} onChange={hPersonal("firstName")} className="bg-background" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs text-muted-foreground font-medium">Last Name</label>
                        <Input value={formData.personal.lastName} onChange={hPersonal("lastName")} className="bg-background" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs text-muted-foreground font-medium">Job Title</label>
                      <Input value={formData.personal.jobTitle} onChange={hPersonal("jobTitle")} className="bg-background" placeholder="e.g. Full Stack Developer" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs text-muted-foreground font-medium">Email Address</label>
                        <Input type="email" value={formData.personal.email} onChange={hPersonal("email")} className="bg-background" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs text-muted-foreground font-medium">Phone</label>
                        <Input value={formData.personal.phone} onChange={hPersonal("phone")} className="bg-background" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs text-muted-foreground font-medium">Professional Summary</label>
                      <textarea
                        rows={5}
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none transition-colors"
                        value={formData.personal.summary}
                        onChange={hPersonal("summary")}
                        placeholder="Brief overview of your career and top skills..."
                      />
                    </div>
                  </div>
                )}

                {/* EXPERIENCE */}
                {activeTab === "experience" && (
                  <div className="space-y-5">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-bold text-foreground">Experience</h2>
                      <Button size="sm" variant="outline" className="h-8 gap-1" onClick={() => addArrayItem("experience", { title: "", company: "", date: "", description: "" })}>
                        <Plus className="w-3.5 h-3.5" /> Add
                      </Button>
                    </div>
                    
                    <div className="space-y-6">
                      {formData.experience.map((exp) => (
                        <div key={exp.id} className="p-4 border border-border rounded-xl bg-background/50 space-y-4 relative group">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="absolute top-2 right-2 w-7 h-7 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeArrayItem("experience", exp.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                          <div className="space-y-1.5">
                            <label className="text-xs text-muted-foreground font-medium">Job Title</label>
                            <Input value={exp.title} onChange={e => handleArrayChange("experience", exp.id, "title", e.target.value)} />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <label className="text-xs text-muted-foreground font-medium">Company</label>
                              <Input value={exp.company} onChange={e => handleArrayChange("experience", exp.id, "company", e.target.value)} />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-xs text-muted-foreground font-medium">Date / Duration</label>
                              <Input value={exp.date} onChange={e => handleArrayChange("experience", exp.id, "date", e.target.value)} placeholder="e.g. 2020 - Present" />
                            </div>
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs text-muted-foreground font-medium">Description</label>
                            <textarea
                              rows={4}
                              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:ring-1 focus-visible:ring-ring resize-none"
                              value={exp.description}
                              onChange={e => handleArrayChange("experience", exp.id, "description", e.target.value)}
                              placeholder="Describe your achievements..."
                            />
                          </div>
                        </div>
                      ))}
                      {formData.experience.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground text-sm border border-dashed border-border rounded-xl">
                          No experience added yet.
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* EDUCATION */}
                {activeTab === "education" && (
                  <div className="space-y-5">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-bold text-foreground">Education</h2>
                      <Button size="sm" variant="outline" className="h-8 gap-1" onClick={() => addArrayItem("education", { degree: "", school: "", date: "" })}>
                        <Plus className="w-3.5 h-3.5" /> Add
                      </Button>
                    </div>
                    
                    <div className="space-y-6">
                      {formData.education.map((edu) => (
                        <div key={edu.id} className="p-4 border border-border rounded-xl bg-background/50 space-y-4 relative group">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="absolute top-2 right-2 w-7 h-7 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeArrayItem("education", edu.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                          <div className="space-y-1.5">
                            <label className="text-xs text-muted-foreground font-medium">Degree & Major</label>
                            <Input value={edu.degree} onChange={e => handleArrayChange("education", edu.id, "degree", e.target.value)} placeholder="e.g. BS Computer Science" />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <label className="text-xs text-muted-foreground font-medium">School / University</label>
                              <Input value={edu.school} onChange={e => handleArrayChange("education", edu.id, "school", e.target.value)} />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-xs text-muted-foreground font-medium">Date</label>
                              <Input value={edu.date} onChange={e => handleArrayChange("education", edu.id, "date", e.target.value)} placeholder="e.g. 2018 - 2022" />
                            </div>
                          </div>
                        </div>
                      ))}
                      {formData.education.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground text-sm border border-dashed border-border rounded-xl">
                          No education added yet.
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* SKILLS */}
                {activeTab === "skills" && (
                  <div className="space-y-5">
                    <h2 className="text-xl font-bold text-foreground">Skills</h2>
                    <div className="space-y-1.5">
                      <label className="text-xs text-muted-foreground font-medium">List your core skills</label>
                      <textarea
                        rows={8}
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:ring-1 focus-visible:ring-ring resize-none"
                        value={formData.skills}
                        onChange={(e) => setFormData(prev => ({ ...prev, skills: e.target.value }))}
                        placeholder="React, Next.js, Node.js&#10;TypeScript, JavaScript&#10;..."
                      />
                      <p className="text-xs text-muted-foreground mt-2">Format: separate skills with commas, or use line breaks for categories/groups.</p>
                    </div>
                  </div>
                )}

                {/* PROJECTS */}
                {activeTab === "projects" && (
                  <div className="space-y-5">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-bold text-foreground">Projects</h2>
                      <Button size="sm" variant="outline" className="h-8 gap-1" onClick={() => addArrayItem("projects", { name: "", link: "", description: "" })}>
                        <Plus className="w-3.5 h-3.5" /> Add
                      </Button>
                    </div>
                    
                    <div className="space-y-6">
                      {formData.projects.map((proj) => (
                        <div key={proj.id} className="p-4 border border-border rounded-xl bg-background/50 space-y-4 relative group">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="absolute top-2 right-2 w-7 h-7 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeArrayItem("projects", proj.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <label className="text-xs text-muted-foreground font-medium">Project Name</label>
                              <Input value={proj.name} onChange={e => handleArrayChange("projects", proj.id, "name", e.target.value)} />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-xs text-muted-foreground font-medium">Link</label>
                              <Input value={proj.link} onChange={e => handleArrayChange("projects", proj.id, "link", e.target.value)} placeholder="e.g. github.com/..." />
                            </div>
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs text-muted-foreground font-medium">Description</label>
                            <textarea
                              rows={3}
                              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:ring-1 focus-visible:ring-ring resize-none"
                              value={proj.description}
                              onChange={e => handleArrayChange("projects", proj.id, "description", e.target.value)}
                              placeholder="Brief description of the project..."
                            />
                          </div>
                        </div>
                      ))}
                      {formData.projects.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground text-sm border border-dashed border-border rounded-xl">
                          No projects added yet.
                        </div>
                      )}
                    </div>
                  </div>
                )}

              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* RIGHT PREVIEW SCREEN */}
        <div className="hidden lg:flex flex-1 items-center justify-center p-8 bg-muted/30 relative overflow-y-auto w-full">
          {/* Zoom Controls Mockup */}
          <div className="absolute bottom-6 right-6 flex items-center gap-2 bg-card/80 backdrop-blur border border-border rounded-full px-4 py-2 z-20 shadow-xl">
            <button className="text-muted-foreground hover:text-foreground hover:bg-muted w-7 h-7 rounded-full flex items-center justify-center transition-colors">-</button>
            <span className="text-xs text-muted-foreground font-medium w-10 text-center">100%</span>
            <button className="text-muted-foreground hover:text-foreground hover:bg-muted w-7 h-7 rounded-full flex items-center justify-center transition-colors">+</button>
          </div>

          {/* The A4 Document Preview */}
          <motion.div
            layoutId="resume-preview"
            className="w-[210mm] min-h-[297mm] bg-white text-black shadow-2xl p-10 shrink-0 select-text origin-top mx-auto my-auto ring-1 ring-border/5"
          >
            {/* Template Render based on dynamic data */}
            <header className="border-b-2 border-slate-800 pb-4 mb-6 text-center">
              <h1 className="text-4xl font-serif text-slate-900 tracking-tight uppercase">
                {formData.personal.firstName || "FIRST"} <span className="font-light">{formData.personal.lastName || "LAST"}</span>
              </h1>
              <p className="text-lg text-slate-600 font-medium mt-1 uppercase tracking-widest">{formData.personal.jobTitle || "JOB TITLE"}</p>
              <div className="flex items-center justify-center gap-4 text-sm text-slate-500 mt-3 font-mono flex-wrap">
                {formData.personal.email && <span>{formData.personal.email}</span>}
                {formData.personal.email && formData.personal.phone && <span>•</span>}
                {formData.personal.phone && <span>{formData.personal.phone}</span>}
                {(formData.personal.email || formData.personal.phone) && <span>•</span>}
                <span>LinkedIn / GitHub</span>
              </div>
            </header>

            {formData.personal.summary && (
              <section className="mb-6">
                <p className="text-slate-700 leading-relaxed text-sm whitespace-pre-wrap">
                  {formData.personal.summary}
                </p>
              </section>
            )}

            <div className="grid grid-cols-[1fr_2fr] gap-8">
              <div className="space-y-6">
                 {/* Skills */}
                 {formData.skills && (
                   <section>
                     <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-3">Skills</h2>
                     <ul className="text-sm text-slate-700 space-y-1 list-none p-0 whitespace-pre-line leading-relaxed">
                       {formData.skills}
                     </ul>
                   </section>
                 )}
                 
                 {/* Education */}
                 {formData.education.length > 0 && (
                   <section>
                     <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-3">Education</h2>
                     <div className="space-y-4">
                       {formData.education.map(edu => (
                         <div key={edu.id} className="text-sm">
                            <p className="font-semibold text-slate-800">{edu.degree || "Degree Name"}</p>
                            <p className="text-slate-500">{edu.school || "School Name"}</p>
                            <p className="text-slate-400 text-xs mt-0.5">{edu.date || "Date"}</p>
                         </div>
                       ))}
                     </div>
                   </section>
                 )}
              </div>

              <div className="space-y-8">
                 {/* Experience */}
                 {formData.experience.length > 0 && (
                   <section>
                     <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-3">Experience</h2>
                     <div className="space-y-5">
                       {formData.experience.map(exp => (
                         <div key={exp.id} className="text-sm">
                            <div className="flex justify-between items-baseline mb-0.5">
                               <h3 className="font-semibold text-slate-800 text-base">{exp.title || "Job Title"}</h3>
                               <span className="text-slate-400 text-xs font-mono shrink-0 ml-2">{exp.date || "Date"}</span>
                            </div>
                            <p className="text-slate-600 mb-2 font-medium">{exp.company || "Company Name"}</p>
                            {exp.description && (
                              <ul className="list-disc list-inside text-slate-700 space-y-1 pl-1 leading-relaxed text-sm marker:text-slate-400">
                                {exp.description.split('\n').map((line, i) => (
                                  line.trim() ? <li key={i}>{line.trim()}</li> : null
                                ))}
                              </ul>
                            )}
                         </div>
                       ))}
                     </div>
                   </section>
                 )}

                 {/* Projects */}
                 {formData.projects.length > 0 && (
                   <section>
                     <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-3">Projects</h2>
                     <div className="space-y-4">
                       {formData.projects.map(proj => (
                         <div key={proj.id} className="text-sm">
                            <div className="flex items-center gap-2 mb-0.5">
                               <h3 className="font-semibold text-slate-800">{proj.name || "Project Name"}</h3>
                               {proj.link && <span className="text-slate-400 text-xs">— {proj.link}</span>}
                            </div>
                            {proj.description && <p className="text-slate-600 leading-relaxed text-sm">{proj.description}</p>}
                         </div>
                       ))}
                     </div>
                   </section>
                 )}
              </div>
            </div>

          </motion.div>
        </div>
      </div>
    </div>
  )
}
