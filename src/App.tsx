import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { PortfolioProvider } from "./data/PortfolioContext";
import { AuthProvider } from "./contexts/AuthContext";
import { AppShell } from "./components/shell/AppShell";
import { ProtectedRoute } from "./components/shell/ProtectedRoute";
import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import Properties from "./pages/Properties";
import PropertyDetail from "./pages/PropertyDetail";
import Tenants from "./pages/Tenants";
import TenantDetail from "./pages/TenantDetail";
import Payments from "./pages/Payments";
import Activity from "./pages/Activity";
import Vacant from "./pages/Vacant";
import RentHistory from "./pages/RentHistory";
import Settings from "./pages/Settings";

export default function App() {
  return (
    <AuthProvider>
      <PortfolioProvider>
        <HashRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route element={<ProtectedRoute />}>
              <Route element={<AppShell />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/properties" element={<Properties />} />
                <Route path="/properties/:propertyId" element={<PropertyDetail />} />
                <Route path="/tenants" element={<Tenants />} />
                <Route path="/tenants/:tenantId" element={<TenantDetail />} />
                <Route path="/payments" element={<Payments />} />
                <Route path="/activity" element={<Activity />} />
                <Route path="/vacant" element={<Vacant />} />
                <Route path="/rent-history" element={<RentHistory />} />
                <Route path="/settings" element={<Settings />} />
              </Route>
            </Route>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </HashRouter>
      </PortfolioProvider>
    </AuthProvider>
  );
}
