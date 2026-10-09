import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { supabase } from "../lib/supabase";

export default function AuthCallback() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const processCallback = async () => {
      // Extract search params (Supabase puts PKCE code or errors in the search string, not hash)
      const searchParams = new URLSearchParams(window.location.search);
      const errorDesc = searchParams.get("error_description");
      const code = searchParams.get("code");

      // Clean the URL to prevent re-processing
      if (window.location.search) {
        window.history.replaceState(null, "", window.location.pathname + window.location.hash);
      }

      if (errorDesc) {
        if (mounted) setError(errorDesc.replace(/\+/g, " "));
        // Wait a moment then go to login with error
        setTimeout(() => {
          if (mounted) navigate("/login?error_description=" + encodeURIComponent(errorDesc), { replace: true });
        }, 2000);
        return;
      }

      if (code || !searchParams.has("error")) {
        // Wait briefly for Supabase's internal auto-exchange to complete
        setTimeout(async () => {
          if (!mounted) return;
          const { data: { session } } = await supabase.auth.getSession();
          if (session) {
            // PKCE succeeded on the same device
            navigate("/dashboard", { replace: true });
          } else {
            // PKCE likely failed (e.g. opened on phone instead of desktop).
            // However, the token was valid enough to reach here without an error in the URL,
            // which means the Supabase server verified the email successfully!
            // We just need them to sign in manually.
            navigate("/login?verified=true", { replace: true });
          }
        }, 1500);
      } else {
        // Fallback for unknown states
        navigate("/login", { replace: true });
      }
    };

    processCallback();

    return () => {
      mounted = false;
    };
  }, [navigate]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--color-canvas)] p-6">
      <div className="flex max-w-sm flex-col items-center text-center">
        {error ? (
          <>
            <div className="mb-4 rounded-full bg-red-100 p-3">
              <div className="size-6 text-red-600">!</div>
            </div>
            <h2 className="text-lg font-semibold text-[var(--color-ink)]">Verification Failed</h2>
            <p className="mt-2 text-[14px] text-[var(--color-ink-soft)]">{error}</p>
          </>
        ) : (
          <>
            <Loader2 className="mb-4 size-8 animate-spin text-[var(--color-accent)]" />
            <h2 className="text-lg font-semibold text-[var(--color-ink)]">Verifying your email</h2>
            <p className="mt-2 text-[14px] text-[var(--color-ink-soft)]">Please wait while we confirm your access...</p>
          </>
        )}
      </div>
    </div>
  );
}
