import React, { createContext, useContext, useState, useEffect } from "react";
import authServices from "../api/auth-services";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  // const [userSpecialty, setUserSpecialty] = useState(null);
  const [userRoles, setUserRoles] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentCampDetails, setCurrentCampDetails] = useState(null);

  const saveAuthData = (authData) => {
    setUser(authData.user);
    setIsAuthenticated(true);
    setUserRoles(authData.user.roles.map((role) => role.roleName));
    setCurrentCampDetails(
      authData?.user?.camps.find(
        (eachCamp) => eachCamp.id == authData?.user.currentCampId
      ) || null
    );
    // setUserSpecialty(authData.user.specialties[0].id);
    localStorage.setItem("accessToken", authData.tokens.access.token);
    localStorage.setItem("refreshToken", authData.tokens.refresh.token);
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      const data = await authServices.login(email, password);
      console.log(data);
      saveAuthData(data);
      setLoading(false);
      return data;
    } catch (error) {
      console.error("Login failed:", error.message);
      setLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) await authServices.logout(refreshToken);

      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setLoading(false);
      window.location.href = "/auth/sign-in";
    } catch (error) {
      setLoading(false);
      console.error("Logout failed:", error.message);
    }
  };

  const initializeAuth = async () => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    if (!accessToken || !refreshToken) {
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await authServices.getUser();
      setUser(data.user);
      setUserRoles(data.user.roles.map((role) => role.roleName));

      setIsAuthenticated(true);
      setCurrentCampDetails(
        data.user?.camps.find(
          (eachCamp) => eachCamp.id.trim() == data.user.currentCampId.trim()
        ) || null
      );
      console.log(
        data.user?.camps.find(
          (eachCamp) => eachCamp.id.trim() == data.user?.currentCampId.trim()
        ) || null
      );
    } catch (error) {
      console.error("Failed to restore user:", error.message);
      setIsAuthenticated(false);
      setUser(null);
      setUserRoles([]);
      setCurrentCampDetails(null);
      if (error.response?.status === 401 && refreshToken) {
        try {
          const newTokens = await authServices.refreshAccessToken(refreshToken);
          saveAuthData(newTokens);
        } catch (refreshError) {
          console.error("Token refresh failed:", refreshError.message);
          logout();
        }
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initializeAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        logout,
        loading,
        userRoles,
        initializeAuth,
        currentCampDetails
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthProvider;
