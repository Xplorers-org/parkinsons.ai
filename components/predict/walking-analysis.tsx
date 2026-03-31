'use client'

import { useRef } from 'react'
import { Upload, Video as VideoIcon, Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface WalkingAnalysisProps {
  phase: number
  formData: any
  onFormChange: (field: string, value: any) => void
}

export default function WalkingAnalysis({
  phase,
  formData,
  onFormChange,
}: WalkingAnalysisProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoUrl = formData.videoUrl || ''

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      onFormChange('videoUrl', url)
      onFormChange('videoFile', file)
    }
  }

  if (phase === 1) {
    return (
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-6">
          Upload Walking Video
        </h2>

        <Card className="bg-secondary/50 border-0 p-6 mb-8">
          <p className="text-sm text-muted-foreground mb-2">
            Upload a video of patient walking (MP4, MOV, AVI)
          </p>
          <p className="text-xs text-muted-foreground">
            Recommended: At least 30 seconds, full body visible, good lighting
          </p>
        </Card>

        <div className="space-y-4">
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center justify-center gap-2 py-12 text-base border-2 border-dashed hover:bg-secondary"
          >
            <VideoIcon className="w-6 h-6" />
            <div className="text-center">
              <p className="font-medium">Click to upload walking video</p>
              <p className="text-xs text-muted-foreground">or drag and drop</p>
            </div>
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            className="hidden"
            onChange={handleFileUpload}
          />

          {videoUrl && (
            <Card className="bg-secondary/50 border-0 p-4">
              <video
                src={videoUrl}
                className="w-full h-48 bg-black rounded"
                controls
              />
              <p className="text-sm text-muted-foreground mt-2">Video uploaded</p>
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
          Video Preview
        </h2>

        {videoUrl && (
          <Card className="bg-secondary/50 border-0 p-6">
            <video
              src={videoUrl}
              className="w-full h-80 bg-black rounded mb-4"
              controls
            />
            <p className="text-sm text-foreground">
              Walking video is ready for analysis
            </p>
          </Card>
        )}
      </div>
    )
  }

  return null
}
