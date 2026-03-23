import React, { createContext, useContext, useState, useEffect } from 'react';
import authServices from '../api/auth-services';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userRoles, setUserRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentCampDetails, setCurrentCampDetails] = useState(null);

  const saveAuthData = (authData) => {
    setUser(authData.user);
    setIsAuthenticated(true);

    // ✅ safely handle missing roles
    const roles = authData.user.roles || [];
    setUserRoles(roles.map((role) => role.roleName));

    const permissionsArray = roles.reduce((acc, role) => {
      if (role.permissions) acc.push(...role.permissions);
      return acc;
    }, []);
    setPermissions(permissionsArray);

    // ✅ safely handle missing camps
    const camps = authData.user.camps || [];
    setCurrentCampDetails(
      camps.find((eachCamp) => eachCamp.id == authData?.user.currentCampId) || null
    );

    localStorage.setItem('accessToken', authData?.tokens?.access?.token);
    localStorage.setItem('refreshToken', authData?.tokens?.refresh?.token);
  };

  // Step 1: email + password → may return otpRequired or full auth data
  const login = async (email, password) => {
    try {
      const data = await authServices.login(email, password);
      console.log('Inside the Auth provider login function --> ', data);

      // Production: OTP required — do NOT save auth yet, just return to sign-in
      if (data?.otpRequired) {
        return data;
      }

      // Development: direct login (no OTP)
      saveAuthData(data);
      return data;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  // ✅ Step 2: verify OTP → get full tokens and save auth
  const verifyOtp = async (preAuthToken, otp) => {
    try {
      const data = await authServices.verifyOtp(preAuthToken, otp);
      console.log('Inside the Auth provider verifyOtp function --> ', data);

      // Save tokens first so getUser() can use them
      localStorage.setItem('accessToken', data?.tokens?.access?.token);
      localStorage.setItem('refreshToken', data?.tokens?.refresh?.token);

      // Fetch full user data with all associations
      const fullUserData = await authServices.getUser();
      saveAuthData({ user: fullUserData.user, tokens: data.tokens });

      return data;
    } catch (error) {
      console.error('OTP verification failed:', error);
      // ✅ Clean up any partial tokens so initializeAuth doesn't redirect
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      // ✅ Re-throw with a clean message
      const message = error?.message || error?.error || 'Invalid or expired OTP';
      throw new Error(message);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) await authServices.logout(refreshToken);

      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setLoading(false);
      window.location.href = '/auth/sign-in';
    } catch (error) {
      setLoading(false);
      console.error('Logout failed:', error.message);
    }
  };

  const initializeAuth = async () => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    if (!accessToken || !refreshToken) {
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await authServices.getUser();
      console.log('Inside the Auth provider initializeAuth function --> ', data);
      setUser(data.user);
      setUserRoles(data.user.roles.map((role) => role.roleName));
      const permissionsArray = data.user.roles?.reduce((acc, role) => {
        if (role.permissions) {
          acc.push(...role.permissions);
        }
        return acc;
      }, []);
      setPermissions(permissionsArray);
      setIsAuthenticated(true);
      if (data.user.currentCampId && data.user?.camps.length > 0) {
        setCurrentCampDetails(
          data.user?.camps.find((eachCamp) => eachCamp.id.trim() == data.user.currentCampId.trim()) || null
        );
      } else {
        setCurrentCampDetails(null);
      }
    } catch (error) {
      console.error('Failed to restore user:', error);
      setIsAuthenticated(false);
      setUser(null);
      setUserRoles([]);
      setPermissions([]);
      setCurrentCampDetails(null);
      if (error.response?.status === 401 && refreshToken) {
        try {
          const newTokens = await authServices.refreshAccessToken(refreshToken, accessToken);
          console.log('newTokens: ', newTokens);
          saveAuthData(newTokens);
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError.message);
          // ✅ Only logout if NOT already on auth pages
          if (!window.location.pathname.includes('/auth/')) {
            logout();
          }
        }
      }
    } finally {
      setLoading(false);
      console.log('called initializeAuth function');
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
        verifyOtp,
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
