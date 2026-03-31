'use client'

import { useRef, useState } from 'react'
import { Mic, Upload, Video } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

type PredictionMethod = 'voice' | 'drawing' | 'video'

interface DataInputProps {
  method: PredictionMethod
  formData: {
    voiceFile?: File
    voiceUrl?: string
    drawingFile?: File
    drawingUrl?: string
    videoFile?: File
    videoUrl?: string
  }
  onFormChange: (field: string, value: File | string) => void
}

export default function DataInput({ method, formData, onFormChange }: DataInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  let mediaRecorder: MediaRecorder | null = null
  let recordingInterval: NodeJS.Timeout | null = null

  const startRecording = async () => {
    if (method !== 'voice') return
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    mediaRecorder = new MediaRecorder(stream)
    const chunks: Blob[] = []

    mediaRecorder.ondataavailable = (e) => chunks.push(e.data)
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'audio/wav' })
      const file = new File([blob], 'recording.wav', { type: 'audio/wav' })
      onFormChange('voiceFile', file)
      onFormChange('voiceUrl', URL.createObjectURL(blob))
    }

    mediaRecorder.start()
    setIsRecording(true)
    setRecordingTime(0)
    recordingInterval = setInterval(() => {
      setRecordingTime(t => t + 1)
    }, 1000)
  }

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop()
      setIsRecording(false)
      if (recordingInterval) clearInterval(recordingInterval)
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (method === 'voice') {
      onFormChange('voiceFile', file)
      onFormChange('voiceUrl', URL.createObjectURL(file))
    } else if (method === 'drawing') {
      onFormChange('drawingFile', file)
      onFormChange('drawingUrl', URL.createObjectURL(file))
    } else if (method === 'video') {
      onFormChange('videoFile', file)
      onFormChange('videoUrl', URL.createObjectURL(file))
    }
  }

  const getFileUrl = () => {
    if (method === 'voice') return formData.voiceUrl
    if (method === 'drawing') return formData.drawingUrl
    if (method === 'video') return formData.videoUrl
    return undefined
  }

  const getFileName = () => {
    if (method === 'voice') return formData.voiceFile?.name
    if (method === 'drawing') return formData.drawingFile?.name
    if (method === 'video') return formData.videoFile?.name
    return undefined
  }

  const fileUrl = getFileUrl()
  const fileName = getFileName()

  return (
    <div>
      <div className="mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
          {method === 'voice' && 'Upload/Record Voice'}
          {method === 'drawing' && 'Upload Drawing'}
          {method === 'video' && 'Upload Walking Video'}
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground">
          {method === 'voice' && 'Record or upload a voice sample'}
          {method === 'drawing' && 'Upload your spiral or wave drawing'}
          {method === 'video' && 'Upload your walking video sample'}
        </p>
      </div>

      {!fileUrl ? (
        <div className="space-y-4">
          {method === 'voice' && (
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Button
                onClick={isRecording ? stopRecording : startRecording}
                className={`flex-1 flex items-center justify-center gap-2 text-sm sm:text-base ${
                  isRecording
                    ? 'bg-destructive hover:bg-destructive/90'
                    : 'bg-primary hover:bg-primary/90'
                } text-primary-foreground`}
              >
                <Mic className="w-4 h-4" />
                {isRecording ? `Stop Recording (${recordingTime}s)` : 'Start Recording'}
              </Button>
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <Upload className="w-4 h-4" />
                Upload File
              </Button>
            </div>
          )}

          {method !== 'voice' && (
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center justify-center gap-2 text-sm sm:text-base py-6"
            >
              <Upload className="w-5 h-5" />
              Choose {method === 'drawing' ? 'Drawing' : 'Video'} File
            </Button>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept={
              method === 'voice'
                ? 'audio/*'
                : method === 'drawing'
                  ? 'image/*'
                  : 'video/*'
            }
            className="hidden"
            onChange={handleFileUpload}
          />
        </div>
      ) : (
        <Card className="bg-secondary/50 border-0 p-4 sm:p-6">
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 p-3 rounded-lg">
              {method === 'voice' && <Mic className="w-6 h-6 text-primary" />}
              {method === 'drawing' && <Upload className="w-6 h-6 text-primary" />}
              {method === 'video' && <Video className="w-6 h-6 text-primary" />}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground mb-1">
                {method === 'drawing' && 'Drawing'}
                {method === 'voice' && 'Voice Sample'}
                {method === 'video' && 'Video'}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground mb-3">
                {fileName}
              </p>

              {method === 'voice' && fileUrl && (
                <audio controls className="w-full mb-3">
                  <source src={fileUrl} type="audio/wav" />
                </audio>
              )}

              {method === 'drawing' && fileUrl && (
                <img src={fileUrl} alt="Drawing" className="max-w-xs mb-3 rounded" />
              )}

              {method === 'video' && fileUrl && (
                <video controls className="max-w-sm mb-3 rounded">
                  <source src={fileUrl} type="video/mp4" />
                </video>
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs sm:text-sm"
              >
                Change File
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
