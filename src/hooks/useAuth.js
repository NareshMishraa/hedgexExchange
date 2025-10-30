// hooks/useAuth.js
import { useState, useEffect } from "react";
import { useUserLoginMutation } from "../api/authApi";
import localStore from "../components/localStore";
import { STORAGES } from "../components/Store";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [userLogin, { isLoading: isLoggingIn }] = useUserLoginMutation();

  // Initialize user from localStorage on mount
  useEffect(() => {
    const token = localStore.getItem(STORAGES.TOKEN);
    const email = localStore.getItem(STORAGES.REMEMBERED_EMAIL);
    
    if (token && email) {
      setUser({ token, email });
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await userLogin({ email, password }).unwrap();
      
      // Store token and email in localStorage
      // localStore.setItem(STORAGES.TOKEN, response.token);
      // localStore.setItem(STORAGES.REMEMBERED_EMAIL, email);
      
      setUser({ token: response.token, email });
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    // Clear localStorage
    localStore.removeItem(STORAGES.TOKEN);
    localStore.removeItem(STORAGES.EMAIL);
    // localStore.removeItem(STORAGES.REFERRAL_CODE);
    
    setUser(null);
  };

  const isAuthenticated = !!user?.token;

  return { 
    user, 
    login, 
    logout, 
    isAuthenticated, 
    isLoggingIn 
  };
}