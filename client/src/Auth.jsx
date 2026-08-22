import { useState } from "react";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  MapPin,
  User,
} from "lucide-react";

const API_URL = "https://globetrotter-back.onrender.com//api";

export default function Auth({ onLogin }) {
  const [mode, setMode] = useState("login");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event) => {
    event.preventDefault();

    setError("");

    // -----------------------------
    // Validation
    // -----------------------------

    if (mode === "register" && !name.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    if (
      mode === "register" &&
      password.length < 6
    ) {
      setError(
        "Password must be at least 6 characters."
      );
      return;
    }

    try {
      setLoading(true);

      const endpoint =
        mode === "login"
          ? "/auth/login"
          : "/auth/register";

      const requestBody =
        mode === "login"
          ? {
              email: email.trim().toLowerCase(),
              password,
            }
          : {
              name: name.trim(),
              email: email.trim().toLowerCase(),
              password,
            };

      const response = await fetch(
        `${API_URL}${endpoint}`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(requestBody),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Authentication failed."
        );
      }

      // -----------------------------
      // Store authentication
      // -----------------------------

      localStorage.setItem(
        "globetrotter_token",
        result.data.token
      );

      localStorage.setItem(
        "globetrotter_user",
        JSON.stringify(result.data.user)
      );

      // -----------------------------
      // Tell App.jsx about login
      // -----------------------------

      onLogin(result.data.user);
    } catch (err) {
      console.error(
        "Authentication error:",
        err
      );

      setError(
        err.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // Switch Login / Register
  // -----------------------------

  const switchMode = () => {
    setMode((currentMode) =>
      currentMode === "login"
        ? "register"
        : "login"
    );

    setError("");

    setName("");
    setEmail("");
    setPassword("");

    setShowPassword(false);
  };

  // -----------------------------
  // Forgot password
  // -----------------------------

  const handleForgotPassword = () => {
    setError(
      "Password reset will be available soon."
    );
  };

  return (
    <div className="auth-page">

      {/* =====================================
          LEFT VISUAL SECTION
      ====================================== */}

      <section className="auth-visual">

        <div className="auth-brand">
          <div className="brand-mark">
            G
          </div>

          <span>
            GlobeTrotter
          </span>
        </div>

        <div className="auth-visual-content">

          <p className="eyebrow">
            YOUR WORLD AWAITS
          </p>

          <h1>
            Plan less.
            <br />
            Experience more.
          </h1>

          <p className="auth-description">
            Build unforgettable journeys,
            discover new destinations and keep
            every adventure beautifully organized.
          </p>

          <div className="auth-location">
            <MapPin size={16} />

            <span>
              Somewhere worth discovering
            </span>
          </div>

        </div>

        <div className="auth-visual-footer">
          © 2026 GlobeTrotter
        </div>

      </section>

      {/* =====================================
          RIGHT FORM SECTION
      ====================================== */}

      <section className="auth-form-side">

        <div className="auth-form-container">

          {/* Mobile Logo */}

          <div className="mobile-auth-brand">

            <div className="brand-mark">
              G
            </div>

            <span>
              GlobeTrotter
            </span>

          </div>

          {/* Heading */}

          <div className="auth-heading">

            <p className="eyebrow">
              {mode === "login"
                ? "WELCOME BACK"
                : "START EXPLORING"}
            </p>

            <h2>
              {mode === "login"
                ? "Welcome back"
                : "Create your account"}
            </h2>

            <p>
              {mode === "login"
                ? "Sign in to continue your journey."
                : "Your next adventure starts here."}
            </p>

          </div>

          {/* Error */}

          {error && (
            <div
              className="auth-error"
              role="alert"
            >
              {error}
            </div>
          )}

          {/* =================================
              FORM
          ================================== */}

          <form onSubmit={submit}>

            {/* NAME */}

            {mode === "register" && (
              <div className="auth-field">

                <label htmlFor="auth-name">
                  Full name
                </label>

                <div className="auth-input">

                  <User size={17} />

                  <input
                    id="auth-name"
                    type="text"
                    placeholder="Your full name"
                    value={name}
                    onChange={(event) =>
                      setName(
                        event.target.value
                      )
                    }
                    autoComplete="name"
                  />

                </div>

              </div>
            )}

            {/* EMAIL */}

            <div className="auth-field">

              <label htmlFor="auth-email">
                Email address
              </label>

              <div className="auth-input">

                <Mail size={17} />

                <input
                  id="auth-email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(event) =>
                    setEmail(
                      event.target.value
                    )
                  }
                  autoComplete="email"
                />

              </div>

            </div>

            {/* PASSWORD */}

            <div className="auth-field">

              <label htmlFor="auth-password">
                Password
              </label>

              <div className="auth-input">

                <LockKeyhole size={17} />

                <input
                  id="auth-password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) =>
                    setPassword(
                      event.target.value
                    )
                  }
                  autoComplete={
                    mode === "login"
                      ? "current-password"
                      : "new-password"
                  }
                />

                <button
                  type="button"
                  className="password-toggle"
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                  onClick={() =>
                    setShowPassword(
                      (current) => !current
                    )
                  }
                >
                  {showPassword ? (
                    <EyeOff size={16} />
                  ) : (
                    <Eye size={16} />
                  )}
                </button>

              </div>

            </div>

            {/* LOGIN OPTIONS */}

            {mode === "login" && (
              <div className="auth-options">

                <label className="remember-option">

                  <input
                    type="checkbox"
                  />

                  <span>
                    Remember me
                  </span>

                </label>

                <button
                  type="button"
                  className="forgot-button"
                  onClick={
                    handleForgotPassword
                  }
                >
                  Forgot password?
                </button>

              </div>
            )}

            {/* SUBMIT */}

            <button
              className="auth-submit"
              type="submit"
              disabled={loading}
            >

              <span>
                {loading
                  ? "Please wait..."
                  : mode === "login"
                  ? "Sign in"
                  : "Create account"}
              </span>

              {!loading && (
                <ArrowRight size={17} />
              )}

            </button>

          </form>

          {/* SWITCH */}

          <div className="auth-switch">

            <span>
              {mode === "login"
                ? "Don't have an account?"
                : "Already have an account?"}
            </span>

            <button
              type="button"
              onClick={switchMode}
            >
              {mode === "login"
                ? "Create account"
                : "Sign in"}
            </button>

          </div>

          {/* SECURITY */}

          <p className="auth-security">
            Your account is secured with encrypted
            password storage and JWT authentication.
          </p>

        </div>

      </section>

    </div>
  );
}