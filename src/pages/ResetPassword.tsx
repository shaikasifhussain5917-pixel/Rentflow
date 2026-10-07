import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { BrandMark } from "../components/shell/BrandMark";
import { Button } from "../components/ui/Button";
import { Field, TextInput } from "../components/ui/Field";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      
      setMessage("Password successfully updated. You can now log in with your new password.");
      
    } catch (err: any) {
      setError(err.message || "An error occurred while updating the password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen bg-[var(--color-canvas)] lg:grid-cols-[1fr_1.05fr]">
      <div className="flex items-center justify-center px-6 py-12 sm:px-10">
        <div className="animate-fade-rise w-full max-w-sm">
          <BrandMark className="mb-8" />
          <h1 className="text-2xl font-bold tracking-tight text-[var(--color-ink)]">
            Reset password
          </h1>
          <p className="mt-2 text-[14px] text-[var(--color-ink-soft)]">
            Enter your new password below.
          </p>

          <form onSubmit={handleReset} className="mt-8 space-y-5">
            <Field label="New password">
              <TextInput
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </Field>
            <Field label="Confirm new password">
              <TextInput
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
              />
            </Field>

            {error && (
              <div className="rounded-lg bg-[var(--color-critical)]/10 p-3 text-[13px] text-[var(--color-critical)]">
                {error}
              </div>
            )}
            
            {message && (
              <div className="rounded-lg bg-green-50 p-3 text-[13px] text-green-700">
                {message}
              </div>
            )}

            {!message ? (
              <Button type="submit" className="w-full justify-center" disabled={isLoading}>
                {isLoading ? "Updating..." : "Update password"}
              </Button>
            ) : (
              <Button
                type="button"
                variant="secondary"
                className="w-full justify-center"
                onClick={() => navigate("/login")}
              >
                Back to login
              </Button>
            )}
          </form>
        </div>
      </div>
      
      {/* Decorative panel */}
      <div className="hidden bg-[var(--color-surface)] lg:block" />
    </div>
  );
}
