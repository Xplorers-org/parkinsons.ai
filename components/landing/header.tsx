import React from 'react'
import { ThemeToggle } from "@/components/theme-toggle"
import { Activity } from "lucide-react"


function Header() {
  return (
      <>
      <header className="flex items-center justify-between px-6 py-4 border-b">
        <div className="flex items-center gap-2">
          <Activity className="h-6 w-6 text-primary" />
          <span className="font-semibold text-lg">PARKINSON&apos;S.AI</span>
        </div>
        <ThemeToggle />
      </header>
      </>
  )
}

export default Header