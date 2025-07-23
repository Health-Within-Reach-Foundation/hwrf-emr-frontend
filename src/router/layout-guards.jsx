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

const ClinicRouteGuard = ({ requiredPermissions, children }) => {
  const { user, userRoles } = useAuth();

  // Redirect to sign-in if the user is not logged in
  if (!user) {
    return <Navigate to="/auth/sign-in" replace />;
  }

  // Check if the user is an admin (admin has full access)
  const isAdmin = userRoles.some((role) => role === "admin");
  if (isAdmin) {
    return children; // Admins bypass all permission checks
  }

  // Check if any role has the required permissions
  const hasAccess = user?.roles?.some((role) =>
    role.permissions.some((permission) =>
      requiredPermissions.includes(permission.action)
    )
  );

  // Deny access if no matching permissions are found
  if (!hasAccess) {
    return <AccessDenied />;
  }

  // Allow access if the user has at least one required permission
  return children;
};

export { ProtectedRoute, AuthGuard, SuperadminRouteGuard, ClinicRouteGuard };
