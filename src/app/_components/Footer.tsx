import Link from "next/link"
import { FileText } from "lucide-react"

export default function Footer() {
  return (
    <footer className="border-t border-white/5 py-12 mt-auto">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-500" />
            <span className="text-white font-bold tracking-wider">Neo<span className="text-emerald-500">Resume</span></span>
          </div>
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} NeoResume. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="#" className="text-gray-400 hover:text-white transition-colors">Privacy</Link>
            <Link href="#" className="text-gray-400 hover:text-white transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
