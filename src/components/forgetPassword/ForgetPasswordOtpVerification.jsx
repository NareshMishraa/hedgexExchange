import { useState } from "react";
import { RefreshCw, ArrowLeft, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ResetPasswordBox from "./ResetPasswordBox";
import { useVerifyOtpPasswordMutation } from "../../api/authApi";
import { toast } from "react-toastify";
import { Card } from "../../components/ui/card.jsx";
import { Input } from "../../components/ui/input.jsx";
import { Button } from "../../components/ui/button.jsx";
import { Label } from "../../components/ui/label.jsx";

const ForgetPasswordOtpVerification = ({
  isOpen,
  onClose,
  email,
  resendOtp,
  isLoading,
  resendLoading,
}) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [showReset, setShowReset] = useState(false);
  const navigate = useNavigate();

  // ✅ Initialize RTK Query mutation hook
  const [verifyOtpPassword, { isLoading: verifyLoading }] = useVerifyOtpPasswordMutation();

  // ✅ Handle OTP verification

const submitOtp = async () => {
  const otpValue = otp.join("");
  if (otpValue.length < 6) {
    toast.error("Please enter a valid 6-digit OTP");
    return;
  }

  try {
    // ✅ Call backend via RTK Query
    const response = await verifyOtpPassword({ email, otp: otpValue }).unwrap();

    // ✅ If backend responds with success
    if (response?.message) {
      toast.success(response.message || "OTP verified successfully");
      setShowReset(true); // show password reset form
      setOtp(["", "", "", "", "", ""]); // clear OTP fields
    }
  } catch (err) {
    console.error("Invalid OTP", err);

    // ✅ Safely extract backend error message
    const errorMessage =
      err?.data?.message || "Invalid or expired OTP. Please try again.";

    toast.error(errorMessage);

    setOtp(["", "", "", "", "", ""]);
  }
};


  const handleOtpInput = (index, value) => {
    if (/^\d?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < 5) document.getElementById(`otp-${index + 1}`)?.focus();

      // Auto-submit when all digits are filled
      const joined = newOtp.join("");
      if (joined.length === 6 && newOtp.every((d) => d !== "")) {
        submitOtp();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handlePaste = (e, index) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text") ?? "";
    const digits = text.replace(/\D/g, "").slice(0, 6);
    if (!digits) return;
    const newOtp = [...otp];
    for (let i = 0; i < digits.length && index + i < 6; i += 1) {
      newOtp[index + i] = digits[i];
    }
    setOtp(newOtp);
    if (newOtp.join("").length === 6 && newOtp.every((d) => d !== "")) {
      submitOtp();
    }
  };


  return (
    <>
      {!showReset && (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-6 z-40 ">
          <div className="w-full max-w-md">
            <Card className="bg-slate-900/70 border-slate-800 backdrop-blur-xl p-8 shadow-2xl">
              <div className="mb-3 text-center">
                <h2 className="text-white mb-2">Verify Reset OTP</h2>
                <p className="text-slate-400">Enter the 6-digit code sent to <span className="text-blue-400">{email}</span></p>
              </div>

              <div className="flex justify-center gap-2 mb-3">
                {otp.map((digit, index) => (
                  <Input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpInput(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onPaste={(e) => handlePaste(e, index)}
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    disabled={verifyLoading}
                    className="w-10 h-10 text-center text-lg font-bold bg-slate-800/50 border-slate-700 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                ))}
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  onClick={() => navigate(-1)}
                  variant="outline"
                  className="flex-1 bg-slate-800 border-slate-700 text-white hover:bg-slate-700"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>

                <Button
                  type="button"
                  onClick={submitOtp}
                  disabled={verifyLoading}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0"
                >
                  {verifyLoading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Verifying...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Verify OTP
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  )}
                </Button>
              </div>

              <div className="text-center mt-3">
                <button
                  onClick={resendOtp}
                  disabled={resendLoading}
                  className="text-sm text-slate-400 hover:text-slate-200"
                >
                  {resendLoading ? "Resending..." : "Didn't receive the code? Resend"}
                </button>
              </div>
            </Card>
          </div>
        </div>
      )}

      {showReset && <ResetPasswordBox email={email} />}
    </>
  );
};

export default ForgetPasswordOtpVerification;
