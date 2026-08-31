import { useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import Button from "../../components/Button";

import {
  register,
  saveSession,
} from "../../services/authService";

// Slightly larger inputs without changing the layout
const inputClasses =
  "mt-2 min-h-12 w-full rounded-xl border-2 border-blue-200 bg-white px-4 py-3 text-[15px] text-zinc-900 shadow-sm outline-none transition placeholder:text-zinc-500 hover:border-blue-300 focus:border-blue-700 focus:ring-4 focus:ring-blue-200 disabled:cursor-not-allowed disabled:bg-zinc-100 disabled:text-zinc-500";

const SignUpPage = () => {
  const navigate =
    useNavigate();

  const [
    formData,
    setFormData,
  ] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  // INPUT CHANGE
  const handleChange = (
    event
  ) => {
    const {
      name,
      value,
    } = event.target;

    setFormData(
      (previousData) => ({
        ...previousData,
        [name]: value,
      })
    );

    if (error) {
      setError("");
    }

    if (success) {
      setSuccess("");
    }
  };

  // REGISTER
  const handleSubmit =
    async (event) => {
      event.preventDefault();

      setError("");
      setSuccess("");

      const {
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
      } = formData;

      // REQUIRED FIELDS
      if (
        !firstName.trim() ||
        !lastName.trim() ||
        !email.trim() ||
        !password ||
        !confirmPassword
      ) {
        setError(
          "Please complete all required fields."
        );
        return;
      }

      // NAME VALIDATION
      const namePattern =
        /^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/;

      if (
        !namePattern.test(
          firstName.trim()
        )
      ) {
        setError(
          "First name must contain valid letters only."
        );
        return;
      }

      if (
        !namePattern.test(
          lastName.trim()
        )
      ) {
        setError(
          "Last name must contain valid letters only."
        );
        return;
      }

      // EMAIL VALIDATION
      const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (
        !emailPattern.test(
          email.trim()
        )
      ) {
        setError(
          "Please enter a valid email address."
        );
        return;
      }

      // PASSWORD VALIDATION
      if (
        password.length < 6
      ) {
        setError(
          "Password must be at least 6 characters long."
        );
        return;
      }

      if (
        password !==
        confirmPassword
      ) {
        setError(
          "Passwords do not match."
        );
        return;
      }

      const fullName =
        `${firstName.trim()} ${lastName.trim()}`;

      try {
        setLoading(true);

        const data =
          await register(
            fullName,
            email
              .trim()
              .toLowerCase(),
            password
          );

        if (!data.token) {
          throw new Error(
            "Account was created but no login token was returned."
          );
        }

        const user =
          data.user || {
            _id: data._id,
            name: data.name,
            email: data.email,
            role: data.role,
            isActive:
              data.isActive,
          };

        // SAVE JWT SESSION
        saveSession(
          data.token,
          user
        );

        // UPDATE NAVBAR SESSION
        window.dispatchEvent(
          new Event(
            "userUpdated"
          )
        );

        setSuccess(
          "Account created successfully. Redirecting to the home page..."
        );

        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          confirmPassword: "",
        });

        setTimeout(() => {
          navigate("/");
        }, 1000);
      } catch (err) {
        setError(
          err.message ||
            "Unable to create your account. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <section
      aria-labelledby="signup-title"
    >
      {/* TITLE */}
      <div className="text-center">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-700">
          Bulldogs Exchange
        </p>

        <h1
          id="signup-title"
          className="mt-2 text-3xl font-black tracking-tight text-blue-950 sm:text-4xl"
        >
          Create Account
        </h1>

        <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-zinc-700">
          Create your BulldogEx
          account for faster
          checkout, order updates,
          reviews, and pickup
          information.
        </p>
      </div>

      {/* REGISTRATION CARD */}
      <div className="mt-8 overflow-hidden rounded-3xl border-2 border-blue-100 bg-white shadow-xl shadow-blue-950/10">
        <div
          className="h-2 bg-yellow-400"
          aria-hidden="true"
        />

        <form
          className="space-y-7 p-7 sm:p-9"
          onSubmit={
            handleSubmit
          }
          noValidate
        >
          {/* ERROR */}
          {error && (
            <div
              id="signup-error"
              role="alert"
              aria-live="assertive"
              className="rounded-xl border-2 border-red-300 bg-red-50 px-4 py-3 text-sm font-semibold leading-6 text-red-800"
            >
              {error}
            </div>
          )}

          {/* SUCCESS */}
          {success && (
            <div
              role="status"
              aria-live="polite"
              className="rounded-xl border-2 border-green-300 bg-green-50 px-4 py-3 text-sm font-semibold leading-6 text-green-900"
            >
              {success}
            </div>
          )}

          {/* NAME */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {/* FIRST NAME */}
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-bold text-zinc-900"
              >
                First name
                <span
                  aria-hidden="true"
                  className="ml-1 text-red-600"
                >
                  *
                </span>
              </label>

              <input
                id="firstName"
                type="text"
                name="firstName"
                value={
                  formData.firstName
                }
                onChange={
                  handleChange
                }
                placeholder="First name"
                autoComplete="given-name"
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
                    ? "signup-error"
                    : undefined
                }
                className={
                  inputClasses
                }
              />
            </div>

            {/* LAST NAME */}
            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-bold text-zinc-900"
              >
                Last name
                <span
                  aria-hidden="true"
                  className="ml-1 text-red-600"
                >
                  *
                </span>
              </label>

              <input
                id="lastName"
                type="text"
                name="lastName"
                value={
                  formData.lastName
                }
                onChange={
                  handleChange
                }
                placeholder="Last name"
                autoComplete="family-name"
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
                    ? "signup-error"
                    : undefined
                }
                className={
                  inputClasses
                }
              />
            </div>
          </div>

          {/* EMAIL */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-bold text-zinc-900"
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
                  ? "signup-error"
                  : "signup-email-help"
              }
              className={
                inputClasses
              }
            />

            <p
              id="signup-email-help"
              className="mt-2 text-xs leading-5 text-zinc-600"
            >
              This email will be
              used to sign in to
              your BulldogEx
              account.
            </p>
          </div>

          {/* PASSWORD */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-bold text-zinc-900"
            >
              Password
              <span
                aria-hidden="true"
                className="ml-1 text-red-600"
              >
                *
              </span>
            </label>

            <div className="relative mt-2">
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
                placeholder="Create a password"
                autoComplete="new-password"
                minLength={6}
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
                    ? "signup-error signup-password-help"
                    : "signup-password-help"
                }
                className={`${inputClasses} mt-0 pr-28`}
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
                className="absolute right-2 top-1/2 min-h-10 -translate-y-1/2 rounded-lg px-3 text-xs font-black uppercase tracking-wider text-blue-800 transition hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-300 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {showPassword
                  ? "Hide"
                  : "Show"}
              </button>
            </div>

            <p
              id="signup-password-help"
              className="mt-2 text-xs leading-5 text-zinc-600"
            >
              Use at least 6
              characters.
            </p>
          </div>

          {/* CONFIRM PASSWORD */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-bold text-zinc-900"
            >
              Confirm password
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
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                name="confirmPassword"
                value={
                  formData.confirmPassword
                }
                onChange={
                  handleChange
                }
                placeholder="Enter your password again"
                autoComplete="new-password"
                minLength={6}
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
                    ? "signup-error signup-confirm-help"
                    : "signup-confirm-help"
                }
                className={`${inputClasses} mt-0 pr-28`}
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(
                    (current) =>
                      !current
                  )
                }
                disabled={
                  loading
                }
                aria-label={
                  showConfirmPassword
                    ? "Hide confirmed password"
                    : "Show confirmed password"
                }
                aria-pressed={
                  showConfirmPassword
                }
                className="absolute right-2 top-1/2 min-h-10 -translate-y-1/2 rounded-lg px-3 text-xs font-black uppercase tracking-wider text-blue-800 transition hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-300 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {showConfirmPassword
                  ? "Hide"
                  : "Show"}
              </button>
            </div>

            <p
              id="signup-confirm-help"
              className="mt-2 text-xs leading-5 text-zinc-600"
            >
              Re-enter the same
              password to confirm
              it.
            </p>
          </div>

          {/* SUBMIT */}
          <Button
            type="submit"
            variant="blue"
            disabled={
              loading
            }
            aria-busy={
              loading
            }
            className="w-full rounded-xl"
          >
            {loading
              ? "Creating Account..."
              : "Create Account"}
          </Button>

          {/* SCREEN READER STATUS */}
          <div
            className="sr-only"
            aria-live="polite"
            aria-atomic="true"
          >
            {loading
              ? "Creating your account. Please wait."
              : ""}
          </div>

          <p className="text-center text-xs leading-5 text-zinc-600">
            Fields marked with{" "}
            <span
              className="font-bold text-red-600"
              aria-hidden="true"
            >
              *
            </span>{" "}
            are required.
          </p>
        </form>
      </div>

      {/* SIGN IN LINK */}
      <p className="mt-8 text-center text-sm leading-6 text-zinc-700">
        Already have an account?{" "}
        <Link
          to="/auth/signin"
          className="inline-flex min-h-11 items-center rounded-lg px-2 font-bold text-blue-800 underline decoration-2 underline-offset-4 transition hover:text-blue-950 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-300 focus-visible:ring-offset-2"
        >
          Sign In
        </Link>
      </p>
    </section>
  );
};

export default SignUpPage;