import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Lock, Loader2 } from "lucide-react";
import { BrandMark } from "../components/shell/BrandMark";
import { Button } from "../components/ui/Button";

import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";

type AuthMode = "signin" | "signup" | "forgot" | "verify";

const loginImages = [
  "https://images.pexels.com/photos/1099065/pexels-photo-1099065.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1600&w=1200",
  "https://images.pexels.com/photos/1732414/pexels-photo-1732414.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1600&w=1200",
  "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1600&w=1200",
  "https://images.pexels.com/photos/259685/pexels-photo-259685.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1600&w=1200",
];

export default function Login() {
  const navigate = useNavigate();
  const { session } = useAuth();
  
  const [mode, setMode] = useState<AuthMode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const [bgImage, setBgImage] = useState(loginImages[0]);

  useEffect(() => {
    setBgImage(loginImages[Math.floor(Math.random() * loginImages.length)]);
  }, []);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const errorDesc = searchParams.get("error_description");
    const verified = searchParams.get("verified");
    
    if (errorDesc) {
      setError(errorDesc.replace(/\+/g, " "));
      // Clean up the URL
      window.history.replaceState(null, "", window.location.pathname + window.location.hash);
    } else if (verified) {
      setMessage("Email verified successfully! You can now sign in.");
      setMode("signin");
      window.history.replaceState(null, "", window.location.pathname + window.location.hash);
    }
  }, []);

  // Redirect if already logged in
  useEffect(() => {
    if (session) {
      navigate("/dashboard", { replace: true });
    }
  }, [session, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setMessage(null);
    
    const redirectUrl = import.meta.env.VITE_APP_URL || window.location.origin;

    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
            emailRedirectTo: `${redirectUrl}/#/auth/callback`,
          },
        });
        if (error) throw error;
        
        if (data.user && !data.session) {
          setMode("verify");
        } else {
          setMessage("Account created successfully! You can now sign in.");
          setMode("signin");
        }
      } else if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) {
          if (error.message.toLowerCase().includes("email not confirmed")) {
            setMode("verify");
            return;
          }
          throw error;
        }
        // Navigation is handled by the useEffect above when session changes
      } else if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/#/reset-password`,
        });
        if (error) throw error;
        setMessage("Reset link sent. Check your email.");
        setMode("signin");
      } else if (mode === "verify") {
        const { error } = await supabase.auth.resend({
          type: 'signup',
          email: email,
          options: {
            emailRedirectTo: `${redirectUrl}/#/auth/callback`,
          }
        });
        if (error) throw error;
        setMessage("Verification email resent. Check your inbox.");
        setCooldown(60);
      }
    } catch (err: any) {
      if (err.status === 429 || (err.message && err.message.toLowerCase().includes("rate limit"))) {
        setError("Too many reset requests. Please wait a few minutes before trying again.");
        if (mode === "forgot") setCooldown(60);
      } else {
        setError(err.message || "An error occurred during authentication.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen bg-[var(--color-canvas)] lg:grid-cols-[1fr_1.1fr]">
      {/* Auth panel */}
      <div className="flex items-center justify-center px-6 py-12 sm:px-12 lg:px-16 xl:px-24">
        <div className="animate-fade-rise w-full max-w-[420px]">
          <BrandMark />

          <div className="mt-16 space-y-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-accent)]">
              {mode === "forgot" ? "Account Recovery" : "Private access"}
            </p>
            <h1 className="font-serif text-[1.75rem] font-medium leading-[1.1] tracking-tight text-[var(--color-ink)] sm:text-4xl">
              {mode === "signup" ? "Create your portfolio" 
                : mode === "forgot" ? "Reset password" 
                : mode === "verify" ? "Check your email"
                : "Enter your portfolio"}
            </h1>
            <p className="text-[15px] text-[var(--color-ink-soft)] leading-relaxed">
              {mode === "signup" 
                ? "Sign up for your property command center." 
                : mode === "forgot" 
                ? "Enter your email to receive a reset link." 
                : mode === "verify"
                ? (
                  <>
                    We've sent a verification link to <span className="font-semibold text-[var(--color-ink)]">{email}</span>.
                    Please confirm your email address to sign in.
                  </>
                )
                : "Sign in to your property command center."}
            </p>
          </div>

          <form onSubmit={submit} className="mt-10 space-y-5">
            {error && (
              <div className="rounded-xl bg-[var(--color-critical)]/10 p-3.5 text-[13.5px] text-[var(--color-critical)] border border-[var(--color-critical)]/10 shadow-sm">
                {error}
              </div>
            )}
            
            {message && (
              <div className="rounded-xl bg-[var(--color-positive)]/10 p-3.5 text-[13.5px] text-[var(--color-positive)] border border-[var(--color-positive)]/10 shadow-sm">
                {message}
              </div>
            )}

            {mode === "signup" && (
              <div className="space-y-1.5">
                <label className="text-[13px] font-medium text-[var(--color-ink-soft)]">Full Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="h-12 w-full rounded-xl border border-white/80 bg-white/70 px-4 text-[14px] text-[var(--color-ink)] backdrop-blur-md shadow-[inset_0_1px_2px_rgba(0,0,0,0.02),0_1px_2px_rgba(255,255,255,0.7)] transition-all duration-200 placeholder:text-[var(--color-ink-faint)] hover:bg-white/85 focus:border-[var(--color-accent)] focus:bg-white/95 focus:outline-none focus:ring-4 focus:ring-[var(--color-accent)]/15 focus:shadow-[0_4px_16px_rgba(154,91,63,0.12)]"
                />
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-[var(--color-ink-soft)]">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 w-full rounded-xl border border-white/80 bg-white/70 px-4 text-[14px] text-[var(--color-ink)] backdrop-blur-md shadow-[inset_0_1px_2px_rgba(0,0,0,0.02),0_1px_2px_rgba(255,255,255,0.7)] transition-all duration-200 placeholder:text-[var(--color-ink-faint)] hover:bg-white/85 focus:border-[var(--color-accent)] focus:bg-white/95 focus:outline-none focus:ring-4 focus:ring-[var(--color-accent)]/15 focus:shadow-[0_4px_16px_rgba(154,91,63,0.12)]"
              />
            </div>
            
            {mode !== "forgot" && mode !== "verify" && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[13px] font-medium text-[var(--color-ink-soft)]">Password</label>
                  {mode === "signin" && (
                    <button 
                      type="button" 
                      onClick={() => setMode("forgot")}
                      className="text-[12.5px] font-medium text-[var(--color-accent)] transition-colors hover:text-[var(--color-ink)] hover:underline underline-offset-2"
                    >
                      Forgot?
                    </button>
                  )}
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 w-full rounded-xl border border-white/80 bg-white/70 px-4 text-[14px] text-[var(--color-ink)] backdrop-blur-md shadow-[inset_0_1px_2px_rgba(0,0,0,0.02),0_1px_2px_rgba(255,255,255,0.7)] transition-all duration-200 placeholder:text-[var(--color-ink-faint)] hover:bg-white/85 focus:border-[var(--color-accent)] focus:bg-white/95 focus:outline-none focus:ring-4 focus:ring-[var(--color-accent)]/15 focus:shadow-[0_4px_16px_rgba(154,91,63,0.12)]"
                />
              </div>
            )}

            {mode === "verify" && (
              <div className="pt-2">
                <Button 
                  type="button" 
                  onClick={() => {
                    const domain = email.split('@')[1];
                    if (domain) {
                      const url = domain === 'gmail.com' ? 'https://mail.google.com' : 
                                  domain === 'outlook.com' || domain === 'hotmail.com' ? 'https://outlook.live.com' : 
                                  domain === 'yahoo.com' ? 'https://mail.yahoo.com' : 
                                  `https://${domain}`;
                      window.open(url, '_blank');
                    }
                  }} 
                  className="h-12 w-full text-[14.5px] shadow-sm transition-all hover:scale-[1.01] active:scale-[0.99]"
                >
                  Open your email
                </Button>
              </div>
            )}

            <div className={mode === "verify" ? "mt-4" : "pt-2"}>
              <Button type="submit" variant={mode === "verify" ? "secondary" : "primary"} disabled={isLoading || ((mode === "forgot" || mode === "verify") && cooldown > 0)} className="h-12 w-full text-[14.5px] shadow-sm transition-all hover:scale-[1.01] active:scale-[0.99]" iconRight={isLoading && mode !== "verify" ? <Loader2 className="animate-spin" /> : mode !== "verify" ? <ArrowRight /> : undefined}>
                {isLoading 
                  ? "Processing..." 
                  : mode === "signup" 
                  ? "Create account" 
                  : mode === "forgot" 
                  ? (cooldown > 0 ? `Try again in ${cooldown}s` : "Send reset link")
                  : mode === "verify"
                  ? (cooldown > 0 ? `Try again in ${cooldown}s` : "Resend confirmation email")
                  : "Sign in"}
              </Button>
            </div>
            
            <div className="mt-6 text-center text-[13.5px] text-[var(--color-ink-soft)]">
              {mode === "signin" ? (
                <>
                  Don't have an account?{" "}
                  <button type="button" onClick={() => setMode("signup")} className="font-semibold text-[var(--color-accent)] transition-colors hover:text-[var(--color-ink)] hover:underline underline-offset-2">
                    Sign up
                  </button>
                </>
              ) : (
                <>
                  <button type="button" onClick={() => {setMode("signin"); setMessage(null); setError(null);}} className="font-semibold text-[var(--color-accent)] transition-colors hover:text-[var(--color-ink)] hover:underline underline-offset-2">
                    Back to Sign In
                  </button>
                </>
              )}
            </div>
          </form>

          <div className="mt-12 flex items-center gap-2 text-[12.5px] text-[var(--color-ink-faint)]">
            <Lock className="size-4 stroke-[1.5]" />
            Secured private workspace
          </div>
        </div>
      </div>

      {/* Editorial imagery */}
      <div className="relative hidden lg:block overflow-hidden">
        <img
          src={bgImage}
          alt="Property"
          className="absolute inset-0 size-full object-cover transition-transform duration-[20s] ease-out hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-black/80 via-black/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1513]/90 via-transparent to-transparent opacity-80" />
        
        <div className="absolute inset-x-0 bottom-0 p-12 lg:p-16 xl:p-20 flex flex-col justify-end">
          <p className="max-w-md font-serif text-3xl md:text-4xl lg:text-[2.5rem] font-medium leading-[1.15] text-white/95 text-balance">
            A seamless workspace to manage your real estate.
          </p>
          <div className="mt-8 flex items-center gap-4">
            <div className="h-px w-8 bg-white/30" />
            <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-white/70">
              RentFlow · Property Management
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
