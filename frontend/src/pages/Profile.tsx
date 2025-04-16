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
  earned: number;
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
  const navigate = useNavigate();

  const { data: user, isLoading } = useQuery({
    queryKey: ["userprofile"],
    queryFn: apiClient.userProfile,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });

  const { data: wishlist } = useQuery({
    queryKey: ["wishlist"],
    queryFn: apiClient.Wishlist,
  });

  const { mutate: removeFromWishlist } = useMutation({
    mutationFn: (hotelId: string) => apiClient.removeWishlist(hotelId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      showToast({ message: "Removed from wishlist", type: "SUCCESS" });
    },
    onError: () => {
      showToast({ message: "Failed to remove from wishlist!", type: "ERROR" });
    },
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

  const handleLogout = () => {
    mutation.mutate();
    const keysToRemove = ["destination", "checkIn", "checkOut", "adultCount", "childCount"];
    keysToRemove.forEach((key) => sessionStorage.removeItem(key));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
  <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
  <div className="max-w-7xl mx-auto">
    <h1 className="text-3xl font-light text-gray-800 mb-8 border-b pb-4">My Account</h1>

    <div className="flex flex-col lg:flex-row gap-8">
      {/* Profile Card*/}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden w-full lg:w-1/3 self-start">
        <div className="p-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="bg-blue-100 text-blue-600 rounded-full p-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-medium text-gray-800">{user?.firstname} {user?.lastname}</h2>
              <p className="text-gray-500">{user?.email}</p>
            </div>
          </div>

          <div className="space-y-4 border-t pt-6">
            <div className="flex justify-between">
              <span className="text-gray-600">My Products</span>
              <span className="font-medium">{user?.productCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Earnings</span>
              <span className="font-medium">{user?.earned ? `₹${user?.earned}` : "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">My Bookings</span>
              <span className="font-medium">{user?.bookingsCount}</span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="mt-8 w-full bg-gray-800 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors flex items-center justify-center space-x-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Sign Out</span>
          </button>
        </div>
      </div>
      
      {/**wishlist */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex-1">
        <div className="p-6 h-full flex flex-col">
          <h2 className="text-xl font-light text-gray-800 mb-6 border-b pb-2">Saved Properties</h2>

          <div className="flex-1 overflow-y-auto max-h-[1024px] md:max-h-[500px]">
            {wishlist?.length ? (
              <div className="divide-y divide-gray-200">
                {wishlist.map((item) => (
                  <div key={item.hotelId._id} className="py-4 flex flex-col sm:flex-row">
                    <div
                      className="flex-shrink-0 cursor-pointer mb-4 sm:mb-0"
                      onClick={() => navigate(`/detail/${item.hotelId._id}`)}
                    >
                      <img
                        src={item.hotelId.imageUrls[0]}
                        alt={item.hotelId.name}
                        className="w-full h-48 md:h-32 object-cover rounded-lg"
                      />
                    </div>

                    <div className="flex-grow sm:pl-4">
                      <div className="flex justify-between">
                        <div>
                          <h3
                            className="text-lg font-medium text-gray-800 cursor-pointer hover:text-blue-600"
                            onClick={() => navigate(`/detail/${item.hotelId._id}`)}
                          >
                            {item.hotelId.name}
                          </h3>
                          <p className="text-sm text-gray-500">{item.hotelId.type}</p>
                          <div className="flex mt-1">
                            {Array.from({ length: item.hotelId.starRating }).map((_, index) => (
                              <AiFillStar className="fill-yellow-400" key={index} />
                            ))}
                          </div>
                        </div>

                        <button
                          onClick={() => removeFromWishlist(item.hotelId._id)}
                          className="self-start text-red-500 hover:text-red-700 transition-colors"
                          title="Remove from wishlist"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-gray-700">Your wishlist is empty</h3>
                <p className="mt-1 text-gray-500">Save properties you like to see them here</p>
                <button
                  onClick={() => navigate("/search")}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Browse Properties
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
  );
};

export default Profile;



