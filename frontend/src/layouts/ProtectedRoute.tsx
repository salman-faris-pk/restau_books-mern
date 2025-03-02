import { Navigate, useLocation } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";

const ProtectedRoute = ({ element }: { element: React.ReactElement }) => {
  const { isLoggedIn } = useAppContext();
  const location = useLocation();

  if (isLoggedIn === undefined) return null;

  return isLoggedIn ? element : <Navigate to="/sign-in" state={{ from: location }} replace />;
};

export default ProtectedRoute;
