import { useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import Button from "../../components/Button";

import {
  login,
  saveSession,
} from "../../services/authService";

const inputClasses =
  "mt-3 min-h-14 w-full rounded-2xl border-2 border-blue-200 bg-white px-5 py-4 text-base text-zinc-900 shadow-sm outline-none transition placeholder:text-zinc-500 hover:border-blue-300 focus:border-blue-700 focus:ring-4 focus:ring-blue-200 disabled:cursor-not-allowed disabled:bg-zinc-100";

const SignInPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] =
    useState({
      email: "",
      password: "",
    });

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const handleChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setFormData(
      (previousData) => ({
        ...previousData,
        [name]: value,
      })
    );

    if (error) {
      setError("");
    }
  };

  const handleSubmit =
    async (e) => {
      e.preventDefault();

      setError("");

      const email =
        formData.email.trim();

      if (
        !email ||
        !formData.password
      ) {
        setError(
          "Please enter your email and password."
        );
        return;
      }

      try {
        setLoading(true);

        const data =
          await login(
            email,
            formData.password
          );

        const token =
          data.token;

        const user =
          data.user || {
            _id: data._id,
            name: data.name,
            email: data.email,
            role: data.role,
            isActive:
              data.isActive,
          };

        if (!token) {
          throw new Error(
            "Login succeeded but no token was returned."
          );
        }

        saveSession(
          token,
          user
        );

        window.dispatchEvent(
          new Event(
            "userUpdated"
          )
        );

        if (
          user.role ===
          "admin"
        ) {
          navigate(
            "/admin"
          );
        } else {
          navigate("/");
        }
      } catch (err) {
        setError(
          err.message ||
            "Unable to login. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <section
      aria-labelledby="signin-title"
      className="w-full"
    >
      {/* TITLE */}
      <div className="text-center">
        <p className="text-sm font-black uppercase tracking-[0.24em] text-blue-700 sm:text-base">
          Bulldogs Exchange
        </p>

        <h1
          id="signin-title"
          className="mt-3 text-4xl font-black tracking-tight text-blue-950 sm:text-5xl lg:text-6xl"
        >
          Sign In
        </h1>

        <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-zinc-700 sm:text-lg sm:leading-8">
          Sign in to manage your
          account, orders, reviews,
          and campus purchases.
        </p>
      </div>

      {/* LOGIN CARD */}
      <div className="mx-auto mt-10 max-w-2xl overflow-hidden rounded-3xl border-2 border-blue-100 bg-white shadow-xl shadow-blue-950/10">
        <div className="h-2 bg-yellow-400" />

        <form
          className="space-y-8 p-8 sm:p-10 lg:p-12"
          onSubmit={
            handleSubmit
          }
          noValidate
        >
          {/* ERROR */}
          {error && (
            <div
              id="signin-error"
              role="alert"
              aria-live="assertive"
              className="rounded-2xl border-2 border-red-300 bg-red-50 px-5 py-4 text-base font-semibold leading-7 text-red-800"
            >
              {error}
            </div>
          )}

          {/* EMAIL */}
          <div>
            <label
              htmlFor="email"
              className="block text-base font-bold text-zinc-900 sm:text-lg"
            >
              Email address
              <span
                aria-hidden="true"
                className="ml-1 text-red-600"
              >
                *
              </span>
            </label>

            <input
              id="email"
              type="email"
              name="email"
              value={
                formData.email
              }
              onChange={
                handleChange
              }
              placeholder="name@example.com"
              autoComplete="email"
              inputMode="email"
              required
              disabled={
                loading
              }
              aria-required="true"
              aria-invalid={
                error
                  ? "true"
                  : "false"
              }
              aria-describedby={
                error
                  ? "signin-error"
                  : "email-help"
              }
              className={
                inputClasses
              }
            />

            <p
              id="email-help"
              className="mt-3 text-sm leading-6 text-zinc-600"
            >
              Enter the email
              address registered
              with your BulldogEx
              account.
            </p>
          </div>

          {/* PASSWORD */}
          <div>
            <label
              htmlFor="password"
              className="block text-base font-bold text-zinc-900 sm:text-lg"
            >
              Password
              <span
                aria-hidden="true"
                className="ml-1 text-red-600"
              >
                *
              </span>
            </label>

            <div className="relative mt-3">
              <input
                id="password"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                name="password"
                value={
                  formData.password
                }
                onChange={
                  handleChange
                }
                placeholder="Enter your password"
                autoComplete="current-password"
                required
                disabled={
                  loading
                }
                aria-required="true"
                aria-invalid={
                  error
                    ? "true"
                    : "false"
                }
                aria-describedby={
                  error
                    ? "signin-error"
                    : "password-help"
                }
                className={`${inputClasses} mt-0 pr-32`}
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    (current) =>
                      !current
                  )
                }
                disabled={
                  loading
                }
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
                aria-pressed={
                  showPassword
                }
                className="absolute right-3 top-1/2 min-h-11 -translate-y-1/2 rounded-xl px-4 text-sm font-black uppercase tracking-wider text-blue-800 transition hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-300 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {showPassword
                  ? "Hide"
                  : "Show"}
              </button>
            </div>

            <p
              id="password-help"
              className="mt-3 text-sm leading-6 text-zinc-600"
            >
              Passwords are case
              sensitive.
            </p>
          </div>

          {/* SIGN IN */}
          <Button
            type="submit"
            variant="blue"
            disabled={
              loading
            }
            aria-busy={
              loading
            }
            className="min-h-14 w-full rounded-2xl text-base font-black tracking-[0.12em] sm:text-lg"
          >
            {loading
              ? "Signing In..."
              : "Sign In"}
          </Button>

          {/* LOADING STATUS */}
          <div
            aria-live="polite"
            aria-atomic="true"
            className="sr-only"
          >
            {loading
              ? "Signing in. Please wait."
              : ""}
          </div>
        </form>
      </div>

      {/* ACCOUNT LINK */}
      <p className="mt-10 text-center text-base leading-7 text-zinc-700 sm:text-lg">
        Don't have an account?{" "}
        <Link
          to="/auth/signup"
          className="inline-flex min-h-11 items-center rounded-lg px-2 font-bold text-blue-800 underline decoration-2 underline-offset-4 transition hover:text-blue-950 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-300 focus-visible:ring-offset-2"
        >
          Create Account
        </Link>
      </p>
    </section>
  );
};

export default SignInPage;