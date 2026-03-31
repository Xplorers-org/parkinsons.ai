'use client'

import { Mic, PenTool, Video, User } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface AnalysisSidebarProps {
  sections: { id: string; label: string; icon: string }[]
  currentSection: string
  onSelectSection: (section: string) => void
}

const iconMap: { [key: string]: React.ComponentType<any> } = {
  User: User,
  Mic: Mic,
  Pen: PenTool,
  Video: Video,
}

export default function AnalysisSidebar({
  sections,
  currentSection,
  onSelectSection,
}: AnalysisSidebarProps) {
  return (
    <div className="w-48 sticky top-8">
      <div className="bg-secondary/50 rounded-lg p-4 space-y-2">
        <h3 className="text-sm font-semibold text-foreground mb-4">Analysis Sections</h3>
        {sections.map((section) => {
          const Icon = iconMap[section.icon]
          const isActive = currentSection === section.id
          return (
            <Button
              key={section.id}
              variant={isActive ? 'default' : 'ghost'}
              onClick={() => onSelectSection(section.id)}
              className="w-full justify-start gap-2 text-sm"
            >
              {Icon && <Icon className="w-4 h-4" />}
              <span>{section.label}</span>
            </Button>
          )
        })}
      </div>
    </div>
  )
}
