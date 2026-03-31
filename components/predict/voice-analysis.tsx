'use client'

import { useRef, useState } from 'react'
import { Mic, Upload, Play, Pause } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface VoiceAnalysisProps {
  phase: number
  formData: any
  onFormChange: (field: string, value: any) => void
}

export default function VoiceAnalysis({
  phase,
  formData,
  onFormChange,
}: VoiceAnalysisProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [recordedUrl, setRecordedUrl] = useState<string>('')
  const [isPlaying, setIsPlaying] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioRef = useRef<HTMLAudioElement>(null)

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    const mediaRecorder = new MediaRecorder(stream)
    mediaRecorderRef.current = mediaRecorder

    const chunks: Blob[] = []
    mediaRecorder.ondataavailable = (e) => chunks.push(e.data)
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'audio/wav' })
      const url = URL.createObjectURL(blob)
      setRecordedUrl(url)
      onFormChange('voiceFile', blob)
    }

    mediaRecorder.start()
    setIsRecording(true)
  }

  const stopRecording = () => {
    mediaRecorderRef.current?.stop()
    setIsRecording(false)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setRecordedUrl(url)
      onFormChange('voiceFile', file)
    }
  }

  if (phase === 1) {
    return (
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-6">
          Record or Upload Voice Sample
        </h2>

        <Card className="bg-secondary/50 border-0 p-6 mb-8">
          <p className="text-sm text-muted-foreground mb-2">
            Record at least 30 seconds of normal speech or upload an audio file
          </p>
        </Card>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={isRecording ? stopRecording : startRecording}
              className={`flex-1 flex items-center justify-center gap-2 text-sm sm:text-base ${
                isRecording ? 'bg-destructive hover:bg-destructive/90' : 'bg-primary hover:bg-primary/90'
              } text-primary-foreground`}
            >
              <Mic className="w-4 h-4" />
              {isRecording ? 'Stop Recording' : 'Start Recording'}
            </Button>
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <Upload className="w-4 h-4" />
              Upload File
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*"
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>

          {recordedUrl && (
            <Card className="bg-secondary/50 border-0 p-4">
              <div className="flex items-center gap-3">
                <audio ref={audioRef} src={recordedUrl} />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (audioRef.current) {
                      if (isPlaying) {
                        audioRef.current.pause()
                      } else {
                        audioRef.current.play()
                      }
                      setIsPlaying(!isPlaying)
                    }
                  }}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </Button>
                <span className="text-sm text-muted-foreground">Voice sample ready</span>
              </div>
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
          Voice Sample Preview
        </h2>

        <Card className="bg-secondary/50 border-0 p-6 space-y-4">
          {recordedUrl && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <audio ref={audioRef} src={recordedUrl} />
              <Button
                variant="ghost"
                onClick={() => {
                  if (audioRef.current) {
                    if (isPlaying) {
                      audioRef.current.pause()
                    } else {
                      audioRef.current.play()
                    }
                    setIsPlaying(!isPlaying)
                  }
                }}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
              <span className="text-sm text-foreground">Voice sample recorded successfully</span>
            </div>
          )}
          <p className="text-sm text-muted-foreground">
            Your voice sample is ready for analysis
          </p>
        </Card>
      </div>
    )
  }

  return null
}
