import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/lib/authContext";
import { api } from "@/lib/api";
import {
  ShieldCheck,
  Mail,
  Lock,
  User,
  ArrowRight,
  AlertCircle,
  Loader2,
  KeyRound,
  CheckCircle2,
  RefreshCw,
  ArrowLeft,
  Clock,
} from "lucide-react";

type AuthMode = "signin" | "signup" | "forgot" | "reset_otp";

export function AuthPage() {
  const [mode, setMode] = useState<AuthMode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [otp, setOtp] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Timers for OTP flow (in seconds)
  const [otpExpiryTimer, setOtpExpiryTimer] = useState<number>(300); // 5 minutes
  const [resendCooldownTimer, setResendCooldownTimer] = useState<number>(120); // 2 minutes

  const { login, register, googleLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || "/app";

  // Countdown timer ticker for OTP expiration and resend cooldown
  useEffect(() => {
    if (mode !== "reset_otp") return;

    const interval = setInterval(() => {
      setOtpExpiryTimer((prev) => (prev > 0 ? prev - 1 : 0));
      setResendCooldownTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [mode]);

  const formatTimer = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Submit Sign In or Sign Up
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessNotice(null);
    setIsSubmitting(true);

    try {
      if (mode === "signup") {
        await register(email, password, name);
      } else {
        await login(email, password);
      }
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message || "Authentication failed. Please check your credentials.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 1: Send OTP to email
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    setError(null);
    setSuccessNotice(null);
    setIsSubmitting(true);

    try {
      const res = await api.forgotPassword(email);
      setOtpExpiryTimer(res.expires_in_seconds || 300);
      setResendCooldownTimer(res.resend_cooldown_seconds || 120);
      setOtp("");
      setPassword("");
      setConfirmPassword("");
      setMode("reset_otp");
      setSuccessNotice("6-digit verification code dispatched to your email.");
    } catch (err: any) {
      setError(err.message || "Failed to send reset code. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (resendCooldownTimer > 0) return;

    setError(null);
    setSuccessNotice(null);
    setIsSubmitting(true);

    try {
      const res = await api.forgotPassword(email);
      setOtpExpiryTimer(res.expires_in_seconds || 300);
      setResendCooldownTimer(res.resend_cooldown_seconds || 120);
      setOtp("");
      setSuccessNotice("A new 6-digit code has been sent. Your previous code was invalidated.");
    } catch (err: any) {
      setError(err.message || "Failed to resend verification code.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 2: Confirm OTP and Reset Password
  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessNotice(null);

    if (otp.trim().length !== 6) {
      setError("Please enter the complete 6-digit verification code.");
      return;
    }

    if (password.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please re-enter your new password.");
      return;
    }

    if (otpExpiryTimer <= 0) {
      setError("Verification code has expired. Please click 'Resend Code' to get a new code.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await api.resetPassword({
        email: email.trim(),
        otp: otp.trim(),
        new_password: password,
      });

      setMode("signin");
      setPassword("");
      setConfirmPassword("");
      setOtp("");
      setSuccessNotice(res.message || "Password reset successfully! Please sign in with your new password.");
    } catch (err: any) {
      setError(err.message || "Failed to reset password. Please check your verification code.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="relative min-h-screen flex items-center justify-center bg-black text-white px-4 py-12 overflow-hidden">
      {/* Background Video */}
      <video
        className="pointer-events-none fixed inset-0 h-full w-full object-cover opacity-60 z-0"
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
      >
        <source
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260809_012548_ef22562c-c0ae-4816-ad9d-f8922af4e6a7.mp4"
          type="video/mp4"
        />
      </video>
      <div
        className="pointer-events-none fixed inset-0 z-0"
        aria-hidden="true"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.40) 45%, rgba(0,0,0,0.92) 100%)",
        }}
      />

      <div className="relative z-10 w-full max-w-md space-y-6">
        {/* Logo & Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-2 group">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white font-bold text-black text-sm shadow-[0_0_20px_rgba(255,255,255,0.4)] group-hover:scale-105 transition-transform">
              Fx
            </span>
            <span className="text-lg font-semibold tracking-tight text-white">FinExplain</span>
          </Link>

          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            {mode === "signup"
              ? "Create Your Auditor Account"
              : mode === "forgot"
                ? "Reset Your Password"
                : mode === "reset_otp"
                  ? "Verify 6-Digit Code"
                  : "Sign In to FinExplain"}
          </h1>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            {mode === "signup"
              ? "Access evidence-first loan intelligence, cross-document audits, and conflict detection."
              : mode === "forgot"
                ? "Enter your account email address to receive a secure 6-digit reset code."
                : mode === "reset_otp"
                  ? `Enter the 6-digit code sent to ${email} and choose a new password.`
                  : "Welcome back. Access your loan document workspace and verified audits."}
          </p>
        </div>

        {/* Auth Glass Card */}
        <div className="rounded-3xl border border-white/15 bg-surface/85 p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-5">
          {/* Tab Switcher (Only visible for signin & signup) */}
          {(mode === "signin" || mode === "signup") && (
            <div className="grid grid-cols-2 rounded-xl bg-black/40 p-1 border border-white/10 text-xs font-semibold">
              <button
                type="button"
                onClick={() => {
                  setMode("signin");
                  setError(null);
                  setSuccessNotice(null);
                }}
                className={`rounded-lg py-2 transition-all ${
                  mode === "signin" ? "bg-white text-black shadow font-bold" : "text-white/60 hover:text-white"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode("signup");
                  setError(null);
                  setSuccessNotice(null);
                }}
                className={`rounded-lg py-2 transition-all ${
                  mode === "signup" ? "bg-white text-black shadow font-bold" : "text-white/60 hover:text-white"
                }`}
              >
                Create Account
              </button>
            </div>
          )}

          {/* Success Banner */}
          {successNotice && (
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-300 flex items-start gap-2 animate-in fade-in duration-200">
              <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-emerald-400" />
              <span>{successNotice}</span>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300 flex items-start gap-2 animate-in fade-in duration-200">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {/* MODE 1 & 2: SIGN IN / SIGN UP FORM */}
          {(mode === "signin" || mode === "signup") && (
            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {mode === "signup" && (
                <div className="space-y-1">
                  <label className="block text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Sarah Connor"
                      className="w-full rounded-xl border border-white/10 bg-black/40 pl-10 pr-3.5 py-2.5 text-xs text-white placeholder:text-muted-foreground focus:outline-none focus:border-white/30 transition-colors"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="block text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full rounded-xl border border-white/10 bg-black/40 pl-10 pr-3.5 py-2.5 text-xs text-white placeholder:text-muted-foreground focus:outline-none focus:border-white/30 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="block text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                    Password
                  </label>
                  {mode === "signin" && (
                    <button
                      type="button"
                      onClick={() => {
                        setMode("forgot");
                        setError(null);
                        setSuccessNotice(null);
                      }}
                      className="text-[11px] text-primary-light hover:underline font-medium"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-white/10 bg-black/40 pl-10 pr-3.5 py-2.5 text-xs text-white placeholder:text-muted-foreground focus:outline-none focus:border-white/30 transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-xs font-bold text-black hover:bg-white/90 transition-all shadow-lg hover:shadow-white/20 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin text-black" />
                ) : (
                  <>
                    <span>{mode === "signup" ? "Create Account" : "Sign In with Email"}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* MODE 3: FORGOT PASSWORD (REQUEST OTP) */}
          {mode === "forgot" && (
            <form onSubmit={handleRequestOtp} className="space-y-4 animate-in fade-in duration-200">
              <div className="space-y-1">
                <label className="block text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  Registered Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="email"
                    required
                    autoFocus
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your registered email"
                    className="w-full rounded-xl border border-white/10 bg-black/40 pl-10 pr-3.5 py-2.5 text-xs text-white placeholder:text-muted-foreground focus:outline-none focus:border-white/30 transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-xs font-bold text-black hover:bg-white/90 transition-all shadow-lg disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin text-black" />
                ) : (
                  <>
                    <span>Send Verification Code</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setMode("signin");
                  setError(null);
                  setSuccessNotice(null);
                }}
                className="w-full text-center text-xs text-white/70 hover:text-white flex items-center justify-center gap-1.5 pt-1"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Back to Sign In</span>
              </button>
            </form>
          )}

          {/* MODE 4: VERIFY 6-DIGIT OTP & SET NEW PASSWORD */}
          {mode === "reset_otp" && (
            <form onSubmit={handleResetPasswordSubmit} className="space-y-4 animate-in fade-in duration-200">
              {/* Expiry Badge */}
              <div className="flex items-center justify-between rounded-xl border border-amber-500/30 bg-amber-500/10 px-3.5 py-2 text-xs text-amber-300">
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-amber-400" />
                  <span>
                    {otpExpiryTimer > 0 ? `Code expires in: ${formatTimer(otpExpiryTimer)}` : "Code Expired"}
                  </span>
                </div>
                <span className="text-[10px] font-mono opacity-70">5m window</span>
              </div>

              {/* 6-Digit OTP Box */}
              <div className="space-y-1">
                <label className="block text-[11px] font-medium uppercase tracking-wider text-muted-foreground text-center">
                  Enter 6-Digit Code
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    maxLength={6}
                    pattern="[0-9]{6}"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    autoFocus
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, "").slice(0, 6))}
                    placeholder="••••••"
                    className="w-full text-center font-mono text-2xl font-bold tracking-[0.5em] rounded-xl border border-white/20 bg-black/60 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-white/50 transition-all shadow-inner"
                  />
                </div>
              </div>

              {/* New Password */}
              <div className="space-y-1">
                <label className="block text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full rounded-xl border border-white/10 bg-black/40 pl-10 pr-3.5 py-2.5 text-xs text-white placeholder:text-muted-foreground focus:outline-none focus:border-white/30 transition-colors"
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1">
                <label className="block text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  Confirm New Password
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat new password"
                    className="w-full rounded-xl border border-white/10 bg-black/40 pl-10 pr-3.5 py-2.5 text-xs text-white placeholder:text-muted-foreground focus:outline-none focus:border-white/30 transition-colors"
                  />
                </div>
              </div>

              {/* Submit Reset Button */}
              <button
                type="submit"
                disabled={isSubmitting || otp.length !== 6 || otpExpiryTimer <= 0}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-xs font-bold text-black hover:bg-white/90 transition-all shadow-lg disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin text-black" />
                ) : (
                  <>
                    <span>Confirm New Password</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </>
                )}
              </button>

              {/* Resend Cooldown Action Button */}
              <div className="flex items-center justify-between pt-1 text-xs">
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resendCooldownTimer > 0 || isSubmitting}
                  className={`inline-flex items-center gap-1.5 font-medium transition-colors ${
                    resendCooldownTimer > 0
                      ? "text-muted-foreground cursor-not-allowed opacity-60"
                      : "text-primary-light hover:underline cursor-pointer"
                  }`}
                >
                  <RefreshCw className={`h-3 w-3 ${isSubmitting ? "animate-spin" : ""}`} />
                  <span>
                    {resendCooldownTimer > 0
                      ? `Resend Code in ${formatTimer(resendCooldownTimer)}`
                      : "Resend New Code"}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMode("signin");
                    setError(null);
                    setSuccessNotice(null);
                  }}
                  className="text-white/60 hover:text-white flex items-center gap-1"
                >
                  <ArrowLeft className="h-3 w-3" />
                  <span>Cancel</span>
                </button>
              </div>
            </form>
          )}

          {/* Legal Terms & Privacy Disclaimer */}
          {(mode === "signin" || mode === "signup") && (
            <p className="text-[11px] text-center text-muted-foreground pt-3">
              By continuing, you agree to our{" "}
              <Link to="/terms" className="text-white hover:underline underline-offset-2">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link to="/privacy" className="text-white hover:underline underline-offset-2">
                Privacy Policy
              </Link>
              .
            </p>
          )}
        </div>

        {/* Security & Evidence Note */}
        <div className="text-center text-[11px] text-muted-foreground flex items-center justify-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
          <span>Strict privacy • Documents isolated per organization session</span>
        </div>
      </div>
    </main>
  );
}
