import { ResumeGrid } from "./_components/ResumeGrid"

// Mock Resumes — will be replaced with server-side data fetching later
const MOCK_RESUMES = [
  { id: "1", title: "Software Engineer - Google", updatedAt: "2 hours ago" },
  { id: "2", title: "Frontend Lead - Startup", updatedAt: "1 day ago" },
]

export default function DashboardPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Your Resumes
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage and edit your existing CVs
          </p>
        </div>
      </div>

      {/* Client Component — handles animation */}
      <ResumeGrid resumes={MOCK_RESUMES} />
    </div>
  )
}
