'use client'

import { useState } from 'react'
import { Mic, PenTool, Video, CheckCircle } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

type PredictionMethod = 'voice' | 'drawing' | 'video'

interface UnifiedSubmitProps {
  method: PredictionMethod
  formData: any
}

export default function UnifiedSubmit({ method, formData }: UnifiedSubmitProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [result, setResult] = useState<number | null>(null)

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

  const hasRequiredData = () => {
    if (method === 'voice') return !!formData.voiceFile
    if (method === 'drawing') return !!formData.drawingFile
    if (method === 'video') return !!formData.videoFile
    return false
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    setResult(Math.floor(Math.random() * 40) + 10) // Random UPDRS score 10-50
    setIsSubmitted(true)
    setIsSubmitting(false)
  }

  if (isSubmitted && result !== null) {
    return (
      <div className="text-center">
        <div className="mb-6">
          <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4" />
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            Analysis Complete
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            UPDRS score has been calculated successfully
          </p>
        </div>

        <Card className="bg-primary/5 border border-primary/20 p-8 sm:p-12 mb-6">
          <p className="text-muted-foreground mb-2">Predicted Motor UPDRS Score</p>
          <p className="text-5xl sm:text-6xl font-bold text-primary mb-2">
            {result}
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Based on {getMethodLabel()}
          </p>
        </Card>

        <Card className="bg-secondary/50 border-0 p-4 sm:p-6">
          <div className="space-y-2 text-xs sm:text-sm text-foreground text-left">
            <p>
              <strong>Patient:</strong> {formData.fullName}
            </p>
            <p>
              <strong>Method:</strong> {getMethodLabel()}
            </p>
            <p>
              <strong>Timestamp:</strong> {new Date().toLocaleString()}
            </p>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
          Ready to Analyze
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground">
          Confirm submission for UPDRS prediction
        </p>
      </div>

      <div className="space-y-4">
        {/* Summary Card */}
        <Card className="bg-secondary/50 border-0 p-4 sm:p-6">
          <h3 className="font-semibold text-foreground mb-4">Summary</h3>
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-2 border-b border-border gap-2">
              <span className="text-xs sm:text-sm text-muted-foreground">Patient</span>
              <span className="text-sm sm:text-base font-medium text-foreground">
                {formData.fullName}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-2 border-b border-border gap-2">
              <span className="text-xs sm:text-sm text-muted-foreground">Method</span>
              <span className="text-sm sm:text-base font-medium text-foreground">
                {getMethodLabel()}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-2 gap-2">
              <span className="text-xs sm:text-sm text-muted-foreground">Data</span>
              <span className="text-sm sm:text-base font-medium text-foreground">
                {method === 'voice' && 'Ready'}
                {method === 'drawing' && 'Ready'}
                {method === 'video' && 'Ready'}
              </span>
            </div>
          </div>
        </Card>

        {/* Consent */}
        <Card className="bg-secondary/50 border-0 p-4 sm:p-6">
          <div className="space-y-2 text-xs sm:text-sm text-foreground">
            <p>✓ I confirm all patient information is accurate</p>
            <p>✓ The {method} sample is from the stated patient</p>
            <p>✓ I consent to analyze this data for UPDRS prediction</p>
            <p>✓ I understand the results are for informational purposes only</p>
          </div>
        </Card>

        {!hasRequiredData() && (
          <p className="text-xs sm:text-sm text-destructive text-center">
            Please upload or record a sample before submitting
          </p>
        )}

        <Button
          onClick={handleSubmit}
          disabled={!hasRequiredData() || isSubmitting}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-sm sm:text-base py-5"
        >
          {isSubmitting ? 'Analyzing...' : 'Analyze & Get UPDRS Score'}
        </Button>
      </div>
    </div>
  )
}
