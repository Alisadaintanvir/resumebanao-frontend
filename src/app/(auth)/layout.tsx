export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] bg-primary/20 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[250px] h-[250px] bg-teal-500/10 blur-[90px] rounded-full pointer-events-none" />
      
      <div className="w-full max-w-lg z-10 glass rounded-3xl p-8 sm:p-12 border border-border shadow-2xl">
        {children}
      </div>
    </div>
  )
}
