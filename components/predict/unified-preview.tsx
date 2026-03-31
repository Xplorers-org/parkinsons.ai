'use client'

import { Mic, PenTool, Video } from 'lucide-react'
import { Card } from '@/components/ui/card'

type PredictionMethod = 'voice' | 'drawing' | 'video'

interface UnifiedPreviewProps {
  method: PredictionMethod
  formData: any
}

export default function UnifiedPreview({ method, formData }: UnifiedPreviewProps) {
  const getMethodLabel = () => {
    if (method === 'voice') return 'Voice Analysis'
    if (method === 'drawing') return 'Drawing Analysis'
    if (method === 'video') return 'Walking Video Analysis'
  }

  const getMethodIcon = () => {
    if (method === 'voice') return Mic
    if (method === 'drawing') return PenTool
    if (method === 'video') return Video
    return Mic
  }

  const IconComponent = getMethodIcon()

  return (
    <div>
      <div className="mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
          Preview
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground">
          Review your information and {method} sample
        </p>
      </div>

      <div className="space-y-4">
        {/* Patient Info */}
        <Card className="bg-secondary/50 border-0 p-4 sm:p-6">
          <h3 className="font-semibold text-foreground mb-4">Patient Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <p className="text-xs sm:text-sm text-muted-foreground mb-1">Full Name</p>
              <p className="text-sm sm:text-base font-medium text-foreground">
                {formData.fullName || '-'}
              </p>
            </div>
            <div>
              <p className="text-xs sm:text-sm text-muted-foreground mb-1">Age</p>
              <p className="text-sm sm:text-base font-medium text-foreground">
                {formData.age || '-'}
              </p>
            </div>
            <div>
              <p className="text-xs sm:text-sm text-muted-foreground mb-1">Gender</p>
              <p className="text-sm sm:text-base font-medium text-foreground">
                {formData.gender || '-'}
              </p>
            </div>
            <div>
              <p className="text-xs sm:text-sm text-muted-foreground mb-1">Patient ID</p>
              <p className="text-sm sm:text-base font-medium text-foreground">
                {formData.patientId || '-'}
              </p>
            </div>
          </div>
        </Card>

        {/* Analysis Method */}
        <Card className="bg-secondary/50 border-0 p-4 sm:p-6">
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 p-3 rounded-lg">
              <IconComponent className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground mb-1">
                {getMethodLabel()}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {method === 'voice' && formData.voiceFile?.name}
                {method === 'drawing' && formData.drawingFile?.name}
                {method === 'video' && formData.videoFile?.name}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
