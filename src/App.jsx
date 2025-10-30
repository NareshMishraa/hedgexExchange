import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Auth/Login";
import { ForgotPasswordModal } from "./pages/Auth/ForgotPasswordModal";
import Navbar from "./components/Navbar";
import { Toaster } from "react-hot-toast";
import { MigrationDashboard } from "./pages/Auth/MigrationDashboard";
import { VideoKYC } from "./pages/Auth/VideoKYC";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import NotFoundRedirect from "./components/NotFoundRedirect";

export default function App() {
  return (
    <>
      <Toaster />
      <BrowserRouter>
        <Navbar />

        <Routes>
          {/* PUBLIC ROUTES */}
          <Route
            path="/"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <PublicRoute>
                <ForgotPasswordModal />
              </PublicRoute>
            }
          />
          

          {/* PROTECTED ROUTES */}
          <Route
            path="/migrationDashboard"
            element={
              <ProtectedRoute>
                <MigrationDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/videoKyc"
            element={
              <ProtectedRoute>
                <VideoKYC />
              </ProtectedRoute>
            }
          />

          {/* SMART FALLBACK */}
          <Route path="*" element={<NotFoundRedirect />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
