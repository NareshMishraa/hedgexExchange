// src/pages/Auth/Login.jsx
import { useState } from "react";
import { Card } from "../../components/ui/card.jsx";
import { Input } from "../../components/ui/input.jsx";
import { Button } from "../../components/ui/button.jsx";
import { Label } from "../../components/ui/label.jsx";
import { Shield, Lock, Mail,Eye,EyeOff, ArrowRight, CheckCircle2, TrendingUp, Zap } from "lucide-react";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { toast } from "react-toastify";
import { LoginOtpVerify } from "../../components/LoginOtpVerify";


export default function Login() {
  const [loginOtp, setLoginOtp] = useState(false); // Initially set to false

  const { login, isLoggingIn } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
   const [showPass, setShowPass] = useState(false);

  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await login(email, password);
      setLoginOtp(true);
      toast.success("OTP sent to your email!");
    } catch (err) {
      console.error(err);
      toast.error(err?.data?.message || "Invalid credentials");
    }
    // setEmail("");
    setPassword("");
  };


  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
        {/* Header */}

        {/* Main Content */}
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-8 lg:p-12">
          <div className="w-full max-w-7xl">

            {/* Main Container - Responsive two-column grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 items-stretch gap-8 w-full mx-auto">

              {/* Left Side - Login Form */}
              <div className="w-full">
                <Card className="bg-slate-900/70 border-slate-800 backdrop-blur-xl p-8 shadow-2xl h-full">
                  <div className="mb-8 text-center">
                    <h2 className="text-white mb-2">Welcome Back</h2>
                    <p className="text-slate-400">Sign in to access your migration dashboard</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-slate-200">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="you@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="pl-11 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-slate-200">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                        <Input
                          id="password"
                            type={showPass ? "text" : "password"}
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
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
                    </div>

                    <div className="flex items-center justify-end">
                      <button
                        type="button"
                        onClick={() => navigate("/forgot-password")}
                        className="text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        Forgot password?
                      </button>
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoggingIn}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0"
                    >
                      {isLoggingIn ? (
                        <span className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Signing in...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          Sign In
                          <ArrowRight className="w-4 h-4" />
                        </span>
                      )}
                    </Button>
                  </form>

                  <div className="mt-6 pt-6 border-t border-slate-800">
                    <p className="text-slate-400 text-center">
                      🔒 Protected by enterprise-grade security
                    </p>
                  </div>
                </Card>
              </div>

              {/* Right Side - Migration Info */}
              <div className="w-full space-y-6 lg:pl-8 h-full">
                <div className="mb-8">
                  <h2 className="text-white mb-3">
                    Migrate HedgeX V1 Centralized to V2 Decentralized
                  </h2>
                  <p className="text-slate-400">
                    Seamlessly transition your tokens to our new decentralized infrastructure with enhanced security and full control.
                  </p>
                </div>

                {/* Feature Cards */}
                <div className="space-y-4">
                  <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-xl p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Shield className="w-6 h-6 text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white mb-2">Secure Migration</h3>
                        <p className="text-slate-400">
                          Your tokens are protected with enterprise-grade security and multi-layer verification.
                        </p>
                      </div>
                    </div>
                  </Card>

                  <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-xl p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                        <TrendingUp className="w-6 h-6 text-purple-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white mb-2">Smart Vesting</h3>
                        <p className="text-slate-400">
                          Automated 4% monthly token release over 25 periods with transparent tracking.
                        </p>
                      </div>
                    </div>
                  </Card>

                  <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-xl p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Zap className="w-6 h-6 text-green-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white mb-2">Instant Claims</h3>
                        <p className="text-slate-400">
                          Connect your wallet and claim your vested tokens instantly as they become available.
                        </p>
                      </div>
                    </div>
                  </Card>

                  <Card className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border-blue-500/30 p-6">
                    <div className="flex items-start gap-4">
                      <CheckCircle2 className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
                      <div className="flex-1">
                        <h3 className="text-white mb-2">One-Time KYC Verification</h3>
                        <p className="text-slate-300">
                          Complete a simple video KYC verification once to unlock full access to your vesting dashboard.
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {loginOtp && <LoginOtpVerify
        isOpen={loginOtp}
        onClose={setLoginOtp}
        email={email} />}

      {/* {showForgotPassword && <ForgotPasswordModal
        isOpen={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
      />} */}
    </>
  );
}


