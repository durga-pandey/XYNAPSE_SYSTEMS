import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../../services/authService";
import { Eye, EyeOff } from "lucide-react";
import SEO from "../../components/SEO";

const initialState = {
  fullName: "",
  email: "",
  mobile: "",
  bio: "",
  password: "",
  confirmPassword: "",
  heardFrom: "",
};

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [verification, setVerification] = useState(null);
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const getPasswordStrength = (password) => {
    let score = 0;

    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    return Math.min(score, 4);
  };

  const passwordStrength = useMemo(
    () => getPasswordStrength(formData.password),
    [formData.password]
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus(null);

    if (!formData.email && !formData.mobile) {
      setStatus({
        type: "error",
        message: "Please provide at least an email or mobile number.",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setStatus({ type: "error", message: "Passwords do not match." });
      return;
    }

    setLoading(true);

    try {
      const response = await authService.register({
        name: formData.fullName,
        email: formData.email,
        mobile: formData.mobile || undefined,
        bio: formData.bio || undefined,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        heardFrom: formData.heardFrom || undefined,
      });
      setVerification({ otpId: response?.otpId, userId: response?.userId });
      setStatus({
        type: "success",
        message:
          "Account created! Enter the OTP sent to your email to activate your account.",
      });
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "We couldn't create your account. Please try again.";
      setStatus({ type: "error", message });
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (event) => {
    event.preventDefault();
    if (!verification?.otpId) {
      setStatus({
        type: "error",
        message: "Missing OTP session. Please try signing up again.",
      });
      return;
    }

    setOtpLoading(true);
    setStatus(null);

    try {
      await authService.activateUser({ otpId: verification.otpId, otp });
      setStatus({
        type: "success",
        message: "Email verified! Redirecting you to login.",
      });
      setTimeout(() => navigate("/login"), 1500);
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Verification failed. Please double-check the OTP.";
      setStatus({ type: "error", message });
    } finally {
      setOtpLoading(false);
    }
  };

  const statusClasses =
    status?.type === "error"
      ? "border-red-200/60 bg-red-100/70 text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200"
      : "border-emerald-200/60 bg-emerald-100/70 text-emerald-800 dark:border-emerald-400/20 dark:bg-emerald-500/10 dark:text-emerald-200";

  return (
    <>
    <SEO
        title="Signup | Xynapse Systems"
        description="Join Xynapse Systems to access industry-focused software training, IT solutions, and career-oriented programs."
        canonical="https://xynapsesystems.com/signup"
        image="https://xynapsesystems.com/images/Logo.png"
      />
    <div className="relative z-10 mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-3xl flex-col items-center justify-center px-4 py-16">
      <div className="w-full rounded-3xl border border-slate-200/50 bg-white/80 p-8 shadow-2xl shadow-slate-900/5 backdrop-blur-xl dark:border-slate-700/50 dark:bg-slate-900/60">
        <header className="space-y-2 text-center">
          <p className="text-2xl font-semibold text-slate-900 dark:text-white">
            Create your account
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            We'll get you up and running in seconds.
          </p>
        </header>

        {status && (
          <div
            className={`mt-6 rounded-2xl border px-4 py-3 text-sm font-medium ${statusClasses}`}
          >
            {status.message}
          </div>
        )}

        {!verification ? (
          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label
                htmlFor="fullName"
                className="text-sm_font-medium text-slate-700 dark:text-slate-200"
              >
                Full name
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                placeholder="Alex Mercer"
                autoComplete="name"
                required
                value={formData.fullName}
                onChange={handleChange}
                className="w-full rounded-2xl border outline-none border-slate-200 bg-white/80 px-4 py-3 text-slate-900 placeholder-slate-400 shadow-sm transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:border-sky-400 dark:focus:ring-sky-500/40"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-slate-700 dark:text-slate-200"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded-2xl border outline-none border-slate-200 bg-white/80 px-4 py-3 text-slate-900 placeholder-slate-400 shadow-sm transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:border-sky-400 dark:focus:ring-sky-500/40"
              />
              <p className="text-xs text-slate-500 dark:text-slate-400">
                You can use your mobile number instead if you prefer.
              </p>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="mobile"
                className="text-sm font-medium text-slate-700 dark:text-slate-200"
              >
                Mobile number
              </label>
              <input
                id="mobile"
                name="mobile"
                type="tel"
                placeholder="9876543210"
                value={formData.mobile}
                onChange={handleChange}
                className="w-full rounded-2xl outline-none border border-slate-200 bg-white/80 px-4 py-3 text-slate-900 placeholder-slate-400 shadow-sm transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:border-sky-400 dark:focus:ring-sky-500/40"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="bio"
                className="text-sm font-medium text-slate-700 dark:text-slate-200"
              >
                Short bio (optional)
              </label>
              <textarea
                id="bio"
                name="bio"
                rows={3}
                placeholder="Tell us a little about yourself"
                value={formData.bio}
                onChange={handleChange}
                className="w-full rounded-2xl outline-none border border-slate-200 bg-white/80 px-4 py-3 text-slate-900 placeholder-slate-400 shadow-sm transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:border-sky-400 dark:focus:ring-sky-500/40"
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-slate-700 dark:text-slate-200"
                >
                  Password
                </label>

                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 pr-12 text-slate-900 shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-100"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                {/* Strength meter */}
                <div className="mt-2 space-y-1">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className={`h-1.5 w-full rounded-full ${
                          passwordStrength >= level
                            ? "bg-green-500"
                            : "bg-slate-200 dark:bg-slate-700"
                        }`}
                      />
                    ))}
                  </div>

                  <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
                    {
                      ["Enter a password", "Weak", "Okay", "Good", "Strong"][
                        passwordStrength
                      ]
                    }
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium text-slate-700 dark:text-slate-200"
                >
                  Confirm password
                </label>

                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Re-enter your password"
                    autoComplete="new-password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 pr-12 text-slate-900 shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-100"
                  />

                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((p) => !p)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="heardFrom"
                className="text-sm font-medium text-slate-700 dark:text-slate-200"
              >
                How did you hear about us?
              </label>
              <input
                id="heardFrom"
                name="heardFrom"
                type="text"
                placeholder="Friends, social media, etc."
                value={formData.heardFrom}
                onChange={handleChange}
                className="w-full outline-none rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-slate-900_placeholder-slate-400 shadow-sm transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:border-sky-400 dark:focus:ring-sky-500/40"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-500 px-4 py-3 text-lg font-semibold text-white shadow-lg shadow-sky-500/30 transition hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-sky-500 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={loading}
            >
              {loading ? "Creating your workspace..." : "Create account"}
            </button>
          </form>
        ) : (
          <form className="mt-8 space-y-5" onSubmit={handleOtpSubmit}>
            <div className="space-y-2">
              <label
                htmlFor="otp"
                className="text-sm font-medium text-slate-700 dark:text-slate-200"
              >
                Enter OTP
              </label>
              <input
                id="otp"
                name="otp"
                type="text"
                placeholder="6-digit code"
                required
                value={otp}
                onChange={(event) => setOtp(event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-slate-900 placeholder-slate-400 shadow-sm transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:border-emerald-400 dark:focus:ring-emerald-500/40"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-sky-500 px-4 py-3 text-lg font-semibold text-white shadow-lg shadow-emerald-500/30 transition hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={otpLoading}
            >
              {otpLoading ? "Verifying..." : "Verify email"}
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
          Already have an account?{" "}
          <Link
            className="font-semibold text-sky-500 hover:text-sky-400"
            to="/login"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
    </>
  );
}

export default Signup;
