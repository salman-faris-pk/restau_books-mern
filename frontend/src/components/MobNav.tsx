import { FaHome } from "react-icons/fa";
import { Link } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaCheckToSlot } from "react-icons/fa6";
import { PiBuildingApartmentFill } from "react-icons/pi";
import { FaUser } from "react-icons/fa";




const MobNav = () => {
  return (
    <div className="fixed bottom-0 w-full h-16 py-2 bg-white flex items-center justify-around z-40 md:hidden rounded-t-md shadow-lg"   style={{ transform: 'translateZ(0)' }}>
      <Link to="/" className="flex flex-col items-center gap-1">
        <FaHome className="text-lg text-gray-700" />
        <span className="text-xs text-gray-700">Home</span>
      </Link>

      <Link to="/my-bookings" className="flex flex-col items-center gap-1">
        <FaCheckToSlot className="text-lg  text-gray-700" />
        <span className="text-xs text-gray-700">Bookings</span>
      </Link>

      <Link to="/my-hotels" className="flex flex-col items-center gap-1">
        <PiBuildingApartmentFill className="text-lg  text-gray-700" />
        <span className="text-xs text-gray-700">My Hotels</span>
      </Link>

      <Link to="/profile" className="flex flex-col items-center gap-1">
        <FaUser className="text-lg  text-gray-700" />
        <span className="text-xs text-gray-700">Account</span>
      </Link>

      <Link to="/settings" className="flex flex-col items-center gap-1">
        <GiHamburgerMenu className="text-lg  text-gray-700"/>
        <span className="text-xs text-gray-700">Menu</span>
      </Link>
    </div>
  );
};

export default MobNav;
