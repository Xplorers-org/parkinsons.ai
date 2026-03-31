'use client'

interface PhaseIndicatorProps {
  section: string
  currentPhase: number
  totalPhases: number
}

export default function PhaseIndicator({
  section,
  currentPhase,
  totalPhases,
}: PhaseIndicatorProps) {
  const sectionLabels: { [key: string]: { phases: string[] } } = {
    patient: { phases: ['Patient Details'] },
    voice: { phases: ['Voice Input', 'Voice Preview'] },
    drawing: { phases: ['Drawing Input', 'Drawing Preview'] },
    walking: { phases: ['Video Input', 'Video Preview'] },
  }

  const labels = sectionLabels[section]?.phases || []

  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="flex-1">
        <div className="flex gap-2">
          {labels.map((label, index) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                  index + 1 <= currentPhase
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {index + 1}
              </div>
              <span className="text-xs sm:text-sm text-foreground">{label}</span>
              {index < labels.length - 1 && (
                <div
                  className={`h-1 flex-1 rounded transition-colors ml-2 ${
                    index + 1 < currentPhase ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>
      <span className="text-xs text-muted-foreground whitespace-nowrap">
        {currentPhase}/{totalPhases}
      </span>
    </div>
  )
}
