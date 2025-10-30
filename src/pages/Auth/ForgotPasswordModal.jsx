import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../components/ui/dialog.jsx";
import { Button } from "../../components/ui/button.jsx";
import { Input } from "../../components/ui/input.jsx";
import { Label } from "../../components/ui/label.jsx";
import { Mail, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSendForgotPasswordMutation } from "../../api/authApi";
import { toast } from "react-toastify";
import ForgetPasswordOtpVerification from "../../components/forgetPassword/ForgetPasswordOtpVerification.jsx";

export function ForgotPasswordModal({ isOpen = true, onClose }) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();
  const [sendForgotPassword] = useSendForgotPasswordMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await sendForgotPassword({ email }).unwrap();
      setIsSuccess(true);
      toast.success("OTP sent successfully. Check your email.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to send reset link. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setEmail("");
    setIsSuccess(false);
    navigate("/");
  };

 return (
  <>
    {!isSuccess ? (
      isOpen && (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-6 z-40 ">
          <div className="bg-slate-900/70 border-slate-800 backdrop-blur-xl p-8 shadow-2xl">
            {/* Header */}
            <div className="mb-4">
              <h2 className="text-white text-lg font-semibold">Reset Password</h2>
              <p className="text-slate-400 text-sm">
                Enter your email address and we'll send you a code to reset your password
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5 mt-4">
              <div className="space-y-2">
                <Label htmlFor="reset-email" className="text-slate-200">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <Input
                    id="reset-email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-11 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex gap-3">
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
                  disabled={isSubmitting}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </span>
                  ) : (
                    "Send Code"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )
    ) : (
      <ForgetPasswordOtpVerification email={email} />
    )}
  </>
);

}
