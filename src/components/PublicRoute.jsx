import { Navigate } from "react-router-dom";
import { STORAGES } from "./Store";
import localStore from "./localStore";

const PublicRoute = ({ children }) => {
  const token = localStore.getItem(STORAGES.TOKEN);

  if (token) {
    // User is already logged in → redirect to migrationDashboard
    return <Navigate to="/migrationDashboard" replace />;
  }

  // No token → allow access to login/forgot-password
  return children;
};

export default PublicRoute;
