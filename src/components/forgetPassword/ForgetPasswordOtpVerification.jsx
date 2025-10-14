import { useState, useEffect } from "react";
import { Shield, RefreshCw, ArrowRight, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ResetPasswordBox from "./ResetPasswordBox";

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

  // Handle OTP verification
  const handleOtpVerification = async () => {
    const otpValue = otp.join("");
    if (otpValue.length < 6) return;

    try {
      // Mock API call
      const response = { message: "Verified" };
      if (response?.message) {
        setShowReset(true);
        setOtp(["", "", "", "", "", ""]);
      }
    } catch (err) {
      setOtp(["", "", "", "", "", ""]);
      console.error("Invalid OTP", err);
    }
  };

  const handleOtpInput = (index, value) => {
    if (/^\d?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < 5) document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("Text").trim();
    if (/^\d{6}$/.test(pasteData)) setOtp(pasteData.split(""));
  };

//   if (!isOpen) return null;

  return (
   <>
   {showReset && (
       <div className="flex items-center justify-center bg-gradient-to-br from-gray-900 to-black h-[666px] p-4">
      <div className="relative bg-gray-800 p-8 rounded-2xl shadow-lg w-full max-w-md flex flex-col gap-6">
        {/* Close button */}
        <button
          type="button"
          onClick={() => navigate(-1)} 
          className="absolute top-3 right-3 text-gray-400 hover:text-white transition"
        >
          <X size={24} />
        </button>

        {/* Header */}
        <div className="text-center">
         
          <h2 className="text-2xl font-bold text-white mb-2">Verify Your Email</h2>
          <p className="text-gray-400 text-center">
            Enter the 6-digit code sent to <span className="font-semibold">{email}</span>
          </p>
        </div>

        {/* OTP Inputs */}
        <div className="flex justify-center gap-3 mb-4">
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOtpInput(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={handlePaste}
              className="w-8 h-8 sm:w-12 sm:h-12 bg-gray-700 border border-gray-600 rounded-xl text-center text-xl font-bold text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 transition-all focus:bg-gray-600"
            />
          ))}
        </div>

        {/* Verify button */}
        <button
          onClick={handleOtpVerification}
          disabled={isLoading}
          className="w-full bg-orange-500 hover:bg-orange-400 text-black font-semibold p-3 rounded-md mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-3">
              <RefreshCw className="h-5 w-5 animate-spin" />
              <span>Verifying...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-3">
              <span>Verify & Continue</span>
              <ArrowRight className="h-5 w-5" />
            </div>
          )}
        </button>

        {/* Resend OTP */}
        <div className="text-center mt-4">
          <button
            onClick={resendOtp}
            disabled={resendLoading}
            className="text-sm text-gray-400 hover:text-orange-400 transition"
          >
            {resendLoading ? "Resending..." : "Didn't receive the code? Resend"}
          </button>
        </div>
      </div>
    </div>
   )
}
{!showReset && (
     <ResetPasswordBox/> 
)}

    </>
  );
};

export default ForgetPasswordOtpVerification;
