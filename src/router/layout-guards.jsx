import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../utilities/AuthProvider";
import AccessDenied from "../views/extra-pages/access-denied";
import { Loading } from "../components/loading";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (!isAuthenticated && !loading) {
    // Redirect to sign-in if not authenticated
    return <Navigate to="/auth/sign-in" replace />;
  }

  if (loading) {
    return <Loading />;
  }
  return children;
};

const AuthGuard = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (isAuthenticated && !loading) {
    // Redirect to dashboard if authenticated
    return <Navigate to="/" replace />;
  }
  if (loading) {
    return <Loading />;
  }
  return children;
};

const SuperadminRouteGuard = ({ allowedRoles, children }) => {
  const { user, userRoles } = useAuth();

  if (!user) {
    return <Navigate to="/auth/sign-in" replace />;
  }

  const hasAccess = allowedRoles.some((role) => userRoles.includes(role));

  if (!hasAccess) {
    return <AccessDenied />;
  }
  console.log("returning the outlet");
  return children;
};

const ClinicRouteGuard = ({ allowedRoles, children }) => {
  const { user, userRoles } = useAuth();

  if (!user) {
    return <Navigate to="/auth/sign-in" replace />;
  }

  const hasAccess = allowedRoles.some((role) => userRoles.includes(role));

  if (!hasAccess) {
    return <AccessDenied />;
  }
  console.log("returning the outlet");
  return children;
};

export { ProtectedRoute, AuthGuard, SuperadminRouteGuard, ClinicRouteGuard };
