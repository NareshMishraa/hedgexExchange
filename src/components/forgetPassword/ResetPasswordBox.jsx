import React, { useState } from "react";
import { Shield, RefreshCw, Eye, EyeOff, Lock, ArrowRight, X } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ResetPasswordBox = ({ email, isOpen, onClose, onSubmit, onAllClose, otpVerify, submitting: submittingProp }) => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setSubmitting(true);
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!password.trim() || !passwordRegex.test(password)) {
      toast.error(
        "Password must be at least 8 characters, include uppercase, lowercase, number and special character(@$!%*?&)"
      );
      setSubmitting(false);
      return;
    }

    if (password !== confirm) {
      toast.error("Passwords do not match");
      setSubmitting(false);
      return;
    }

    try {
      // Call your reset password API here
      console.log("Resetting password:", password);

      setPassword("");
      setConfirm("");
      if (onAllClose) onAllClose();
      onSubmit?.();
    } catch (error) {
      console.error("Error resetting password:", error);
      toast.error("Failed to reset password. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // if (!isOpen) return null;

  return (
    <div className="flex items-center justify-center bg-gradient-to-br from-gray-900 to-black h-[666px] p-4">
      <div className="relative bg-gray-800 p-8 rounded-2xl shadow-lg w-full max-w-md flex flex-col gap-6">
        {/* Close button */}
        <button
          type="button"
          onClick={() => {
            // onClose(false);
            // otpVerify(false);
            navigate(-1);
          }}
          className="absolute top-3 right-3 text-gray-400 hover:text-white transition"
        >
          <X size={24} />
        </button>

        {/* Header */}
        <div className="text-center">
       
          <h2 className="text-2xl font-bold text-white mb-2">Create New Password</h2>
          <p className="text-gray-400 text-center">
            Choose a strong password to secure your account
          </p>
        </div>

        {/* New Password */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">New Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full pl-12 pr-12 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPass((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showPass ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-1">Minimum 8 characters.</p>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type={showConfirm ? "text" : "password"}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Re-enter new password"
                className="w-full pl-12 pr-12 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowConfirm((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showConfirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Reset Button */}
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full bg-orange-500 hover:bg-orange-400 text-black font-semibold p-3 rounded-md mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <div className="flex items-center justify-center gap-3">
              <RefreshCw className="h-5 w-5 animate-spin" />
              <span>Resetting...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-3">
              <span>Reset Password</span>
              <ArrowRight className="h-5 w-5" />
            </div>
          )}
        </button>
      </div>
    </div>
  );
};

export default ResetPasswordBox;
