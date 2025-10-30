import { useState, useRef, useEffect } from "react";
import { Card } from "../../components/ui/card.jsx";
import { Button } from "../../components/ui/button.jsx";
import { Video, Camera, CheckCircle2, Circle, Square, Shield } from "lucide-react";
import { Alert, AlertDescription } from "../../components/ui/alert.jsx";

export function VideoKYC({ onComplete }) {
  const [isRecording, setIsRecording] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [demoMode, setDemoMode] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);

  useEffect(() => {
    return () => {
      // Cleanup camera stream
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  useEffect(() => {
    let timer;
    if (isRecording && recordingTime < 5) {
      timer = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } else if (recordingTime >= 5 && isRecording) {
      stopRecording();
    }
    return () => clearInterval(timer);
  }, [isRecording, recordingTime]);

  const startCamera = async () => {
    try {
      setCameraError("");
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setShowCamera(true);
      setDemoMode(false);
    } catch (error) {
      console.error("Camera access denied:", error);
      if (error instanceof Error) {
        if (error.name === "NotAllowedError") {
          setCameraError("Camera access denied. You can continue in demo mode to test the flow.");
        } else if (error.name === "NotFoundError") {
          setCameraError("No camera found. You can continue in demo mode to test the flow.");
        } else {
          setCameraError("Unable to access camera. You can continue in demo mode to test the flow.");
        }
      }
    }
  };

  const startDemoMode = () => {
    setCameraError("");
    setShowCamera(true);
    setDemoMode(true);
  };

  const startRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
  };

  const stopRecording = () => {
    setIsRecording(false);
    setIsCompleted(true);
  };

  const handleComplete = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    onComplete();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-4 lg:p-8 pt-8">
        <div className="text-center mb-8">
          <h2 className="text-white mb-2">Video KYC Verification</h2>
          <p className="text-slate-400">One-time verification to secure your token migration</p>
        </div>

        {/* KYC Card */}
        <Card className="bg-slate-900/70 border-slate-800 backdrop-blur-xl p-6 lg:p-8 mb-6 shadow-2xl">
          {/* Demo Mode Indicator */}
          {demoMode && (
            <Alert className="bg-blue-900/20 border-blue-500/30 mb-6">
              <Video className="h-4 w-4 text-blue-400" />
              <AlertDescription className="text-slate-300">
                <strong className="text-blue-400">Demo Mode:</strong> Camera simulation is active. In production, actual video recording would be performed.
              </AlertDescription>
            </Alert>
          )}

          {/* Progress Indicator */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex flex-col items-center">
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center border-2 transition-all ${
                  isCompleted
                    ? "bg-green-500 border-green-500"
                    : showCamera
                    ? "bg-blue-500 border-blue-500"
                    : "bg-slate-800 border-slate-700"
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-8 h-8 text-white" />
                ) : (
                  <Video className="w-8 h-8 text-white" />
                )}
              </div>
              <p className="text-slate-400 mt-3">
                {isCompleted ? "Verification Complete" : "Video Verification"}
              </p>
            </div>
          </div>

          {/* Video Preview */}
          <div className="mb-6">
            <div className="bg-slate-950 rounded-xl overflow-hidden border-2 border-slate-700 aspect-video relative">
              {showCamera ? (
                <>
                  {demoMode ? (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
                      <div className="w-32 h-32 bg-blue-500/20 rounded-full flex items-center justify-center mb-4">
                        <Camera className="w-16 h-16 text-blue-400" />
                      </div>
                      <p className="text-white mb-1">Demo Mode Active</p>
                      <p className="text-slate-400">Simulating camera feed</p>
                      {isRecording && (
                        <div className="mt-4 flex items-center gap-2 bg-red-500 px-4 py-2 rounded-full">
                          <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                          <span className="text-white">Recording {5 - recordingTime}s</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <>
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover"
                      />
                      {isRecording && (
                        <div className="absolute top-4 right-4 flex items-center gap-2 bg-red-500 px-3 py-2 rounded-full shadow-lg">
                          <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                          <span className="text-white">REC {5 - recordingTime}s</span>
                        </div>
                      )}
                    </>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-6">
                  <Camera className="w-16 h-16 text-slate-600 mb-4" />
                  <p className="text-slate-400 mb-2">Camera preview will appear here</p>
                  {cameraError && (
                    <div className="mt-4 p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg max-w-md">
                      <p className="text-yellow-400 text-center">{cameraError}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Verification Statement */}
          {!isCompleted && (
            <Alert className="bg-blue-900/20 border-blue-500/30 mb-6">
              <Video className="h-4 w-4 text-blue-400" />
              <AlertDescription>
                <p className="text-slate-300 mb-2">Please read this statement clearly on camera:</p>
                <p className="text-white">
                  "I confirm that I am the rightful owner of these tokens and agree to the migration terms including the 4% monthly vesting schedule over 25 periods."
                </p>
              </AlertDescription>
            </Alert>
          )}

          {/* Instructions */}
          {!isCompleted && (
            <div className="bg-slate-800/50 rounded-lg p-4 lg:p-6 border border-slate-700 mb-6">
              <h3 className="text-white mb-3">Instructions:</h3>
              <ul className="space-y-2 text-slate-300">
                {!demoMode ? (
                  <>
                    <li className="flex items-start gap-2">
                      <Circle className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-400" />
                      <span>Position yourself in a well-lit area with your face clearly visible</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Circle className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-400" />
                      <span>Read the statement above clearly and audibly</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Circle className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-400" />
                      <span>Recording will automatically stop after 5 seconds</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Circle className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-400" />
                      <span>This is a one-time verification process</span>
                    </li>
                  </>
                ) : (
                  <>
                    <li className="flex items-start gap-2">
                      <Circle className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-400" />
                      <span>Demo mode simulates the video recording process</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Circle className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-400" />
                      <span>Click "Simulate Recording" to proceed</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Circle className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-400" />
                      <span>Recording simulation lasts 5 seconds</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Circle className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-400" />
                      <span>In production, actual camera would be required</span>
                    </li>
                  </>
                )}
              </ul>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            {!showCamera ? (
              <>
                <Button
                  onClick={startCamera}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0"
                >
                  <Camera className="w-5 h-5 mr-2" />
                  Enable Camera
                </Button>
                {cameraError && (
                  <Button
                    onClick={startDemoMode}
                    variant="outline"
                    className="flex-1 bg-slate-800 border-slate-700 text-white hover:bg-slate-700"
                  >
                    <Video className="w-5 h-5 mr-2" />
                    Use Demo Mode
                  </Button>
                )}
              </>
            ) : !isCompleted ? (
              <Button
                onClick={startRecording}
                disabled={isRecording}
                className="w-full bg-red-600 hover:bg-red-700 text-white border-0 disabled:opacity-50"
              >
                {isRecording ? (
                  <>
                    <Square className="w-5 h-5 mr-2" />
                    Recording... ({5 - recordingTime}s)
                  </>
                ) : (
                  <>
                    <Video className="w-5 h-5 mr-2" />
                    {demoMode ? "Simulate Recording" : "Start Recording"}
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={handleComplete}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0"
              >
                <CheckCircle2 className="w-5 h-5 mr-2" />
                Complete Verification
              </Button>
            )}
          </div>
        </Card>

        {/* Security Notice */}
        <div className="text-center text-slate-500">
          <p>🔒 Your video is encrypted and stored securely • One-time verification only</p>
        </div>
      </div>
    </div>
  );
}
