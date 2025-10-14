import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Auth/Login";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import ResetPassword from "./pages/Auth/ResetPassword";
import DashboardLayout from "./layouts/DashboardLayout";
import Navbar from "./components/Navbar";
import { Toaster } from "react-hot-toast";
import Dashboard from "./pages/Dashboard";

export default function App() {
  return (
    <>
      {/* Toast container */}
      <Toaster />

      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* <Route element={<DashboardLayout />}> */}
            <Route path="/dashboard" element={<Dashboard />} />
          {/* </Route> */}

          <Route path="*" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
