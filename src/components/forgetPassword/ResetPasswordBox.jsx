import React, { useState } from "react";
import { RefreshCw, Eye, EyeOff, Lock, ArrowRight, X } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useResetPasswordMutation } from "../../api/authApi";
import { Card } from "../../components/ui/card.jsx";
import { Input } from "../../components/ui/input.jsx";

const ResetPasswordBox = ({ email }) => {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // ✅ RTK Query mutation hook
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const handleSubmit = async () => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!password.trim() || !passwordRegex.test(password)) {
      toast.error(
        "Password must be at least 8 characters, include uppercase, lowercase, number and special character."
      );
      return;
    }

    if (password !== confirm) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      // ✅ API call
      const res = await resetPassword({ email, password, confirmPassword: confirm }).unwrap();

      toast.success(res?.message || "Password updated successfully");

      // ✅ Clear fields and redirect
      setPassword("");
      setConfirm("");
      setTimeout(() => navigate("/login"), 1500);

    } catch (error) {
      console.error("Reset password failed:", error);
      toast.error(error?.data?.message || "Failed to reset password. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-6 z-40 ">
      <div className="w-full max-w-md">
        <Card className="relative bg-slate-900/70 border-slate-800 backdrop-blur-xl p-8 shadow-2xl">
          

          {/* Header */}
          <div className="flex jusify-between">
          <div className="text-center">
            <h2 className="text-white mb-4">Create New Password</h2>
            <p className="text-slate-400 text-center">
              Choose a strong password to secure your account
            </p>
          </div>
          {/* Close button */}
          <div>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="absolute top-3 right-3 text-slate-400 hover:text-white transition-colors"
            aria-label="Close"
          >
            <X size={24} />
          </button>
          </div>
          </div>

          {/* New Password */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white m-4">New Password</label>
              <div className="relative">
                {/* Left Icon */}
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />

                {/* Input */}
                <Input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="pl-11 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500"
                />

                {/* Right Icon Button */}
                <button
                  type="button"
                  onClick={() => setShowPass((s) => !s)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white hover:text-white transform transition-transform transition-colors hover:scale-110"
                  aria-label={showPass ? "Hide password" : "Show password"}
                >
                  {showPass ? <EyeOff className="h-5 w-5 text-slate-500" /> : <Eye className="h-5 w-5 text-slate-500" />}
                </button>
              </div>
              <p className="text-xs text-white mt-1">Minimum 8 characters.</p>

            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Confirm Password
              </label>
              <div className="relative">
                {/* Left Icon */}
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <Input
                  type={showConfirm ? "text" : "password"}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Re-enter new password"
                  className="pl-11 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((s) => !s)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white hover:text-white transform transition-transform transition-colors hover:scale-110"
                  aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"}
                >
                  {showConfirm ? <EyeOff className="h-5 w-5 text-slate-500" /> : <Eye className="h-5 w-5 text-slate-500" />}
                </button>
              </div>
            </div>
          </div>

          {/* Reset Button */}
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:bg-gray-600 text-white font-semibold p-3 rounded-md mt-2 transition transform hover:scale-105"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-3">
                <RefreshCw className="h-5 w-5 animate-spin" />
                <span>Resetting...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center h-10 gap-3">
                <span>Reset Password</span>
                <ArrowRight className="h-5 w-5" />
              </div>
            )}
          </button>
        </Card>
      </div>
    </div>
  );
};

export default ResetPasswordBox;
