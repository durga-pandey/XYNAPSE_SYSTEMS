import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../../services/authService";
import SEO from "../../components/SEO";

const steps = [
  {
    label: "Request OTP",
    description: "Enter the email tied to your AuthFlow account and we will send a verification code.",
  },
  {
    label: "Verify code",
    description: "Paste the 6-digit OTP from your inbox to unlock the password reset window.",
  },
  {
    label: "Reset password",
    description: "Choose a new password that is strong and unique to keep your account secure.",
  },
];

const inputClasses =
  "w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-slate-900 placeholder-slate-400 shadow-sm transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:border-sky-400 dark:focus:ring-sky-500/40";

function ForgotPassword() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [otpId, setOtpId] = useState(null);
  const [otpCode, setOtpCode] = useState("");
  const [resetToken, setResetToken] = useState(null);
  const [passwords, setPasswords] = useState({ newPassword: "", confirmPassword: "" });

  const statusTone =
    status?.type === "error"
      ? "border-red-200/60 bg-red-100/60 text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200"
      : "border-emerald-200/60 bg-emerald-100/60 text-emerald-700 dark:border-emerald-400/30 dark:bg-emerald-500/10 dark:text-emerald-200";

  const handleRequestOtp = async (event) => {
    event.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      const response = await authService.sendForgotPasswordOtp({ email: email.trim() });
      setOtpId(response.otpId);
      setStatus({ type: "success", message: response.message || "OTP sent successfully" });
      setActiveStep(1);
    } catch (error) {
      const message = error?.response?.data?.message || "Unable to send OTP. Please retry.";
      setStatus({ type: "error", message });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (event) => {
    event.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      const response = await authService.verifyForgotPasswordOtp({ otpId, otp: otpCode.trim() });
      setResetToken(response.resetToken);
      setStatus({ type: "success", message: response.message || "OTP verified. You can change your password now." });
      setActiveStep(2);
    } catch (error) {
      const message = error?.response?.data?.message || "Incorrect or expired OTP.";
      setStatus({ type: "error", message });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (event) => {
    event.preventDefault();
    setLoading(true);
    setStatus(null);

    if (passwords.newPassword !== passwords.confirmPassword) {
      setStatus({ type: "error", message: "Passwords do not match." });
      setLoading(false);
      return;
    }

    try {
      const response = await authService.resetPassword({
        resetToken,
        newPassword: passwords.newPassword,
      });
      setStatus({ type: "success", message: response.message || "Password updated. Redirecting to login." });
      setTimeout(() => navigate("/login"), 1500);
    } catch (error) {
      const message = error?.response?.data?.message || "Could not reset password. Try again.";
      setStatus({ type: "error", message });
    } finally {
      setLoading(false);
    }
  };

  const renderForm = () => {
    switch (activeStep) {
      case 0:
        return (
          <form className="space-y-5" onSubmit={handleRequestOtp}>
            <div className="space-y-2">
              <label htmlFor="reset-email" className="text-sm font-medium text-slate-700 dark:text-slate-200">
                Account email
              </label>
              <input
                id="reset-email"
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className={inputClasses}
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-500 px-4 py-3 text-base font-semibold text-white shadow-lg shadow-sky-500/30 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </form>
        );
      case 1:
        return (
          <form className="space-y-5" onSubmit={handleVerifyOtp}>
            <div className="space-y-2">
              <label htmlFor="otp-code" className="text-sm font-medium text-slate-700 dark:text-slate-200">
                Enter 6-digit code
              </label>
              <input
                id="otp-code"
                type="text"
                inputMode="numeric"
                maxLength={6}
                required
                placeholder="123456"
                value={otpCode}
                onChange={(event) => setOtpCode(event.target.value)}
                className={inputClasses}
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-500 px-4 py-3 text-base font-semibold text-white shadow-lg shadow-sky-500/30 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>
        );
      case 2:
        return (
          <form className="space-y-5" onSubmit={handleResetPassword}>
            <div className="space-y-2">
              <label htmlFor="new-password" className="text-sm font-medium text-slate-700 dark:text-slate-200">
                New password
              </label>
              <input
                id="new-password"
                type="password"
                required
                placeholder="Use 8+ characters"
                value={passwords.newPassword}
                onChange={(event) =>
                  setPasswords((prev) => ({ ...prev, newPassword: event.target.value }))
                }
                className={inputClasses}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="confirm-password" className="text-sm font-medium text-slate-700 dark:text-slate-200">
                Confirm password
              </label>
              <input
                id="confirm-password"
                type="password"
                required
                placeholder="Repeat your password"
                value={passwords.confirmPassword}
                onChange={(event) =>
                  setPasswords((prev) => ({ ...prev, confirmPassword: event.target.value }))
                }
                className={inputClasses}
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-500 px-4 py-3 text-base font-semibold text-white shadow-lg shadow-sky-500/30 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={loading}
            >
              {loading ? "Updating..." : "Reset password"}
            </button>
          </form>
        );
      default:
        return null;
    }
  };

  return (
    <>
    <SEO
        title="Forgot Password | Xynapse Systems"
        description="Reset your Xynapse Systems account password easily and securely to regain access to your courses and profile."
        canonical="https://xynapsesystems.com/forgot-password"
        image="https://xynapsesystems.com/images/Logo.png"
      />
    <div className="relative z-10 mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-3xl flex-col items-center justify-center px-4 py-16">
      <div className="w-full rounded-3xl border border-slate-200/50 bg-white/80 p-8 shadow-2xl shadow-slate-900/5 backdrop-blur-xl dark:border-slate-700/50 dark:bg-slate-900/60">
        <header className="space-y-2 text-center">
          <p className="text-2xl font-semibold text-slate-900 dark:text-white">Forgot password</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Follow the guided steps below to reset access to your AuthFlow account.
          </p>
        </header>

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {steps.map((step, index) => (
            <div
              key={step.label}
              className={`rounded-2xl border px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide transition ${
                index === activeStep
                  ? "border-sky-400/60 bg-sky-50 text-sky-600 dark:border-sky-500/40 dark:bg-sky-500/10 dark:text-sky-200"
                  : index < activeStep
                  ? "border-emerald-200/60 bg-emerald-50 text-emerald-600 dark:border-emerald-400/40 dark:bg-emerald-500/10 dark:text-emerald-200"
                  : "border-slate-200/70 bg-white/60 text-slate-400 dark:border-slate-700/50 dark:bg-slate-900/50"
              }`}
            >
              <span>{step.label}</span>
            </div>
          ))}
        </div>

        <p className="mt-4 text-center text-sm text-slate-500 dark:text-slate-400">{steps[activeStep].description}</p>

        {status && (
          <div className={`mt-6 rounded-2xl border px-4 py-3 text-sm font-medium ${statusTone}`}>
            {status.message}
          </div>
        )}

        <div className="mt-6">{renderForm()}</div>

        <p className="mt-8 text-center text-xs text-slate-500 dark:text-slate-400">
          Remember your password?{" "}
          <Link className="font-semibold text-sky-500 hover:text-sky-400" to="/login">
            Go back to login
          </Link>
        </p>
      </div>
    </div>
    </>
  );
}

export default ForgotPassword;
