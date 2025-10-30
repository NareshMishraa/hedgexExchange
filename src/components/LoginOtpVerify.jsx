import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useVerifyLoginOtpMutation } from "../api/authApi";
import { toast } from "react-toastify";
import { STORAGES } from "../components/Store";
import localStore from "../components/localStore";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../components/ui/dialog.jsx";
import { Button } from "../components/ui/button.jsx";
import { Input } from "../components/ui/input.jsx";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

export function LoginOtpVerify({ isOpen, onClose, email }) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();
  const [verifyLoginOtp, { isLoading }] = useVerifyLoginOtpMutation();

  // === Handle OTP Submit ===
  const submitOtp = async (otpValue) => {
    if (otpValue.length < 6) return;

    try {
      const response = await verifyLoginOtp({ email, otp: otpValue }).unwrap();

      if (response?.token) {
        localStore.setItem(STORAGES.TOKEN, response.token);
         window.dispatchEvent(new Event("authChanged"));
      }
      localStore.setItem(STORAGES.EMAIL, email);

      setIsSuccess(true);
      toast.success("OTP verified successfully!");

      // Small delay to show success
      setTimeout(() => navigate("/migrationDashboard"), 1200);
    } catch (err) {
      toast.error(err?.data?.message || "OTP verification failed. Please try again.");
    }
  };

  // === Input handlers ===
  const handleChange = (e, index) => {
    const value = e.target.value;
    if (/^\d?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 5) {
        document.getElementById(`otp-input-${index + 1}`)?.focus();
      }

      const joined = newOtp.join("");
      if (joined.length === 6 && newOtp.every((d) => d !== "")) {
        submitOtp(joined);
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-input-${index - 1}`)?.focus();
    }
  };

  const handlePaste = (e, index) => {
    e.preventDefault();
    const text = e.clipboardData?.getData("text") ?? "";
    const digits = text.replace(/\D/g, "").slice(0, 6);
    if (!digits) return;

    const newOtp = [...otp];
    for (let i = 0; i < digits.length && index + i < 6; i++) {
      newOtp[index + i] = digits[i];
    }
    setOtp(newOtp);

    const joined = newOtp.join("");
    if (joined.length === 6 && newOtp.every((d) => d !== "")) {
      submitOtp(joined);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpValue = otp.join("");
    if (otpValue.length < 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }
    await submitOtp(otpValue);
  };

  const handleClose = () => {
    setOtp(["", "", "", "", "", ""]);
    setIsSuccess(false);
    onClose();
  };

  // === JSX ===
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-slate-900 border-slate-800 text-white max-w-md">
        {!isSuccess ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-white text-center">Verify Login OTP</DialogTitle>
              <DialogDescription className="text-slate-400 text-center">
                Enter the 6-digit code sent to your email: <br />
                <span className="text-blue-400 font-medium">{email}</span>
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6 mt-4">
              <div className="flex justify-center gap-3">
                {otp.map((digit, index) => (
                  <Input
                    key={index}
                    id={`otp-input-${index}`}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onPaste={(e) => handlePaste(e, index)}
                    autoComplete="off"
                    inputMode="numeric"
                    disabled={isLoading}
                    className="w-10 h-10 text-center text-lg font-bold bg-slate-800/50 border-slate-700 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                ))}
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  type="button"
                  onClick={handleClose}
                  variant="outline"
                  className="flex-1 bg-slate-800 border-slate-700 text-white hover:bg-slate-700"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Verifying...
                    </span>
                  ) : (
                    "Verify OTP"
                  )}
                </Button>
              </div>
            </form>
          </>
        ) : (
          <div className="py-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-green-500" />
              </div>
            </div>
            <h3 className="text-white mb-2">OTP Verified</h3>
            <p className="text-slate-400 mb-6">
              You’ve successfully verified your email.<br />
            </p>
            <Button
              onClick={handleClose}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0"
            >
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
