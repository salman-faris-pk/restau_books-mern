import { Navigate, useLocation } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";

const ProtectedRoute = ({ element }: { element: JSX.Element }) => {
  const { isLoggedIn } = useAppContext();
  const location = useLocation();

  return isLoggedIn ? element : <Navigate to="/sign-in" state={{ from: location }} replace />;
};

export default ProtectedRoute;
