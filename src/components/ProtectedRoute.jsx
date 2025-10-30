// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { STORAGES } from "./Store";
import localStore from "./localStore";

const ProtectedRoute = ({ children }) => {
  const token = localStore.getItem(STORAGES.TOKEN);

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
