import React, { createContext, useContext, useState, useEffect } from "react";
import authServices from "../api/auth-services";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  // const [userSpecialty, setUserSpecialty] = useState(null);
  const [userRoles, setUserRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentCampDetails, setCurrentCampDetails] = useState(null);

  const saveAuthData = (authData) => {
    setUser(authData.user);
    setIsAuthenticated(true);
    setUserRoles(authData.user.roles.map((role) => role.roleName));
    const permissionsArray = authData.user.roles?.reduce((acc, role) => {
      // Check if the role has permissions and add them to the accumulator array
      if (role.permissions) {
        acc.push(...role.permissions);
      }
      return acc;
    }, []); 
    // Now set the permissions to the state
    setPermissions(permissionsArray);
    setCurrentCampDetails(
      authData?.user?.camps.find(
        (eachCamp) => eachCamp.id == authData?.user.currentCampId
      ) || null
    );
    // setUserSpecialty(authData.user.specialties[0].id);
    localStorage.setItem("accessToken", authData?.tokens?.access?.token);
    localStorage.setItem("refreshToken", authData?.tokens?.refresh?.token);
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      const data = await authServices.login(email, password);
      console.log("Inside the Auth provider login function --> ",data);
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
      const permissionsArray = data.user.roles?.reduce((acc, role) => {
        // Check if the role has permissions and add them to the accumulator array
        if (role.permissions) {
          acc.push(...role.permissions);
        }
        return acc;
      }, []);

      // Now set the permissions to the state
      setPermissions(permissionsArray);
      setIsAuthenticated(true);
      if (data.user.currentCampId && data.user?.camps.length > 0) {
        setCurrentCampDetails(
          data.user?.camps.find(
            (eachCamp) => eachCamp.id.trim() == data.user.currentCampId.trim()
          ) || null
        );
      } else {
        setCurrentCampDetails(null);
      }
    } catch (error) {
      console.error("Failed to restore user:", error.message);
      setIsAuthenticated(false);
      setUser(null);
      setUserRoles([]);
      setPermissions([]);
      setCurrentCampDetails(null);
      if (error.response?.status === 401 && refreshToken) {
        try {
          const newTokens = await authServices.refreshAccessToken(
            refreshToken,
            accessToken
          );
          console.log("newTokens: ", newTokens);
          saveAuthData(newTokens);
        } catch (refreshError) {
          console.error("Token refresh failed:", refreshError.message);
          logout();
        }
      }
    } finally {
      setLoading(false);
      console.log("called initializeAuth function");
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
        permissions,
        initializeAuth,
        currentCampDetails,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthProvider;
