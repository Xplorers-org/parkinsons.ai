'use client'

import { Card } from '@/components/ui/card'
import { CheckCircle } from 'lucide-react'

interface FinalResultsProps {
  formData: any
}

export default function FinalResults({ formData }: FinalResultsProps) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <CheckCircle className="w-16 h-16 mx-auto text-primary mb-4" />
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
          Analysis Complete
        </h2>
        <p className="text-muted-foreground">Your UPDRS prediction has been calculated</p>
      </div>

      {/* Results Summary */}
      <Card className="bg-secondary/50 border-0 p-6">
        <h3 className="text-lg font-semibold text-foreground mb-6">UPDRS Score Summary</h3>

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Voice Analysis Score */}
            <div className="bg-background rounded-lg p-4">
              <p className="text-xs sm:text-sm text-muted-foreground mb-2">Voice Analysis</p>
              <div className="text-3xl sm:text-4xl font-bold text-primary">24</div>
              <p className="text-xs text-muted-foreground mt-1">out of 52</p>
            </div>

            {/* Drawing Analysis Score */}
            <div className="bg-background rounded-lg p-4">
              <p className="text-xs sm:text-sm text-muted-foreground mb-2">Drawing Analysis</p>
              <div className="text-3xl sm:text-4xl font-bold text-primary">18</div>
              <p className="text-xs text-muted-foreground mt-1">out of 36</p>
            </div>

            {/* Walking Analysis Score */}
            <div className="bg-background rounded-lg p-4">
              <p className="text-xs sm:text-sm text-muted-foreground mb-2">Walking Analysis</p>
              <div className="text-3xl sm:text-4xl font-bold text-primary">22</div>
              <p className="text-xs text-muted-foreground mt-1">out of 52</p>
            </div>
          </div>

          {/* Total Score */}
          <div className="bg-primary/10 rounded-lg p-6 text-center mt-6">
            <p className="text-muted-foreground mb-2">Total Motor UPDRS Score</p>
            <div className="text-5xl font-bold text-primary">64</div>
            <p className="text-sm text-muted-foreground mt-2">out of 132</p>
            <p className="text-xs text-muted-foreground mt-3">
              Moderate Parkinson's Severity
            </p>
          </div>
        </div>
      </Card>

      {/* Patient Info */}
      <Card className="bg-secondary/50 border-0 p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Patient Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-xs text-muted-foreground">Patient Name</p>
            <p className="font-medium text-foreground">{formData.fullName || '-'}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Patient ID</p>
            <p className="font-medium text-foreground">{formData.patientId || '-'}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Age</p>
            <p className="font-medium text-foreground">{formData.age || '-'}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Gender</p>
            <p className="font-medium text-foreground">{formData.gender || '-'}</p>
          </div>
        </div>
      </Card>

      {/* Disclaimer */}
      <Card className="bg-secondary/50 border-0 p-4 border-l-4 border-primary">
        <p className="text-xs sm:text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">Disclaimer: </span>
          These results are for informational purposes only and should not be used as a substitute for professional medical advice. Please consult with a healthcare provider for proper diagnosis and treatment.
        </p>
      </Card>
    </div>
  )
}
