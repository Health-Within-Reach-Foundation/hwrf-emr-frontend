// import React from "react";
// import { Navigate } from "react-router-dom";
// import { useAuth } from "../utilities/AuthProvider";
// import { DefaultRoute, BlankLayoutRouter } from "./default-router";
// import { Loading } from "../components/loading";

// const ProtectedRoute = ({ children }) => {
//     const { isAuthenticated, loading } = useAuth();

//     if (loading) {
//       return <Loading />; // Show a loading spinner while auth state is initializing
//     }

//     if (!isAuthenticated && !loading) {
//       return <Navigate to="/auth/sign-in" />; // Redirect if not authenticated
//     }

//     // if (isAuthenticated && !loading) {
//     //     // Redirect to the dashboard or home page if already authenticated
//     //     return <Navigate to="/" />;
//     //   }

//     return children;
//   };

// // Secure routes
// const SecuredDefaultRoute = DefaultRoute.map((route) => ({
//   ...route,
//   element: <ProtectedRoute>{route.element}</ProtectedRoute>,
// }));

// export const LayoutsRoute = [...SecuredDefaultRoute, ...BlankLayoutRouter];

import React from "react";
import { DefaultRoute, BlankLayoutRouter } from "./default-router";
import { useAuth } from "../utilities/AuthProvider";
import DefaultLayout from "../layouts/defaultLayout";
import BlankLayout from "../layouts/blank-layout";
import { Navigate } from "react-router-dom";
import { Loading } from "../components/loading";
import { AuthGuard, ProtectedRoute } from "./layout-guards";



export const LayoutsRoute = [
  // Default Routes (protected)
  {
    path: "",
    element: (
      <ProtectedRoute>
        <DefaultLayout />
      </ProtectedRoute>
    ),
    children: DefaultRoute[0].children,
  },

  // Auth Routes (public)
  {
    path: "",
    element: (
      <AuthGuard>
        <BlankLayout />
      </AuthGuard>
    ),
    children: BlankLayoutRouter[0].children,
  },

    
];
