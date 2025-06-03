import { memo } from "react";
import { CiBookmark } from "react-icons/ci";
import { IoBookmark } from "react-icons/io5";

const WishlistButton = memo(({isUpdating,isInWishlist,onClick}: {
  isUpdating: boolean;
  isInWishlist: boolean;
  onClick: () => void;
}) => {

  if (isUpdating) {
    return (
      <div className="flex items-center justify-center w-10 h-10">
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
      </div>
    );
  };

  
  return isInWishlist ? (
    <IoBookmark
      size={42}
      onClick={onClick}
      className="text-blue-500 hover:text-blue-700 transition-colors cursor-pointer"
    />
  ) : (
    <CiBookmark
      size={42}
      onClick={onClick}
      className="hover:text-blue-500 transition-colors cursor-pointer"
    />
  );
});

export default WishlistButton;