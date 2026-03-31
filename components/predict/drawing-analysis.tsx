'use client'

import { useRef } from 'react'
import { Upload, Image as ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface DrawingAnalysisProps {
  phase: number
  formData: any
  onFormChange: (field: string, value: any) => void
}

export default function DrawingAnalysis({
  phase,
  formData,
  onFormChange,
}: DrawingAnalysisProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const drawingUrl = formData.drawingUrl || ''

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      onFormChange('drawingUrl', url)
      onFormChange('drawingFile', file)
    }
  }

  if (phase === 1) {
    return (
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-6">
          Upload Drawing Sample
        </h2>

        <Card className="bg-secondary/50 border-0 p-6 mb-8">
          <p className="text-sm text-muted-foreground mb-2">
            Upload a photo of spiral or wave drawing (JPG, PNG)
          </p>
          <p className="text-xs text-muted-foreground">
            Recommended: Clear, well-lit image with visible drawing strokes
          </p>
        </Card>

        <div className="space-y-4">
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center justify-center gap-2 py-12 text-base border-2 border-dashed hover:bg-secondary"
          >
            <ImageIcon className="w-6 h-6" />
            <div className="text-center">
              <p className="font-medium">Click to upload drawing</p>
              <p className="text-xs text-muted-foreground">or drag and drop</p>
            </div>
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileUpload}
          />

          {drawingUrl && (
            <Card className="bg-secondary/50 border-0 p-4">
              <img
                src={drawingUrl}
                alt="Drawing sample"
                className="w-full h-48 object-cover rounded"
              />
              <p className="text-sm text-muted-foreground mt-2">Drawing uploaded</p>
            </Card>
          )}
        </div>
      </div>
    )
  }

  if (phase === 2) {
    return (
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-6">
          Drawing Preview
        </h2>

        {drawingUrl && (
          <Card className="bg-secondary/50 border-0 p-6">
            <img
              src={drawingUrl}
              alt="Drawing sample"
              className="w-full h-80 object-cover rounded mb-4"
            />
            <p className="text-sm text-foreground">
              Drawing sample is ready for analysis
            </p>
          </Card>
        )}
      </div>
    )
  }

  return null
}
