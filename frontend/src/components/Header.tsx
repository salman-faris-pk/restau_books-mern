import { Link, useLocation } from "react-router-dom";
import SignOutButton from "./SignOutButton";
import { useAppContext } from "../contexts/AppContext";


const Header = () => {
  const location = useLocation();
  const { isLoggedIn } = useAppContext();

  return (
    <div className="bg-blue-800 py-6">
        <div className="md:container mx-auto flex justify-between px-2">
        <span className="text-2xl  md:text-3xl text-white font-bold tracking-tight">
          <Link to="/">HolidayFeast.com</Link>
        </span>

        <span className="flex space-x-2">
        {isLoggedIn ? (
            <>
              <Link
                className="hidden md:flex items-center text-white px-3 font-bold hover:bg-blue-600 hover:rounded-sm"
                to="/my-bookings"
              >
                My Bookings
              </Link>
              <Link
                className="hidden md:flex items-center text-white px-3 font-bold hover:bg-blue-600 hover:rounded-sm"
                to="/my-hotels"
              >
                My Hotels
              </Link>
              <Link
                className="hidden md:flex items-center text-white px-3 font-bold hover:bg-blue-600 hover:rounded-sm"
                to="/profile"
              >
                Profile
              </Link>

              <SignOutButton />
              
            </>
          ) : (
            <Link
              to="/sign-in"  state={{ from: location.pathname }}
              className="flex bg-white items-center text-sm text-blue-600 px-3 font-bold hover:bg-gray-100 rounded-sm"
            >
              Sign In
            </Link>
          )}

        </span>
     </div>
        

    </div>
  )
}

export default Header