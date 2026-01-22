import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

/**
 * AdminRoute
 * - Requires an authenticated user
 * - Requires user metadata role === "admin" (fallback: admin email)
 *
 * Note: This is a UI guard. You must still enforce authorization with Supabase RLS on the backend.
 */
export default function AdminRoute({ children }) {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  const role = user?.user_metadata?.role;
  const isAdmin = role === "admin" || String(user?.email || "").toLowerCase() === "admin@gmail.com";

  if (!isAdmin) {
    // Non-admins are not allowed to access the admin dashboard.
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

