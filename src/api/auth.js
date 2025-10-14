import axiosClient from "./axiosclient";

/**
 * Login user
 */
export const loginAPI = async (email, password) => {
  const res = await axiosClient.post("/auth/login", { email, password });
  // Save token or handle response
  localStorage.setItem("token", res.data.token);
  return res.data.user;
};

/**
 * Send reset password email
 */
export const sendResetEmail = async (email) => {
  const res = await axiosClient.post("/auth/forgot-password", { email });
  return res.data;
};

/**
 * Reset password with token
 */
export const resetPassword = async (token, newPassword) => {
  const res = await axiosClient.post(`/auth/reset-password/${token}`, {
    password: newPassword,
  });
  return res.data;
};

/**
 * Logout
 */
export const logoutAPI = async () => {
  localStorage.removeItem("token");
  return true;
};
