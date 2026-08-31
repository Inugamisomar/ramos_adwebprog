import {
  useEffect,
  useState,
} from "react";

import Button from "../../components/Button";
import apiRequest from "../../services/api";

import {
  getCurrentUser,
  saveSession,
} from "../../services/authService";

const ProfilePage = () => {
  const [
    profile,
    setProfile,
  ] = useState(null);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    changingPassword,
    setChangingPassword,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const [
    success,
    setSuccess,
  ] = useState("");

  const [
    name,
    setName,
  ] = useState("");

  const [
    email,
    setEmail,
  ] = useState("");

  const [
    currentPassword,
    setCurrentPassword,
  ] = useState("");

  const [
    newPassword,
    setNewPassword,
  ] = useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  // PASSWORD VISIBILITY
  const [
    showCurrentPassword,
    setShowCurrentPassword,
  ] = useState(false);

  const [
    showNewPassword,
    setShowNewPassword,
  ] = useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  // LOAD PROFILE
  const fetchProfile =
    async () => {
      try {
        setLoading(true);
        setError("");

        const data =
          await apiRequest(
            "/auth/profile"
          );

        setProfile(
          data.user
        );

        setName(
          data.user?.name || ""
        );

        setEmail(
          data.user?.email || ""
        );
      } catch (err) {
        setError(
          err.message ||
            "Unable to load profile."
        );
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchProfile();
  }, []);

  // UPDATE PROFILE
  const handleUpdateProfile =
    async (event) => {
      event.preventDefault();

      setError("");
      setSuccess("");

      if (!name.trim()) {
        setError(
          "Name is required."
        );

        return;
      }

      if (!email.trim()) {
        setError(
          "Email is required."
        );

        return;
      }

      try {
        setSaving(true);

        const data =
          await apiRequest(
            "/auth/profile",
            {
              method: "PUT",

              body:
                JSON.stringify({
                  name:
                    name.trim(),

                  email:
                    email.trim(),
                }),
            }
          );

        setProfile(
          data.user
        );

        setName(
          data.user.name
        );

        setEmail(
          data.user.email
        );

        // UPDATE STORED USER
        const token =
          localStorage.getItem(
            "token"
          );

        if (token) {
          saveSession(
            token,
            data.user
          );

          window.dispatchEvent(
            new Event(
              "userUpdated"
            )
          );
        }

        setSuccess(
          data.message ||
            "Profile updated successfully."
        );
      } catch (err) {
        setError(
          err.message ||
            "Unable to update profile."
        );
      } finally {
        setSaving(false);
      }
    };

  // CHANGE PASSWORD
  const handleChangePassword =
    async (event) => {
      event.preventDefault();

      setError("");
      setSuccess("");

      if (
        !currentPassword ||
        !newPassword ||
        !confirmPassword
      ) {
        setError(
          "Please complete all password fields."
        );

        return;
      }

      if (
        newPassword.length < 6
      ) {
        setError(
          "New password must be at least 6 characters."
        );

        return;
      }

      if (
        newPassword !==
        confirmPassword
      ) {
        setError(
          "New password and confirmation do not match."
        );

        return;
      }

      if (
        currentPassword ===
        newPassword
      ) {
        setError(
          "Your new password must be different from your current password."
        );

        return;
      }

      try {
        setChangingPassword(
          true
        );

        const data =
          await apiRequest(
            "/auth/change-password",
            {
              method: "PUT",

              body:
                JSON.stringify({
                  currentPassword,
                  newPassword,
                  confirmPassword,
                }),
            }
          );

        setCurrentPassword(
          ""
        );

        setNewPassword(
          ""
        );

        setConfirmPassword(
          ""
        );

        setShowCurrentPassword(
          false
        );

        setShowNewPassword(
          false
        );

        setShowConfirmPassword(
          false
        );

        setSuccess(
          data.message ||
            "Password changed successfully."
        );
      } catch (err) {
        setError(
          err.message ||
            "Unable to change password."
        );
      } finally {
        setChangingPassword(
          false
        );
      }
    };

  // PROFILE INITIAL
  const profileInitial =
    profile?.name
      ?.trim()
      ?.charAt(0)
      ?.toUpperCase() ||
    "U";

  // LOADING
  if (loading) {
    return (
      <section
        aria-labelledby="profile-loading-title"
        className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"
      >
        <div
          role="status"
          aria-live="polite"
          className="rounded-3xl border-2 border-blue-200 bg-white p-10 text-center shadow-sm"
        >
          <div
            aria-hidden="true"
            className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-950"
          />

          <h1
            id="profile-loading-title"
            className="mt-5 text-xl font-black text-blue-950"
          >
            Loading your profile
          </h1>

          <p className="mt-2 text-sm text-zinc-600">
            Retrieving your
            BulldogEx account
            information.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      aria-labelledby="profile-title"
      className="bg-blue-50 px-4 py-10 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}
        <header className="mb-8">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-700">
            BulldogEx Account
          </p>

          <h1
            id="profile-title"
            className="mt-2 text-4xl font-black tracking-tight text-blue-950 sm:text-5xl"
          >
            My Profile
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-700 sm:text-base">
            View your account
            details, update your
            personal information,
            and securely manage
            your password.
          </p>
        </header>

        {/* SUCCESS */}
        {success && (
          <div
            role="status"
            aria-live="polite"
            className="mb-6 rounded-2xl border-2 border-green-300 bg-green-50 px-5 py-4"
          >
            <p className="font-bold text-green-950">
              Success
            </p>

            <p className="mt-1 text-sm leading-6 text-green-900">
              {success}
            </p>
          </div>
        )}

        {/* ERROR */}
        {error && (
          <div
            role="alert"
            aria-live="assertive"
            className="mb-6 rounded-2xl border-2 border-red-300 bg-red-50 px-5 py-4"
          >
            <p className="font-bold text-red-950">
              Something went wrong
            </p>

            <p className="mt-1 text-sm leading-6 text-red-900">
              {error}
            </p>
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)]">

          {/* PROFILE SUMMARY */}
          <aside
            aria-labelledby="profile-summary-title"
            className="h-fit rounded-3xl border-2 border-blue-950 bg-blue-950 p-6 text-white shadow-sm lg:sticky lg:top-28"
          >
            <div
              aria-hidden="true"
              className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-yellow-300 bg-yellow-300 text-3xl font-black text-blue-950"
            >
              {profileInitial}
            </div>

            <h2
              id="profile-summary-title"
              className="mt-5 text-2xl font-black"
            >
              {profile?.name ||
                "User"}
            </h2>

            <p className="mt-2 break-all text-sm leading-6 text-blue-100">
              {profile?.email ||
                "No email available"}
            </p>

            <dl className="mt-6 space-y-5 border-t border-blue-700 pt-5">

              {/* ROLE */}
              <div>
                <dt className="text-xs font-black uppercase tracking-[0.16em] text-blue-200">
                  Role
                </dt>

                <dd className="mt-2 capitalize font-bold text-white">
                  {profile?.role ||
                    "Customer"}
                </dd>
              </div>

              {/* STATUS */}
              <div>
                <dt className="text-xs font-black uppercase tracking-[0.16em] text-blue-200">
                  Account Status
                </dt>

                <dd className="mt-2">
                  {profile?.isActive ? (
                    <span className="inline-flex items-center gap-2 rounded-full border border-green-300 bg-green-50 px-3 py-1.5 text-xs font-black text-green-950">
                      <span
                        aria-hidden="true"
                        className="h-2 w-2 rounded-full bg-green-700"
                      />

                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-2 rounded-full border border-red-300 bg-red-50 px-3 py-1.5 text-xs font-black text-red-950">
                      <span
                        aria-hidden="true"
                        className="h-2 w-2 rounded-full bg-red-700"
                      />

                      Inactive
                    </span>
                  )}
                </dd>
              </div>
            </dl>
          </aside>

          {/* FORMS */}
          <div className="space-y-8">

            {/* EDIT INFORMATION */}
            <form
              onSubmit={
                handleUpdateProfile
              }
              aria-labelledby="edit-profile-title"
              className="rounded-3xl border-2 border-blue-100 bg-white p-6 shadow-sm sm:p-8"
            >
              <div className="border-b-2 border-zinc-200 pb-5">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-700">
                  Account Details
                </p>

                <h2
                  id="edit-profile-title"
                  className="mt-2 text-2xl font-black text-blue-950"
                >
                  Edit Information
                </h2>

                <p className="mt-2 text-sm leading-6 text-zinc-700">
                  Update the name
                  and email address
                  connected to your
                  BulldogEx account.
                </p>
              </div>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">

                {/* FULL NAME */}
                <div>
                  <label
                    htmlFor="profile-name"
                    className="block text-sm font-bold text-zinc-950"
                  >
                    Full Name
                    <span
                      aria-hidden="true"
                      className="ml-1 text-red-600"
                    >
                      *
                    </span>
                  </label>

                  <input
                    id="profile-name"
                    name="name"
                    type="text"
                    value={name}
                    disabled={
                      saving
                    }
                    required
                    aria-required="true"
                    autoComplete="name"
                    onChange={(
                      event
                    ) =>
                      setName(
                        event.target
                          .value
                      )
                    }
                    className="mt-2 min-h-12 w-full rounded-xl border-2 border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-950 outline-none transition hover:border-blue-400 focus:border-blue-800 focus:ring-4 focus:ring-blue-200 disabled:cursor-not-allowed disabled:bg-zinc-100"
                  />
                </div>

                {/* EMAIL */}
                <div>
                  <label
                    htmlFor="profile-email"
                    className="block text-sm font-bold text-zinc-950"
                  >
                    Email Address
                    <span
                      aria-hidden="true"
                      className="ml-1 text-red-600"
                    >
                      *
                    </span>
                  </label>

                  <input
                    id="profile-email"
                    name="email"
                    type="email"
                    value={email}
                    disabled={
                      saving
                    }
                    required
                    aria-required="true"
                    autoComplete="email"
                    onChange={(
                      event
                    ) =>
                      setEmail(
                        event.target
                          .value
                      )
                    }
                    className="mt-2 min-h-12 w-full rounded-xl border-2 border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-950 outline-none transition hover:border-blue-400 focus:border-blue-800 focus:ring-4 focus:ring-blue-200 disabled:cursor-not-allowed disabled:bg-zinc-100"
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="blue"
                disabled={
                  saving
                }
                aria-busy={
                  saving
                }
                className="mt-6 w-full sm:w-auto"
              >
                {saving
                  ? "Saving Changes..."
                  : "Save Changes"}
              </Button>

              <div
                aria-live="polite"
                className="mt-2 min-h-5 text-xs font-semibold text-blue-800"
              >
                {saving
                  ? "Updating your profile information."
                  : ""}
              </div>
            </form>

            {/* CHANGE PASSWORD */}
            <form
              onSubmit={
                handleChangePassword
              }
              aria-labelledby="change-password-title"
              className="rounded-3xl border-2 border-blue-100 bg-white p-6 shadow-sm sm:p-8"
            >
              <div className="border-b-2 border-zinc-200 pb-5">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-700">
                  Security
                </p>

                <h2
                  id="change-password-title"
                  className="mt-2 text-2xl font-black text-blue-950"
                >
                  Change Password
                </h2>

                <p className="mt-2 text-sm leading-6 text-zinc-700">
                  Verify your
                  current password,
                  then create a new
                  password with at
                  least 6
                  characters.
                </p>
              </div>

              <div className="mt-6 space-y-5">

                {/* CURRENT PASSWORD */}
                <div>
                  <label
                    htmlFor="currentPassword"
                    className="block text-sm font-bold text-zinc-950"
                  >
                    Current Password
                    <span
                      aria-hidden="true"
                      className="ml-1 text-red-600"
                    >
                      *
                    </span>
                  </label>

                  <div className="relative mt-2">
                    <input
                      id="currentPassword"
                      name="currentPassword"
                      type={
                        showCurrentPassword
                          ? "text"
                          : "password"
                      }
                      value={
                        currentPassword
                      }
                      disabled={
                        changingPassword
                      }
                      required
                      aria-required="true"
                      autoComplete="current-password"
                      onChange={(
                        event
                      ) =>
                        setCurrentPassword(
                          event.target
                            .value
                        )
                      }
                      placeholder="Enter your current password"
                      className="min-h-12 w-full rounded-xl border-2 border-zinc-300 bg-white px-4 py-3 pr-20 text-sm text-zinc-950 outline-none transition placeholder:text-zinc-500 hover:border-blue-400 focus:border-blue-800 focus:ring-4 focus:ring-blue-200 disabled:cursor-not-allowed disabled:bg-zinc-100"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowCurrentPassword(
                          (
                            previous
                          ) =>
                            !previous
                        )
                      }
                      disabled={
                        changingPassword
                      }
                      aria-label={
                        showCurrentPassword
                          ? "Hide current password"
                          : "Show current password"
                      }
                      aria-pressed={
                        showCurrentPassword
                      }
                      className="absolute inset-y-0 right-2 my-auto min-h-10 rounded-lg px-3 text-xs font-bold text-blue-800 transition hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-300 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {showCurrentPassword
                        ? "Hide"
                        : "Show"}
                    </button>
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">

                  {/* NEW PASSWORD */}
                  <div>
                    <label
                      htmlFor="newPassword"
                      className="block text-sm font-bold text-zinc-950"
                    >
                      New Password
                      <span
                        aria-hidden="true"
                        className="ml-1 text-red-600"
                      >
                        *
                      </span>
                    </label>

                    <div className="relative mt-2">
                      <input
                        id="newPassword"
                        name="newPassword"
                        type={
                          showNewPassword
                            ? "text"
                            : "password"
                        }
                        value={
                          newPassword
                        }
                        disabled={
                          changingPassword
                        }
                        required
                        aria-required="true"
                        minLength={6}
                        autoComplete="new-password"
                        aria-describedby="new-password-help"
                        onChange={(
                          event
                        ) =>
                          setNewPassword(
                            event.target
                              .value
                          )
                        }
                        placeholder="Minimum 6 characters"
                        className="min-h-12 w-full rounded-xl border-2 border-zinc-300 bg-white px-4 py-3 pr-20 text-sm text-zinc-950 outline-none transition placeholder:text-zinc-500 hover:border-blue-400 focus:border-blue-800 focus:ring-4 focus:ring-blue-200 disabled:cursor-not-allowed disabled:bg-zinc-100"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowNewPassword(
                            (
                              previous
                            ) =>
                              !previous
                          )
                        }
                        disabled={
                          changingPassword
                        }
                        aria-label={
                          showNewPassword
                            ? "Hide new password"
                            : "Show new password"
                        }
                        aria-pressed={
                          showNewPassword
                        }
                        className="absolute inset-y-0 right-2 my-auto min-h-10 rounded-lg px-3 text-xs font-bold text-blue-800 transition hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-300 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {showNewPassword
                          ? "Hide"
                          : "Show"}
                      </button>
                    </div>

                    <p
                      id="new-password-help"
                      className="mt-2 text-xs leading-5 text-zinc-600"
                    >
                      Use at least 6
                      characters and
                      choose a
                      password that
                      differs from
                      your current
                      password.
                    </p>
                  </div>

                  {/* CONFIRM PASSWORD */}
                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm font-bold text-zinc-950"
                    >
                      Confirm Password
                      <span
                        aria-hidden="true"
                        className="ml-1 text-red-600"
                      >
                        *
                      </span>
                    </label>

                    <div className="relative mt-2">
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={
                          showConfirmPassword
                            ? "text"
                            : "password"
                        }
                        value={
                          confirmPassword
                        }
                        disabled={
                          changingPassword
                        }
                        required
                        aria-required="true"
                        minLength={6}
                        autoComplete="new-password"
                        onChange={(
                          event
                        ) =>
                          setConfirmPassword(
                            event.target
                              .value
                          )
                        }
                        placeholder="Repeat your new password"
                        className="min-h-12 w-full rounded-xl border-2 border-zinc-300 bg-white px-4 py-3 pr-20 text-sm text-zinc-950 outline-none transition placeholder:text-zinc-500 hover:border-blue-400 focus:border-blue-800 focus:ring-4 focus:ring-blue-200 disabled:cursor-not-allowed disabled:bg-zinc-100"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(
                            (
                              previous
                            ) =>
                              !previous
                          )
                        }
                        disabled={
                          changingPassword
                        }
                        aria-label={
                          showConfirmPassword
                            ? "Hide confirmed password"
                            : "Show confirmed password"
                        }
                        aria-pressed={
                          showConfirmPassword
                        }
                        className="absolute inset-y-0 right-2 my-auto min-h-10 rounded-lg px-3 text-xs font-bold text-blue-800 transition hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-300 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {showConfirmPassword
                          ? "Hide"
                          : "Show"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                variant="blue"
                disabled={
                  changingPassword
                }
                aria-busy={
                  changingPassword
                }
                className="mt-6 w-full sm:w-auto"
              >
                {changingPassword
                  ? "Changing Password..."
                  : "Change Password"}
              </Button>

              <div
                aria-live="polite"
                className="mt-2 min-h-5 text-xs font-semibold text-blue-800"
              >
                {changingPassword
                  ? "Updating your password securely."
                  : ""}
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfilePage;