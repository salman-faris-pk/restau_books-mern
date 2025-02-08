import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as apiClient from "../api/api-client";
import { useAppContext } from "../contexts/AppContext";
import { AiFillStar } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

export interface UserProfileResponse {
  firstname: string;
  lastname: string;
  email: string;
  productCount: number;
  bookingsCount: number;
}

export interface WishlistItem {
  hotelId: {
    _id: string;
    name: string;
    starRating: number;
    type: string;
    imageUrls: string[];
  };
}

const Profile = () => {
  const queryClient = useQueryClient();
  const { showToast } = useAppContext();
  const navigate=useNavigate();

  const { data: user, isLoading } = useQuery({
    queryKey: ["userprofile"],
    queryFn: apiClient.userProfile,
    staleTime: 1000 * 60 * 5,
  });

  const { data: wishlist } = useQuery({
    queryKey: ["wishlist"],
    queryFn: apiClient.Wishlist,
  });

  const mutation = useMutation({
    mutationFn: apiClient.SignOut,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["validateToken"] });
      showToast({ message: "Signed Out!", type: "SUCCESS" });
    },
    onError: (error: Error) => {
      showToast({ message: error.message, type: "ERROR" });
    },
  });

  const { mutate: removeFromWishlist } = useMutation({
    mutationFn: (hotelId: string) => apiClient.removeWishlist(hotelId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      queryClient.invalidateQueries({queryKey:["fetchStatus"]});
      showToast({ message: "Removed from wishlist!", type: "SUCCESS" });
    },
    onError: () => {
      showToast({ message: "Failed to remove from wishlist!", type: "ERROR" });
    },
  });

  const handleLogout = () => {
    mutation.mutate();
    const keysToRemove = ["destination","checkIn","checkOut","adultCount","childCount"];
    keysToRemove.forEach((key) => sessionStorage.removeItem(key));
  };

  if (isLoading) {
    return <div className="text-gray-500">Loading...</div>;
  }

  return (
    <div className="flex flex-col md:flex-row p-5 md:p-12 gap-10">
      {/* Profile Card */}
      <div className="bg-white h-fit shadow-md rounded-lg p-8 max-w-md w-full -mt-7">
        <h1 className="text-2xl font-bold text-gray-500 mb-6">Profile</h1>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <p className="mt-1 text-lg text-gray-900">
              {user?.firstname} {user?.lastname}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <p className="mt-1 text-lg text-gray-900">{user?.email}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              My Products
            </label>
            <p className="mt-1 text-lg text-gray-900">{user?.productCount}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              My Bookings
            </label>
            <p className="mt-1 text-lg text-gray-900">{user?.bookingsCount}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="mt-8 w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
        >
          Logout
        </button>
      </div>

      {/* Wishlist Section */}
      <div className="px-2 py-10 md:-mt-7 min-h-[24rem] max-h-screen md:max-h-[500px] overflow-y-auto">
        <h1 className="text-2xl font-bold text-gray-500 mb-6">-- Saved List --</h1>

        {wishlist?.length ? (
          wishlist?.map((item) => (
            <div
              key={item.hotelId._id}
              className="grid grid-cols-1 md:grid-cols-[1fr_3fr_1fr] p-2 border-b mt-3"
            >
              {/* Image */}
              <div className="flex items-center justify-center" onClick={()=> navigate(`/detail/${item.hotelId._id}`)}>
                <img
                  src={item.hotelId.imageUrls[0]}
                  alt={item.hotelId.name}
                  className="w-28 h-24 object-cover rounded-lg"
                />
              </div>

              {/* Hotel Info */}
              <div className="flex flex-col px-3 items-center justify-center">
                <p className="text-lg font-semibold cursor-pointer" onClick={()=> navigate(`/detail/${item.hotelId._id}`)}>{item.hotelId.name}</p>
                <p className="text-gray-600">{item.hotelId.type}</p>
                <span className="flex">
                  {Array.from({ length: item.hotelId.starRating }).map(
                    (_, index) => (
                      <AiFillStar className="fill-yellow-400" key={index} />
                    )
                  )}
                </span>
              </div>

              {/* Remove Button */}
              <div className="flex items-center justify-center">
                <button
                  onClick={() => removeFromWishlist(item.hotelId._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition w-full"
                >
                  Remove
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center mt-4">No saved items.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;

