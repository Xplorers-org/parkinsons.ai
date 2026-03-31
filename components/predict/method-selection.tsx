'use client'

import { Mic, PenTool, Video } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

type PredictionMethod = 'voice' | 'drawing' | 'video'

interface MethodSelectionProps {
  onSelectMethod: (method: PredictionMethod) => void
}

const methods = [
  {
    id: 'voice',
    title: 'Voice Analysis',
    description: 'Record or upload a voice sample',
    icon: Mic,
    color: 'bg-blue-100 dark:bg-blue-900',
    iconColor: 'text-blue-600 dark:text-blue-400',
  },
  {
    id: 'drawing',
    title: 'Drawing Analysis',
    description: 'Upload spiral or wave drawing',
    icon: PenTool,
    color: 'bg-purple-100 dark:bg-purple-900',
    iconColor: 'text-purple-600 dark:text-purple-400',
  },
  {
    id: 'video',
    title: 'Walking Video',
    description: 'Upload walking video sample',
    icon: Video,
    color: 'bg-green-100 dark:bg-green-900',
    iconColor: 'text-green-600 dark:text-green-400',
  },
]

export default function MethodSelection({ onSelectMethod }: MethodSelectionProps) {
  return (
    <div>
      <div className="mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
          Select Analysis Method
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground">
          Choose the prediction method for UPDRS analysis
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        {methods.map(method => {
          const IconComponent = method.icon
          return (
            <Card
              key={method.id}
              className="border border-border p-6 cursor-pointer transition-all hover:border-primary hover:shadow-lg"
              onClick={() => onSelectMethod(method.id as PredictionMethod)}
            >
              <Button
                variant="ghost"
                className="w-full flex flex-col items-center gap-4 h-auto p-0 hover:bg-transparent"
                onClick={() => onSelectMethod(method.id as PredictionMethod)}
              >
                <div className={`${method.color} p-4 rounded-lg`}>
                  <IconComponent className={`w-8 h-8 ${method.iconColor}`} />
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-foreground mb-1">
                    {method.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {method.description}
                  </p>
                </div>
              </Button>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
