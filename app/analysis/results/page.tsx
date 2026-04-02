"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnalysisSidebar } from "@/components/analysis/analysis-sidebar";
import { Button } from "@/components/ui/button";
import { Download, Share2, Printer, CheckCircle2, Activity, Brain, TrendingUp, Loader2, Play } from "lucide-react";
import { PatientData } from "@/components/analysis/patient-info-form";
import { toast } from "sonner";

export default function ResultsPage() {
  const router = useRouter();
  const [patientData, setPatientData] = useState<PatientData | null>(null);
  const [voiceResult, setVoiceResult] = useState<any>(null);
  const [gaitResult, setGaitResult] = useState<any>(null);
  const [drawingResult, setDrawingResult] = useState<any>(null);
  const [localVideoUrl, setLocalVideoUrl] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  
  const completedSteps = ["patient-info", "voice", "drawing", "gait"];

  useEffect(() => {
    const storedData = sessionStorage.getItem("patientData");
    if (storedData) setPatientData(JSON.parse(storedData));

    const vResult = sessionStorage.getItem("voiceResult");
    if (vResult) setVoiceResult(JSON.parse(vResult));

    const gResult = sessionStorage.getItem("gaitResult");
    if (gResult) setGaitResult(JSON.parse(gResult));

    const dResult = sessionStorage.getItem("drawingResult");
    if (dResult) setDrawingResult(JSON.parse(dResult));

    return () => {
      if (localVideoUrl) URL.revokeObjectURL(localVideoUrl);
    };
  }, [localVideoUrl]);

  const handleDownloadVideo = async () => {
    if (!gaitResult?.annotated_video_url) return;
    
    setIsDownloading(true);
    try {
      const response = await fetch(gaitResult.annotated_video_url);
      if (!response.ok) throw new Error("Could not download video");
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setLocalVideoUrl(url);
      toast.success("Video ready for playback");
    } catch (error) {
      console.error("Video download failed:", error);
      toast.error("Failed to load video preview");
    } finally {
      setIsDownloading(false);
    }
  };

  const getProgress = () => {
    return { current: 4, total: 4 };
  };

  // Safe formatting functions
  const formatVoiceScore = () => {
    if (!voiceResult) return "N/A";
    return Number(voiceResult.prediction)?.toFixed(2) || "N/A";
  };

  const formatGaitScore = () => {
    if (!gaitResult) return "N/A";
    return Number(gaitResult.gait_score)?.toFixed(2) || "N/A";
  };

  const formatDrawingScore = () => {
    if (!drawingResult) return "N/A";
    const spiral = Number(drawingResult.spiral?.sigmoid_probability || 0);
    const wave = Number(drawingResult.wave?.sigmoid_probability || 0);
    return (((spiral + wave) / 2) * 100).toFixed(1) + "%";
  };

  return (
    <div className="flex min-h-screen bg-background dark:bg-[#0a0e17]">
      <AnalysisSidebar
        currentStep="results"
        completedSteps={completedSteps}
        progress={getProgress()}
      />

      <main className="flex-1 ml-60">
        <div className="max-w-4xl mx-auto px-8 py-12">
          {/* Header code stays the same... */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground dark:text-white">
                Analysis Results
              </h1>
              <p className="text-muted-foreground dark:text-gray-400 mt-2">
                Comprehensive neurological assessment report
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" className="border-border dark:border-white/10">
                <Share2 className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon" className="border-border dark:border-white/10">
                <Printer className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon" className="border-border dark:border-white/10">
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Overall Score Banner */}
          <div className="bg-card dark:bg-[#161b26] rounded-2xl border border-border dark:border-white/10 p-8 mb-6 text-center">
            <p className="text-muted-foreground dark:text-gray-400 mb-2">Overall Assessment Status</p>
            <div className="text-4xl font-bold text-primary mb-2">Analysis Complete</div>
            <p className="text-sm text-muted-foreground dark:text-gray-400">
              Review individual component scores below
            </p>
          </div>

          {/* Patient Summary */}
          <div className="bg-card dark:bg-[#161b26] rounded-2xl border border-border dark:border-white/10 p-6 mb-6">
            <h3 className="text-lg font-semibold text-foreground dark:text-white mb-4">
              Patient Summary
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-secondary dark:bg-[#0f1219] rounded-xl p-4">
                <p className="text-sm text-muted-foreground dark:text-gray-400">Name</p>
                <p className="font-medium text-foreground dark:text-white">
                  {patientData?.fullName || "N/A"}
                </p>
              </div>
              <div className="bg-secondary dark:bg-[#0f1219] rounded-xl p-4">
                <p className="text-sm text-muted-foreground dark:text-gray-400">Patient ID</p>
                <p className="font-medium text-foreground dark:text-white">
                  {patientData?.patientId || "N/A"}
                </p>
              </div>
              <div className="bg-secondary dark:bg-[#0f1219] rounded-xl p-4">
                <p className="text-sm text-muted-foreground dark:text-gray-400">Gender</p>
                <p className="font-medium text-foreground dark:text-white capitalize">
                  {patientData?.gender || "N/A"}
                </p>
              </div>
              <div className="bg-secondary dark:bg-[#0f1219] rounded-xl p-4">
                <p className="text-sm text-muted-foreground dark:text-gray-400">Age</p>
                <p className="font-medium text-foreground dark:text-white">
                  {patientData?.age || "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Status Cards */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <div className="bg-card dark:bg-[#161b26] rounded-xl border border-border dark:border-white/10 p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground dark:text-white">Voice</p>
                  <p className="text-xs text-green-500">Completed</p>
                </div>
              </div>
              <div className="h-1 bg-green-500 rounded-full" />
            </div>

            <div className="bg-card dark:bg-[#161b26] rounded-xl border border-border dark:border-white/10 p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Brain className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground dark:text-white">Drawing</p>
                  <p className="text-xs text-green-500">Completed</p>
                </div>
              </div>
              <div className="h-1 bg-green-500 rounded-full" />
            </div>

            <div className="bg-card dark:bg-[#161b26] rounded-xl border border-border dark:border-white/10 p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground dark:text-white">Gait</p>
                  <p className="text-xs text-green-500">Completed</p>
                </div>
              </div>
              <div className="h-1 bg-green-500 rounded-full" />
            </div>
          </div>

          {/* Individual Results Details */}
          <div className="space-y-4 mb-8">
            <div className="bg-card dark:bg-[#161b26] rounded-xl border border-border dark:border-white/10 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground dark:text-white">Voice Analysis (UPDRS)</h3>
                <span className="text-2xl font-bold text-green-500">{formatVoiceScore()}</span>
              </div>
              <p className="text-sm text-muted-foreground dark:text-gray-400 mt-3">
                Predicted UPDRS score based on voice features.
              </p>
            </div>

            <div className="bg-card dark:bg-[#161b26] rounded-xl border border-border dark:border-white/10 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground dark:text-white">Gait Analysis</h3>
                <span className="text-2xl font-bold text-yellow-500">{formatGaitScore()}</span>
              </div>
              <p className="text-sm text-muted-foreground dark:text-gray-400 mt-3 mb-4">
                Severity score based on pose estimation variance.
              </p>
              
              {gaitResult?.annotated_video_url && (
                <div className="mt-4 border-t border-border dark:border-white/10 pt-4">
                  <h4 className="text-sm font-medium text-foreground dark:text-white mb-3">Pose Estimation (Annotated)</h4>
                  
                  {!localVideoUrl ? (
                    <Button 
                      onClick={handleDownloadVideo} 
                      disabled={isDownloading}
                      variant="outline"
                      className="w-full max-w-md h-32 flex flex-col gap-2 rounded-xl border-dashed border-2 hover:border-primary/50 hover:bg-primary/5 transition-all"
                    >
                      {isDownloading ? (
                        <>
                          <Loader2 className="w-6 h-6 animate-spin text-primary" />
                          <span className="font-medium">Buffering Video...</span>
                        </>
                      ) : (
                        <>
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-1">
                            <Play className="w-5 h-5 text-primary fill-primary" />
                          </div>
                          <span className="font-medium">Download & Play Annotated Video</span>
                          <span className="text-xs text-muted-foreground">Load locally for smooth frame-by-frame review</span>
                        </>
                      )}
                    </Button>
                  ) : (
                    <div className="relative w-full max-w-md group">
                      <video
                        controls
                        playsInline
                        autoPlay
                        src={localVideoUrl}
                        className="w-full rounded-lg overflow-hidden border border-border dark:border-white/10 shadow-lg"
                      />
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setLocalVideoUrl(null)}
                        className="mt-2 text-xs text-muted-foreground hover:text-destructive transition-colors"
                      >
                        Reset Video
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="bg-card dark:bg-[#161b26] rounded-xl border border-border dark:border-white/10 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground dark:text-white">Drawing Analysis</h3>
                <span className="text-2xl font-bold text-red-500">{formatDrawingScore()}</span>
              </div>
              <p className="text-sm text-muted-foreground dark:text-gray-400 mt-3">
                Parkinson's probability based on micro-tremors in spiral and wave drawings.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={() => router.push("/analysis")}
              className="border-border dark:border-white/10"
            >
              Start New Analysis
            </Button>
            <Button
              onClick={() => {
                sessionStorage.clear();
                router.push("/");
              }}
              className="bg-primary hover:bg-primary/90"
            >
              Finish & Return Home
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
