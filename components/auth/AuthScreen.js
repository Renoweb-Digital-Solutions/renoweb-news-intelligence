"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  ArrowLeft,
  Eye,
  EyeOff,
  LoaderCircle,
  ShieldCheck,
  ScanSearch,
} from "lucide-react";
import GoogleButton from "./GoogleButton";
import SignalBoard from "@/components/marketing/SignalBoard";

// # A single state machine keeps credentials, OTP and recovery steps in one predictable flow.
// # Passwords never persist to localStorage; only the gateway controls HttpOnly session cookies.
export default function AuthScreen({
  initialStep = "login",
  googleError = false,
}) {
  const router = useRouter();
  const reduced = useReducedMotion();
  const [step, setStep] = useState(initialStep);
  const [purpose, setPurpose] = useState("login");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(
    googleError ? "Google sign-in wasn't completed. Please try again." : "",
  );
  const [notice, setNotice] = useState("");
  const [visible, setVisible] = useState(false);
  const [cooldown, setCooldown] = useState(initialStep === "verify" ? 60 : 0);
  const [email, setEmail] = useState("");

  // # Countdown is a convenience only; the backend independently enforces resend limits.
  useEffect(() => {
    if (!cooldown) return;
    const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  // # Every mutation stays same-origin, with status/error handling centralized for all steps.
  async function call(action, body) {
    const response = await fetch(`/api/auth/${action}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    if (!response.ok)
      throw new Error(data.error || "Something went wrong. Please try again.");
    return data;
  }

  // # FormData reads only this step's fields, so an old password is not retained in React state.
  async function submit(event) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    setNotice("");
    const fields = Object.fromEntries(new FormData(event.currentTarget));
    try {
      await call(step === "verify" ? "verify" : step, fields);
      if (step === "verify") {
        router.replace("/dashboard");
        router.refresh();
      } else {
        setPurpose(step);
        setEmail(fields.email || fields.identifier || "");
        setStep("verify");
        setCooldown(60);
      }
    } catch (failure) {
      setError(failure.message);
    } finally {
      setBusy(false);
    }
  }

  // # OAuth begins through a CSRF-protected POST; only Google's public URL is exposed.
  async function google() {
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      const data = await call("google/start", {});
      window.location.assign(data.url);
    } catch (failure) {
      setError(failure.message);
      setBusy(false);
    }
  }

  // # Resend never changes the purpose, attempt budget, or absolute challenge lifetime.
  async function resend() {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await call("resend", {});
      setCooldown(60);
      setNotice(
        "A fresh code is on its way. Check your inbox and spam folder.",
      );
    } catch (failure) {
      setError(failure.message);
    } finally {
      setBusy(false);
    }
  }

  // # Switching steps clears transient feedback; the backend owns challenge validity.
  function switchStep(value) {
    setStep(value);
    setError("");
    setNotice("");
    setVisible(false);
  }
  const signup = step === "signup",
    verify = step === "verify",
    reset = step === "reset";
  const heading = verify
    ? "Check your inbox."
    : reset
      ? "A fresh start."
      : signup
        ? "Curiosity looks good on you."
        : "Welcome back, snooper.";
  return (
    <main className="auth-shell">
      <section className="auth-left">
        <Link href="/" className="snoop-brand">
          <ScanSearch size={30} strokeWidth={2.5} /> snooptel<span>.</span>
        </Link>
        <div className="auth-form-wrap">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={step}
              initial={reduced ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: reduced ? 0 : -8 }}
              transition={{ duration: 0.22 }}
            >
              <span className="eyebrow">
                {verify ? "ONE LAST STEP" : "YOUR RESEARCH STARTS HERE"}
              </span>
              <h1>{heading}</h1>
              <p className="auth-intro">
                {verify
                  ? `Enter the 6-digit code sent ${email && email.includes("@") ? `to ${email}` : "to your email"}. It expires in 10 minutes.`
                  : reset
                    ? "Enter your email and we’ll send a code to reset your password."
                    : signup
                      ? "Find the conversations worth creating for."
                      : "Good ideas are out there. Let’s find yours."}
              </p>
              {!verify && !reset && (
                <>
                  <GoogleButton onClick={google} disabled={busy} />
                  <div className="auth-divider">
                    <span>or continue with email</span>
                  </div>
                </>
              )}
              <form onSubmit={submit} className="auth-form">
                {signup && (
                  <label>
                    Username
                    <input
                      className="neo-input"
                      name="username"
                      autoComplete="username"
                      placeholder="your_inner_snooper"
                      required
                      pattern="[A-Za-z0-9_]{3,30}"
                      minLength={3}
                      maxLength={30}
                      disabled={busy}
                    />
                    <small>3–30 letters, numbers or underscores.</small>
                  </label>
                )}
                {!verify && (
                  <label>
                    {step === "login" ? "Email or username" : "Email address"}
                    <input
                      className="neo-input"
                      type={step === "login" ? "text" : "email"}
                      name={step === "login" ? "identifier" : "email"}
                      autoComplete={step === "login" ? "username" : "email"}
                      placeholder={
                        step === "login"
                          ? "you@company.com or username"
                          : "you@company.com"
                      }
                      required
                      maxLength={254}
                      disabled={busy}
                    />
                  </label>
                )}
                {verify && (
                  <label>
                    Verification code
                    <input
                      autoFocus
                      className="neo-input otp-input"
                      name="code"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      pattern="[0-9]{6}"
                      minLength={6}
                      maxLength={6}
                      placeholder="000000"
                      required
                      disabled={busy}
                    />
                  </label>
                )}
                {((!verify && !reset) || (verify && purpose === "reset")) && (
                  <label>
                    {verify ? "New password" : "Password"}
                    <div className="password-field">
                      <input
                        className="neo-input"
                        type={visible ? "text" : "password"}
                        name="password"
                        autoComplete={
                          signup || verify ? "new-password" : "current-password"
                        }
                        minLength={signup || verify ? 12 : 1}
                        maxLength={128}
                        placeholder={
                          signup || verify
                            ? "At least 12 characters"
                            : "Your password"
                        }
                        required
                        disabled={busy}
                      />
                      <button
                        type="button"
                        onClick={() => setVisible(!visible)}
                        aria-label={visible ? "Hide password" : "Show password"}
                      >
                        {visible ? <EyeOff size={19} /> : <Eye size={19} />}
                      </button>
                    </div>
                    {signup && (
                      <small>
                        Use a long, unique password. Spaces and password
                        managers welcome.
                      </small>
                    )}
                  </label>
                )}
                {step === "login" && (
                  <button
                    type="button"
                    className="auth-text-link auth-forgot"
                    onClick={() => switchStep("reset")}
                    disabled={busy}
                  >
                    Forgot password?
                  </button>
                )}
                {error && (
                  <p className="auth-error" role="alert">
                    {error}
                  </p>
                )}
                {notice && (
                  <p className="auth-notice" role="status">
                    {notice}
                  </p>
                )}
                <button
                  className="neo-btn auth-submit"
                  disabled={busy}
                  type="submit"
                >
                  {busy ? (
                    <>
                      <LoaderCircle size={19} className="auth-spinner" />{" "}
                      Working on it…
                    </>
                  ) : (
                    <>
                      {verify
                        ? purpose === "reset"
                          ? "Reset & enter dashboard"
                          : "Verify & enter dashboard"
                        : reset
                          ? "Send reset code"
                          : signup
                            ? "Create your account"
                            : "Sign in"}
                      <ArrowRight size={19} />
                    </>
                  )}
                </button>
              </form>
              {verify ? (
                <div className="auth-followup">
                  <p>
                    Didn’t get a code?{" "}
                    <button
                      className="auth-text-link"
                      onClick={resend}
                      disabled={busy || cooldown > 0}
                    >
                      {cooldown ? `Resend in ${cooldown}s` : "Send a new code"}
                    </button>
                  </p>
                  <button
                    className="auth-text-link auth-back"
                    disabled={busy}
                    onClick={() => switchStep("login")}
                  >
                    <ArrowLeft size={15} /> Start again
                  </button>
                </div>
              ) : (
                <p className="auth-followup">
                  {reset
                    ? "Remember your password?"
                    : signup
                      ? "Already in the loop?"
                      : "New around here?"}{" "}
                  <button
                    className="auth-text-link"
                    disabled={busy}
                    onClick={() =>
                      switchStep(signup || reset ? "login" : "signup")
                    }
                  >
                    {signup || reset ? "Sign in" : "Create an account"}
                  </button>
                </p>
              )}
            </motion.div>
          </AnimatePresence>
          <p className="auth-security">
            <ShieldCheck size={16} /> Email verification. A safer place for your
            ideas.
          </p>
        </div>
        <div className="auth-bottom">
          <span>Stay curious. Create something good.</span>
          <Link href="/">Back to home ↗</Link>
        </div>
      </section>
      <aside className="auth-right">
        <div className="auth-right-copy">
          <span className="paper-tag">LESS NOISE. MORE SIGNAL.</span>
          <h2>
            The internet is loud.
            <br />
            <span>Find your angle.</span>
          </h2>
          <p>
            News, trends, and social conversations.
            <br />
            One curious little workspace.
          </p>
        </div>
        <SignalBoard />
        <div className="auth-right-footer">
          <span>BUILT FOR CURIOUS MINDS</span>
          <span>✳</span>
          <span>POWERED BY GOOD QUESTIONS</span>
        </div>
      </aside>
    </main>
  );
}
