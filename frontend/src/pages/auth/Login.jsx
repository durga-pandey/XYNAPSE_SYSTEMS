import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import authService from "../../services/authService";
import { setUser } from "../../redux/authslice";
import { Eye, EyeOff } from "lucide-react";
import SEO from "../../components/SEO";

const initialState = {
  identifier: "",
  password: "",
  deviceName: "",
};

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [credentials, setCredentials] = useState(initialState);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const response = await authService.login({
        identifier: credentials.identifier.trim(),
        password: credentials.password,
        deviceName: credentials.deviceName.trim() || undefined,
      });

      if (response?.tempToken) {
        setStatus({
          type: "success",
          message:
            "2FA required. Enter the OTP sent to your device to continue.",
        });
      } else {
        dispatch(
          setUser({
            userId: response?.userId,
            sessionId: response?.sessionId,
            deviceName: response?.deviceName,
            identifier: credentials.identifier.trim(),
          }),
        );
        setStatus({
          type: "success",
          message: "Welcome back! Redirecting you now...",
        });
        setTimeout(() => navigate("/more-details"), 900);
      }
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Unable to log you in right now. Please try again.";
      setStatus({ type: "error", message });
    } finally {
      setLoading(false);
    }
  };

  const statusClasses =
    status?.type === "error"
      ? "border-red-200/60 bg-red-100/70 text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200"
      : "border-emerald-200/60 bg-emerald-100/70 text-emerald-800 dark:border-emerald-400/20 dark:bg-emerald-500/10 dark:text-emerald-200";

  return (
    <>
      <SEO
        title="Login | Xynapse Systems"
        description="Access your account at Xynapse Systems to continue learning, track progress, and manage your courses."
        canonical="https://xynapsesystems.com/login"
        image="https://xynapsesystems.com/images/Logo.png"
      />
      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-3xl flex-col items-center justify-center px-4 py-16">
        <div
          className="w-full rounded-3xl border border-slate-200/50 bg-white/80 p-8 shadow-2xl shadow-slate-900/5 backdrop-blur-xl dark:border-slate-700/50 dark:bg-slate-900/60"
          role="region"
          aria-labelledby="login-heading"
        >
          <header className="space-y-2 text-center">
            <p
              id="login-heading"
              className="text-2xl font-semibold text-slate-900 dark:text-white"
            >
              Welcome back
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Enter your credentials to continue.
            </p>
          </header>

          {status && (
            <div
              className={`mt-6 rounded-2xl border px-4 py-3 text-sm font-medium ${statusClasses}`}
              role="status"
            >
              {status.message}
            </div>
          )}

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label
                htmlFor="identifier"
                className="text-sm font-medium text-slate-700 dark:text-slate-200"
              >
                Email or mobile
              </label>
              <input
                id="identifier"
                name="identifier"
                type="text"
                placeholder="you@example.com / 9876543210"
                autoComplete="username"
                required
                value={credentials.identifier}
                onChange={handleChange}
                className="w-full rounded-2xl outline-none border border-slate-200 bg-white/80 px-4 py-3 text-slate-900 placeholder-slate-400 shadow-sm transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:border-sky-400 dark:focus:ring-sky-500/40"
              />
            </div>

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
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                  value={credentials.password}
                  onChange={handleChange}
                  className="w-full rounded-2xl outline-none border border-slate-200 bg-white/80 px-4 py-3 pr-12 text-slate-900 placeholder-slate-400 shadow-sm transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:border-sky-400 dark:focus:ring-sky-500/40"
                />

                {/* Eye Icon */}
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>

              <div className="flex justify-end">
                <Link
                  to="/forgot-password"
                  className="text-sm font-semibold text-sky-500 transition hover:text-sky-400"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-500 px-4 py-3 text-lg font-semibold text-white shadow-lg shadow-sky-500/30 transition hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-sky-500 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={loading}
            >
              {loading ? "Securing your session..." : "Log in"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
            Don&apos;t have an account?{" "}
            <Link
              className="font-semibold text-sky-500 hover:text-sky-400"
              to="/signup"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}

export default Login;
