import { Navigate } from "react-router-dom";
import { STORAGES } from "./Store";
import localStore from "./localStore";

const NotFoundRedirect = () => {
  const token = localStore.getItem(STORAGES.TOKEN);

  if (token) {
    // If user is logged in → redirect to dashboard
    return <Navigate to="/migrationDashboard" replace />;
  }

  // If not logged in → redirect to login
  return <Navigate to="/" replace />;
};

export default NotFoundRedirect;
