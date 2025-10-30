
// import { useVideoUploadMutation, useVideoVerificationMutation } from "@/services/auth"
// import { setCreateHedgeStep } from "@/services/GlobalSlice"
import { useState, useRef, useEffect } from "react"
import { toast } from "react-hot-toast";
import { LuLoader, LuUpload } from "react-icons/lu"

function VideoKyc({ refetch, step, setStep }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [transcribedText, setTranscribedText] = useState("")
  const [accuracy, setAccuracy] = useState(null)
  const [stream, setStream] = useState(null)
  const [recordedChunks, setRecordedChunks] = useState([])
  const [videoUrl, setVideoUrl] = useState(null)
  const [showPreview, setShowPreview] = useState(false)
  const videoRef = useRef(null)
  const recognitionRef = useRef(null)
  const mediaRecorderRef = useRef(null)
  // const dispatch = useDispatch()
  const [text, setText] = useState(false);

  const handleBack = () => {
    if (step === 1) {
      // dispatch(setCreateHedgeStep(1));
    } else if (step === 2) {
      setAdharNumber("");
      setOtp("");
      setPanNumber("");
      setError("");
      setStep(1);
    } else if (step === 3) {
      setStep(2);
    } else if (step === 4) {
      setStep(3);
    }
  };

  // const [videoUpload] = useVideoUploadMutation()
  // const [videoVerification, { isLoading }] = useVideoVerificationMutation()

  const givenParagraph = "I accept the term and conditions, understand the risks, and take full responsibility for my investment"

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition()
        recognitionRef.current.lang = "en-US"
        recognitionRef.current.continuous = true
        recognitionRef.current.interimResults = false
      }
    }
  }, [])

  const startVideo = async () => {
    if (!navigator?.mediaDevices?.getUserMedia) {
      console.error("getUserMedia is not supported in this browser.");
      toast.error("Camera and microphone access not supported.");
      return;
    }

    try {
      const userStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: true,
      })

      handleStreamSetup(userStream)
      handleMediaRecorder(userStream)
      startSpeechRecognition()
    } catch (error) {
      console.error("Error accessing webcam and microphone:", error);
      toast.error("Error accessing webcam and microphone.");
    }
  }

  const handleStreamSetup = (userStream) => {
    try {
      setStream(userStream)
      if (videoRef.current) {
        videoRef.current.muted = true
        videoRef.current.srcObject = userStream
        videoRef.current.play()
      }
      setIsPlaying(true)
    } catch (err) {
      console.log("handleStreamSetup", err);
      toast.error("Error setting up video stream.");
    }
  }

  const handleMediaRecorder = (userStream) => {
    try {
      mediaRecorderRef.current = new MediaRecorder(userStream, {
        // mimeType: "video/mp4",
        mimeType: "video/webm;codecs=vp8,opus",
      })

      const chunks = []
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data)
          setRecordedChunks(chunks)
        }
      }

      mediaRecorderRef.current.onstop = () => {
        try {
          const blob = new Blob(chunks, { type: "video/webm" })
          const url = URL.createObjectURL(blob)
          setVideoUrl(url)
          setShowPreview(true)
          if (videoRef.current) {
            videoRef.current.srcObject = null
            videoRef.current.src = url
          }
        } catch (e) {
          console.error("Preview generation failed", e)
        }
      }

      mediaRecorderRef.current.start()
    } catch (err) {
      console.log("handleMediaRecorder", err);
      toast.error("Error starting video recording.");
    }
  }

  const startSpeechRecognition = () => {
    try {
      if (!recognitionRef.current) return

      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0].transcript)
          .join(" ")
        setTranscribedText(transcript.trim())
        setAccuracy(calculateAccuracy(transcript.trim(), givenParagraph))
      }

      recognitionRef.current.start()
    } catch (err) {
      console.log(err, "startSpeechRecognition error");
      toast.error("Error starting speech recognition.");
    }
  }

  const stopVideo = () => {
    try {
      if (videoRef.current) {
        videoRef.current.pause()
      }

      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
        setStream(null)
      }

      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }

      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop()
      }

      setIsPlaying(false)
    } catch (err) {
      console.log(err, "stopVideo error");
      toast.error("Error stopping video recording.");
    }
  }

  const resetPreview = () => {
    try {
      setShowPreview(false)
      setVideoUrl(null)
      setRecordedChunks([])
      setTranscribedText("")
      setAccuracy(null)
      if (videoRef.current) {
        videoRef.current.removeAttribute("src")
        videoRef.current.load()
      }
    } catch (e) {
      console.log("resetPreview error", e)
    }
  }

  const uploadVideo = async () => {
    setText(true);
    if (recordedChunks.length > 0) {
      const blob = new Blob(recordedChunks, { type: "video/webm" })
      const formData = new FormData()
      formData.append("video", blob, "recorded_video.webm")

      try {
        // const res = await videoUpload(formData).unwrap()
        // if (res) {
        //   const verifyRes = await videoVerification({ bucket: res.bucket, video: res.video }).unwrap();
        //   if (verifyRes.status === "COMPLETED") {
        //     // dispatch(setCreateHedgeStep(2))
        //     // refetch();
        //     toast.success("Video uploaded and verified successfully!")
        //     setRecordedChunks([])
        //     setTranscribedText("")
        //     setAccuracy(null)
        //   }
        //   else {
        //     toast.error("Video verification failed. Please try again.")
        //     setText(false);
        //     resetPreview();
        //   }
        // }
      } catch (error) {
        console.error("Error uploading video:", error)
        toast.error(error?.data?.message || error?.message || "Upload failed")
        setRecordedChunks([])
        setTranscribedText("")
        setAccuracy(null)
        setText(false);
        resetPreview();
      }
    }

  }

  const calculateAccuracy = (spokenText, referenceText) => {
    const editDistance = levenshteinDistance(spokenText, referenceText)
    const maxLength = Math.max(spokenText.length, referenceText.length)
    return ((1 - editDistance / maxLength) * 100).toFixed(2)
  }

  const levenshteinDistance = (a, b) => {
    const dp = Array(a.length + 1)
      .fill(null)
      .map(() => Array(b.length + 1).fill(null))

    for (let i = 0; i <= a.length; i++) dp[i][0] = i
    for (let j = 0; j <= b.length; j++) dp[0][j] = j

    for (let i = 1; i <= a.length; i++) {
      for (let j = 1; j <= b.length; j++) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1
        dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost)
      }
    }
    return dp[a.length][b.length]
  }

  useEffect(() => {
    if (accuracy !== null) {
      uploadVideo()
      stopVideo()
    }
  }, [accuracy, recordedChunks])

  return (
 <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center px-2">
  <div>
    {/* First Card: KYC Notice */}
    <div className="bg-gradient-to-br backdrop-blur-sm p-6 sm:p-8 rounded-2xl shadow-2xl border border-gray-700 backdrop-blur-sm">
      <h1 className="text-4xl sm:text-5xl font-extrabold text-orange-300 text-center">
        KYC
      </h1>
      <p className="mt-4 text-center text-gray-200 text-base sm:text-lg">
        Please complete your KYC first to claim your reward.
      </p>
    </div>

    {/* Second Card: Recording / Note / Controls */}
    <div className="mt-2">
      <p className="text-orange-300 text-sm sm:text-base text-center">
        <span className="font-semibold text-lg sm:text-xl text-orange-300 mr-1">NOTE:</span>
        Please click on the “Start” button and speak the paragraph text below.
      </p>

      <p className="mt-3 text-white text-sm sm:text-base px-1">
        {givenParagraph}
      </p>

      <div className="mt-5 flex justify-center px-2">
        <div className="relative w-full max-w-sm">
          <video
            ref={videoRef}
            className="border border-gray-600 rounded-lg w-full h-auto bg-black"
            autoPlay={!showPreview}
            controls={showPreview}
            playsInline
            muted={!showPreview}
          />
          {showPreview && (
            <button
              onClick={resetPreview}
              className="absolute top-2 right-2 z-20 bg-black/60 hover:bg-black/80 text-white rounded-full w-8 h-8 flex items-center justify-center transition"
              aria-label="Discard recording"
              title="Discard recording"
            >
              ×
            </button>
          )}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap justify-center space-x-3 space-y-3 sm:space-y-0">
        <button
          onClick={isPlaying ? stopVideo : startVideo}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-black shadow-lg bg-gradient-to-r from-orange-300 to-orange-400 hover:from-orange-400 hover:to-orange-500 transition"
        >
          {isPlaying ? "STOP" : "START"}
        </button>
        <button
          onClick={handleBack}
          className="px-6 py-3 rounded-xl font-bold text-orange-300 bg-black border border-gray-600 hover:bg-orange-400 hover:text-black transition"
        >
          Back
        </button>
        <button
          onClick={uploadVideo}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-black shadow-lg bg-gradient-to-r from-orange-300 to-orange-400 hover:from-orange-400 hover:to-orange-500 transition"
        >
          Continue
        </button>
      </div>

      {text && (
        <div className="mt-6 text-center">
          <LuLoader className="mx-auto animate-spin text-red-500" />
          <p className="mt-2 text-red-500 font-semibold text-sm sm:text-base">
            Your video verification may take 1–5 minutes. Please stay on this page.
          </p>
        </div>
      )}
    </div>
  </div>
</div>

  )
}



// Mock implementations for mobile-only version
const mockVideoKycMutation = () => [
  async (formData) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    return { unwrap: () => Promise.resolve({ message: "Video uploaded successfully!" }) }
  },
  // { isLoading: false },
]

const mockDispatch = () => { }
// const mockSetCreateHedgeStep = () => { }
const mockShowErrorToast = (message) => console.error(message)
const mockToast = {
  success: (message) => console.log("Success:", message),
}

function VideoKycMobile({ refetch, step, setStep }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [transcribedText, setTranscribedText] = useState("")
  const [accuracy, setAccuracy] = useState(null)
  const [stream, setStream] = useState(null)
  const [recordedChunks, setRecordedChunks] = useState([])
  const [isUploading, setIsUploading] = useState(false)
  const [videoUrl, setVideoUrl] = useState(null)
  const [showPreview, setShowPreview] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const videoRef = useRef(null)
  const previewVideoRef = useRef(null)
  const recognitionRef = useRef(null)
  const mediaRecorderRef = useRef(null)
  const handleBack = () => {
    if (step === 1) {
      // dispatch(setCreateHedgeStep(1));
    } else if (step === 2) {
      setAdharNumber("");
      setOtp("");
      setPanNumber("");
      setError("");
      setStep(1);
    } else if (step === 3) {
      setStep(2);
    } else if (step === 4) {
      setStep(3);
    }
  };

  const [videoKycData] = mockVideoKycMutation()

  const givenParagraph =
    "I accept the terms and conditions, understand the risks, and take full responsibility for my investment."

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition()
        recognitionRef.current.lang = "en-US"
        recognitionRef.current.continuous = true
        recognitionRef.current.interimResults = true // Enable interim results for better mobile experience

        // Add better error handling for mobile
        recognitionRef.current.onerror = (event) => {
          console.error("Speech recognition error:", event.error)
          setIsListening(false)
          if (event.error === "not-allowed") {
            alert("Microphone access denied. Please enable microphone permissions.")
          }
        }

        recognitionRef.current.onend = () => {
          setIsListening(false)
        }

        recognitionRef.current.onstart = () => {
          setIsListening(true)
        }
      } else {
        console.warn("Speech Recognition not supported on this browser")
      }
    }
  }, [])

  const startRecording = async () => {
    if (!navigator?.mediaDevices?.getUserMedia) {
      console.error("getUserMedia is not supported in this browser.")
      alert("Camera access is not supported in this browser.")
      return
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: true,
      })

      setStream(stream)

      // Setup video preview
      if (videoRef.current) {
        videoRef.current.muted = true
        videoRef.current.srcObject = stream
        videoRef.current.play()
      }

      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      const chunks = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: "video/webm" })
        const url = URL.createObjectURL(blob)
        setVideoUrl(url)
        setRecordedChunks(chunks)
        setShowPreview(true)
        // Don't auto-upload, let user preview first
      }

      mediaRecorder.start()
      setIsPlaying(true)
      setShowPreview(false)
      setVideoUrl(null)

      // Start speech recognition
      startSpeechRecognition()
    } catch (error) {
      console.error("Error accessing webcam and microphone:", error)
      alert("Failed to access camera/microphone. Please check permissions.")
    }
  }

  const stopRecording = () => {
    try {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop()
      }

      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
        setStream(null)
      }

      if (videoRef.current) {
        videoRef.current.pause()
        videoRef.current.srcObject = null
      }

      if (recognitionRef.current && isListening) {
        recognitionRef.current.stop()
      }

      setIsPlaying(false)
      setIsListening(false)
    } catch (err) {
      console.log(err, "stopRecording error")
    }
  }

  const startSpeechRecognition = () => {
    try {
      if (!recognitionRef.current) {
        console.warn("Speech recognition not available")
        return
      }

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = ""
        let interimTranscript = ""

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            finalTranscript += transcript
          } else {
            interimTranscript += transcript
          }
        }

        // Update transcribed text with final results
        if (finalTranscript) {
          const fullTranscript = (transcribedText + " " + finalTranscript).trim()
          setTranscribedText(fullTranscript)
          const calculatedAccuracy = calculateAccuracy(fullTranscript, givenParagraph)
          setAccuracy(calculatedAccuracy)
        }
      }

      recognitionRef.current.start()
    } catch (err) {
      console.log(err, "startSpeechRecognition error")
      setIsListening(false)
    }
  }

  const uploadVideo = async () => {
    if (recordedChunks.length > 0) {
      setIsUploading(true)
      const blob = new Blob(recordedChunks, { type: "video/webm" })
      const formData = new FormData()
      formData.append("video", blob, "mobile_recording.webm")
      formData.append("originalText", givenParagraph)
      formData.append("spokenText", transcribedText)
      formData.append("accuracy", accuracy || "0")

      try {
        const res = await videoKycData(formData)
        const result = await res.unwrap()
        if (result) {
          mockToast.success(result?.message || "Video uploaded successfully!")
          // Reset state after successful upload
          setRecordedChunks([])
          setTranscribedText("")
          setAccuracy(null)
          setVideoUrl(null)
          setShowPreview(false)
        }
      } catch (error) {
        console.error("Error uploading video:", error)
        mockShowErrorToast(error?.data?.message || error?.message || "Upload failed")
      } finally {
        setIsUploading(false)
      }
    }
  }

  const calculateAccuracy = (spokenText, referenceText) => {
    const editDistance = levenshteinDistance(spokenText, referenceText)
    const maxLength = Math.max(spokenText.length, referenceText.length)
    return ((1 - editDistance / maxLength) * 100).toFixed(2)
  }

  const levenshteinDistance = (a, b) => {
    const dp = Array(a.length + 1)
      .fill(null)
      .map(() => Array(b.length + 1).fill(null))

    for (let i = 0; i <= a.length; i++) dp[i][0] = i
    for (let j = 0; j <= b.length; j++) dp[0][j] = j

    for (let i = 1; i <= a.length; i++) {
      for (let j = 1; j <= b.length; j++) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1
        dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost)
      }
    }
    return dp[a.length][b.length]
  }

  return (
    <div className="p-3 text-center min-h-screen bg-gradient-to-b gray-900">
      <div className="max-w-md mx-auto flex flex-col items-center">

        <p className="text-white text-sm mb-1">
          <span className="font-bold text-base">NOTE:</span> Please click start and speak the text below.
        </p>
        <div className="bg-gray-800  p-3 rounded-lg mb-4">
          <p className="text-xs text-orange-300 leading-relaxed">{givenParagraph}</p>
        </div>

        <div className="relative mb-4">
          {!showPreview ? (
            // Live recording view
            <video
              ref={videoRef}
              className="w-full aspect-video bg-black rounded-lg border-2 border-gray-600 shadow-lg"
              autoPlay
              playsInline
              muted
            />
          ) : (
            // Video preview after recording
            <video
              ref={previewVideoRef}
              src={videoUrl}
              className="w-full aspect-video bg-black rounded-lg border-2 border-green-500 shadow-lg"
              controls
              playsInline
            />
          )}

          {isPlaying && (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold animate-pulse flex items-center gap-1">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              REC
            </div>
          )}

          {isListening && (
            <div className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              LISTENING
            </div>
          )}

          {isUploading && (
            <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center rounded-lg">
              <div className="text-white text-center">
                <LuLoader className="animate-spin mx-auto mb-2 text-2xl" />
                <p className="text-sm">Uploading...</p>
              </div>
            </div>
          )}
        </div>

        <div className="mb-4 space-y-2">
          {!showPreview ? (
            <button
              onClick={isPlaying ? stopRecording : startRecording}
              disabled={isUploading}
              className="px-8 flex gap-2 items-center justify-center py-3 rounded-xl font-medium text-white shadow-lg bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 transition-all">
              {isPlaying ? "🛑 STOP RECORDING" : "🎥 START RECORDING"}
              {isUploading && <LuLoader className="animate-spin" />}
            </button>
          ) : (
            <div className="space-y-2">
              <button
                onClick={() => {
                  setShowPreview(false)
                  setVideoUrl(null)
                  setRecordedChunks([])
                  setTranscribedText("")
                  setAccuracy(null)
                }}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-3 rounded-full font-semibold shadow-lg transition-all duration-200 active:scale-95"
              >
                🔄 RECORD AGAIN
              </button>
              <button
                onClick={uploadVideo}
                disabled={isUploading}
                className="w-full bg-gradient-to-r from-purple-600 to-purple-500 text-white px-6 py-3 rounded-full font-semibold shadow-lg transition-all duration-200 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <LuUpload className="text-lg" />
                {isUploading ? "UPLOADING..." : "UPLOAD VIDEO"}
                {isUploading && <LuLoader className="animate-spin" />}
              </button>
            </div>
          )}
        </div>
        <button
          onClick={handleBack}
          className="text-white/70 bg-white/10 border border-white/10 gap-2 px-8 py-3 m-2 rounded-xl hover:bg-white/15 hover:text-white"
        >
          Back
        </button>
        <button
          onClick={uploadVideo}
          className="text-white/70 bg-white/10 border border-white/10 gap-2 px-8 py-3 rounded-xl font-medium  hover:bg-white/15 hover:text-white"
        >
          Continue
        </button>

        {transcribedText && (
          <div className="bg-gray-800 p-4 rounded-lg shadow-lg mb-4">
            <p className="text-green-400 font-semibold text-sm mb-2">📝 Your Speech:</p>
            <p className="text-white text-xs leading-relaxed mb-3 bg-gray-900 p-2 rounded">{transcribedText}</p>
            {accuracy !== null && (
              <div className="flex items-center justify-between">
                <p className="text-blue-400 text-sm font-semibold">🎯 Accuracy: {accuracy}%</p>
                <div
                  className={`px-2 py-1 rounded text-xs font-bold ${Number.parseFloat(accuracy) >= 80
                    ? "bg-green-500 text-white"
                    : Number.parseFloat(accuracy) >= 60
                      ? "bg-yellow-500 text-black"
                      : "bg-red-500 text-white"
                    }`}
                >
                  {Number.parseFloat(accuracy) >= 80
                    ? "✅ Great!"
                    : Number.parseFloat(accuracy) >= 60
                      ? "⚠️ Good"
                      : "❌ Try Again"}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Debug info for speech recognition */}
        <div className="text-xs text-gray-500 mt-4">
          <p>Speech Recognition: {recognitionRef.current ? "✅ Available" : "❌ Not Available"}</p>
          <p>Listening: {isListening ? "✅ Active" : "❌ Inactive"}</p>
        </div>
      </div>
    </div>
  )
}

const ResponsiveVideoKyc = ({ refetch, step, setStep }) => {
  return (
    <div className="w-full">
      <VideoKyc refetch={refetch} step={step} setStep={setStep} />
    </div>
  )
}

export default ResponsiveVideoKyc
