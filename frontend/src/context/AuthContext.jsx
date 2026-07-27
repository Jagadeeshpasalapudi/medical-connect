import { createContext, useContext, useEffect, useState } from "react";

import API from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const register = async (userData) => {
    const response = await API.post("/auth/register", userData);

    const { token, user } = response.data;

    localStorage.setItem("mediconnect_token", token);

    setUser(user);

    return response.data;
  };

  const login = async (email, password) => {
    const response = await API.post("/auth/login", {
      email,
      password,
    });

    const { token, user } = response.data;

    localStorage.setItem("mediconnect_token", token);

    setUser(user);

    return response.data;
  };

  const logout = () => {
    localStorage.removeItem("mediconnect_token");

    setUser(null);
  };

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("mediconnect_token");

      if (!token) {
        setLoading(false);
        return;
      }

      const response = await API.get("/auth/me");

      setUser(response.data.user);
    } catch (error) {
      localStorage.removeItem("mediconnect_token");

      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        register,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
