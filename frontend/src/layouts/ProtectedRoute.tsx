import { Navigate, useLocation } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
import { FaSpinner } from "react-icons/fa";

const ProtectedRoute = ({ element }: { element: React.ReactElement }) => {
  const { isLoggedIn,isAuthLoading } = useAppContext();
  const location = useLocation();

  if (isAuthLoading) {
    return  (<div className="fixed inset-0 bg-slate-100 bg-opacity-50 flex items-center justify-center z-50">
    <div className="text-center">
      <FaSpinner className="animate-spin text-4xl text-white mb-2" />
    </div>
  </div>
    )
  };
  return isLoggedIn ? element : <Navigate to="/sign-in" state={{ from: location }} replace />;
};

export default ProtectedRoute;
