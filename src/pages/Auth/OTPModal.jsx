import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog.jsx";
import { Button } from "./ui/button.jsx";
import { Input } from "./ui/input.jsx";
import { Shield, CheckCircle2 } from "lucide-react";

export function OTPModal({ isOpen, onVerify, onResend, email }) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (isOpen && countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isOpen, countdown]);

  useEffect(() => {
    if (isOpen && inputRefs.current[0]) {
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    }
  }, [isOpen]);

  const handleChange = (index, value) => {
    if (value.length > 1) value = value[0];
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    pastedData.split("").forEach((char, index) => {
      if (index < 6) newOtp[index] = char;
    });
    setOtp(newOtp);
    
    const lastIndex = Math.min(pastedData.length, 5);
    inputRefs.current[lastIndex]?.focus();
  };

  const handleVerify = async () => {
    const otpString = otp.join("");
    if (otpString.length !== 6) return;

    setIsVerifying(true);
    setTimeout(() => {
      onVerify(otpString);
      setIsVerifying(false);
    }, 1500);
  };

  const handleResend = () => {
    setCountdown(60);
    setOtp(["", "", "", "", "", ""]);
    onResend();
    inputRefs.current[0]?.focus();
  };

  const isComplete = otp.every((digit) => digit !== "");

  return (
    <Dialog open={isOpen} modal>
      <DialogContent 
        className="bg-slate-900 border-slate-800 text-white max-w-md"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
          </div>
          <DialogTitle className="text-center text-white">Verify Your Identity</DialogTitle>
          <DialogDescription className="text-center text-slate-400">
            We've sent a 6-digit verification code to<br />
            <span className="text-blue-400">{email}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          <div className="flex justify-center gap-2">
            {otp.map((digit, index) => (
              <Input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className="w-12 h-14 text-center bg-slate-800/50 border-slate-700 text-white focus:border-blue-500 transition-all"
              />
            ))}
          </div>

          <div className="text-center">
            {countdown > 0 ? (
              <p className="text-slate-400">
                Resend code in <span className="text-blue-400">{countdown}s</span>
              </p>
            ) : (
              <button
                onClick={handleResend}
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                Resend verification code
              </button>
            )}
          </div>

          <Button
            onClick={handleVerify}
            disabled={!isComplete || isVerifying}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isVerifying ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Verifying...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                Verify Code
              </span>
            )}
          </Button>
        </div>

        <div className="mt-4 p-4 bg-slate-800/30 rounded-lg border border-slate-700">
          <p className="text-slate-400 text-center">
            💡 Didn't receive the code? Check your spam folder
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

