export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex-1 flex flex-col bg-muted/30">
      <main className="flex-1 container mx-auto px-6 py-12">
        {children}
      </main>
    </div>
  )
}
