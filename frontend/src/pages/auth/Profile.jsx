import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import authService from "../../services/authService";
import { updateUser } from "../../redux/authslice";
import CourseForms from "../../components/CourseForms";
import SEO from "../../components/SEO";
const inputBaseClasses =
  "w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100 dark:border-slate-700/80 dark:bg-slate-900/70 dark:text-slate-100 dark:focus:border-sky-500";

function StatusBanner({ status }) {
  if (!status) return null;
  const tone =
    status.type === "error"
      ? "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-200"
      : "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-200";

  return (
    <div className={`rounded-2xl px-4 py-2 text-sm font-medium ${tone}`}>
      {status.message}
    </div>
  );
}

function Profile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const [profile, setProfile] = useState(user);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileStatus, setProfileStatus] = useState(null);

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordStatus, setPasswordStatus] = useState(null);
  const [passwordSubmitting, setPasswordSubmitting] = useState(false);

  const [profileForm, setProfileForm] = useState({
    name: "",
    mobile: "",
    bio: "",
  });
  const [profileFormStatus, setProfileFormStatus] = useState(null);
  const [profileSubmitting, setProfileSubmitting] = useState(false);

  const loadProfile = useCallback(async () => {
    try {
      setProfileLoading(true);
      setProfileStatus(null);
      const data = await authService.getCurrentUser();
      setProfile(data.user);
      setProfileForm({
        name: data.user?.name || "",
        mobile: data.user?.mobile || "",
        bio: data.user?.bio || "",
      });
      dispatch(updateUser(data.user));
      setProfileStatus({
        type: "success",
        message: data.message || "Profile loaded",
      });
    } catch (error) {
      const message =
        error?.response?.data?.message || "Failed to load profile";
      setProfileStatus({ type: "error", message });
    } finally {
      setProfileLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
      return;
    }
    loadProfile();
  }, [isAuthenticated, loadProfile, navigate]);

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  const submitPasswordChange = async (event) => {
    event.preventDefault();
    setPasswordSubmitting(true);
    setPasswordStatus(null);
    try {
      const response = await authService.changePassword(passwordForm);
      setPasswordStatus({
        type: "success",
        message: response.message || "Password updated",
      });
      setPasswordForm({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      const message =
        error?.response?.data?.message || "Failed to update password";
      setPasswordStatus({ type: "error", message });
    } finally {
      setPasswordSubmitting(false);
    }
  };

  const handleProfileInput = (event) => {
    const { name, value } = event.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
  };

  const submitProfileUpdate = async (event) => {
    event.preventDefault();
    setProfileSubmitting(true);
    setProfileFormStatus(null);
    try {
      const response = await authService.updateProfile(profileForm);
      setProfile(response.user);
      dispatch(updateUser(response.user));
      setProfileFormStatus({
        type: "success",
        message: response.message || "Profile updated",
      });
    } catch (error) {
      const message =
        error?.response?.data?.message || "Failed to update profile";
      setProfileFormStatus({ type: "error", message });
    } finally {
      setProfileSubmitting(false);
    }
  };

  const skeleton = (
    <div className="animate-pulse space-y-4">
      <div className="h-5 rounded-2xl bg-slate-200/80 dark:bg-slate-800" />
      <div className="h-5 rounded-2xl bg-slate-200/80 dark:bg-slate-800" />
      <div className="h-5 rounded-2xl bg-slate-200/80 dark:bg-slate-800" />
    </div>
  );

  return (
    <>
    <SEO
        title="Profile | Xynapse Systems"
        description="Manage your account, personal info, and security settings at Xynapse Systems."
        canonical="https://xynapsesystems.com/profile"
        image="https://xynapsesystems.com/images/Logo.png"
      />
      <section className="space-y-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Profile & Settings
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
              Account overview
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Manage your personal info, security, and preferences.
            </p>
          </div>
          <button
            type="button"
            onClick={loadProfile}
            disabled={profileLoading}
            className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white/90 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-slate-600"
          >
            {profileLoading ? "Refreshing..." : "Refresh profile"}
          </button>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-1">
            <div className="rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-sm dark:border-slate-800/80 dark:bg-slate-950/50">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                  Profile snapshot
                </p>
                {profileLoading && (
                  <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
                    Loading...
                  </span>
                )}
              </div>
              <div className="mt-4 space-y-4">
                {profile ? (
                  <>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-400">
                        Name
                      </p>
                      <p className="text-base font-semibold text-slate-900 dark:text-white">
                        {profile.name || "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-400">
                        Email
                      </p>
                      <p className="text-base text-slate-700 dark:text-slate-200">
                        {profile.email || "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-400">
                        Mobile
                      </p>
                      <p className="text-base text-slate-700 dark:text-slate-200">
                        {profile.mobile || "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-400">
                        Role
                      </p>
                      <p className="text-base text-slate-700 dark:text-slate-200">
                        {profile.role || "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-400">
                        Joined
                      </p>
                      <p className="text-base text-slate-700 dark:text-slate-200">
                        {profile.createdAt
                          ? new Date(profile.createdAt).toLocaleDateString()
                          : "—"}
                      </p>
                    </div>
                  </>
                ) : (
                  skeleton
                )}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-sm dark:border-slate-800/80 dark:bg-slate-950/50">
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                Security status
              </p>
              <ul className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
                <li className="flex items-center justify-between rounded-2xl bg-slate-100/70 px-3 py-2 text-slate-700 dark:bg-slate-900/70 dark:text-slate-200">
                  <span>Email verified</span>
                  <span
                    className={
                      profile?.emailVerified
                        ? "text-emerald-500"
                        : "text-amber-500"
                    }
                  >
                    {profile?.emailVerified ? "Yes" : "Pending"}
                  </span>
                </li>
                <li className="flex items-center justify-between rounded-2xl bg-slate-100/70 px-3 py-2 text-slate-700 dark:bg-slate-900/70 dark:text-slate-200">
                  <span>Phone verified</span>
                  <span
                    className={
                      profile?.phoneVerified
                        ? "text-emerald-500"
                        : "text-amber-500"
                    }
                  >
                    {profile?.phoneVerified ? "Yes" : "Pending"}
                  </span>
                </li>
                <li className="flex items-center justify-between rounded-2xl bg-slate-100/70 px-3 py-2 text-slate-700 dark:bg-slate-900/70 dark:text-slate-200">
                  <span>2FA enabled</span>
                  <span
                    className={
                      profile?.isTwofaEnabled
                        ? "text-emerald-500"
                        : "text-slate-400"
                    }
                  >
                    {profile?.isTwofaEnabled ? "Active" : "Disabled"}
                  </span>
                </li>
              </ul>
            </div>

            <CourseForms userEmail={profile?.email} />

            <StatusBanner status={profileStatus} />
          </div>
          <div className="space-y-8 lg:col-span-2">
            <div className="rounded-3xl border border-slate-200/80 bg-white/95 p-6 shadow-sm dark:border-slate-800/80 dark:bg-slate-950/50">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Update profile
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Keep your public profile details up to date.
                  </p>
                </div>
              </div>
              <form className="mt-6 space-y-5" onSubmit={submitProfileUpdate}>
                <div className="space-y-2">
                  <label
                    className="text-sm font-medium text-slate-700 dark:text-slate-200"
                    htmlFor="name"
                  >
                    Full name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={profileForm.name}
                    onChange={handleProfileInput}
                    className={inputBaseClasses}
                    placeholder="Your full name"
                  />
                </div>
                <div className="space-y-2">
                  <label
                    className="text-sm font-medium text-slate-700 dark:text-slate-200"
                    htmlFor="mobile"
                  >
                    Mobile number
                  </label>
                  <input
                    id="mobile"
                    name="mobile"
                    type="text"
                    value={profileForm.mobile}
                    onChange={handleProfileInput}
                    className={inputBaseClasses}
                    placeholder="Add a reachable phone"
                  />
                </div>
                <div className="space-y-2">
                  <label
                    className="text-sm font-medium text-slate-700 dark:text-slate-200"
                    htmlFor="bio"
                  >
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    rows={4}
                    value={profileForm.bio}
                    onChange={handleProfileInput}
                    className={`${inputBaseClasses} resize-none`}
                    placeholder="Tell others who you are"
                  />
                </div>
                <StatusBanner status={profileFormStatus} />
                <button
                  type="submit"
                  disabled={profileSubmitting}
                  className="inline-flex w-full items-center justify-center rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
                >
                  {profileSubmitting ? "Updating..." : "Save changes"}
                </button>
              </form>
            </div>

            <div className="rounded-3xl border border-slate-200/80 bg-white/95 p-6 shadow-sm dark:border-slate-800/80 dark:bg-slate-950/50">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Change password
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Set a strong password you haven’t used recently.
                  </p>
                </div>
              </div>
              <form className="mt-6 space-y-5" onSubmit={submitPasswordChange}>
                <div className="space-y-2">
                  <label
                    className="text-sm font-medium text-slate-700 dark:text-slate-200"
                    htmlFor="oldPassword"
                  >
                    Current password
                  </label>
                  <input
                    id="oldPassword"
                    name="oldPassword"
                    type="password"
                    autoComplete="current-password"
                    value={passwordForm.oldPassword}
                    onChange={handlePasswordChange}
                    className={inputBaseClasses}
                    placeholder="••••••••"
                  />
                </div>
                <div className="space-y-2">
                  <label
                    className="text-sm font-medium text-slate-700 dark:text-slate-200"
                    htmlFor="newPassword"
                  >
                    New password
                  </label>
                  <input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    autoComplete="new-password"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordChange}
                    className={inputBaseClasses}
                    placeholder="Use 8+ characters, mix of cases"
                  />
                </div>
                <div className="space-y-2">
                  <label
                    className="text-sm font-medium text-slate-700 dark:text-slate-200"
                    htmlFor="confirmPassword"
                  >
                    Confirm password
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    value={passwordForm.confirmPassword}
                    onChange={handlePasswordChange}
                    className={inputBaseClasses}
                    placeholder="Repeat new password"
                  />
                </div>
                <StatusBanner status={passwordStatus} />
                <button
                  type="submit"
                  disabled={passwordSubmitting}
                  className="inline-flex w-full items-center justify-center rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
                >
                  {passwordSubmitting ? "Updating..." : "Update password"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Profile;
