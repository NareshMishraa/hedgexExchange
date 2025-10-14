// src/context/AuthContext.jsx
import { createContext, useState, useEffect } from "react";
import { loginAPI, logoutAPI } from "../api/auth";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    // Load user from localStorage if available
    const token = localStorage.getItem("token");
    return token ? { token } : null;
  });

  const login = async (email, password) => {
    const userData = await loginAPI(email, password);
    setUser(userData);
    localStorage.setItem("token", userData.token); // store token
  };

  const logout = async () => {
    await logoutAPI();
    setUser(null);
    localStorage.removeItem("token");
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}
