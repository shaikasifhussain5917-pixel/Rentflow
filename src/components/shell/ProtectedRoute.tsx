import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { BrandMark } from "./BrandMark";

export function ProtectedRoute() {
  const { user, profile, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-canvas)]">
        <div className="flex flex-col items-center gap-4">
          <BrandMark />
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--color-accent)] border-t-transparent" />
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (profile && !profile.setup_completed && location.pathname !== "/setup") {
    return <Navigate to="/setup" replace />;
  }

  if (profile && profile.setup_completed && location.pathname === "/setup") {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
