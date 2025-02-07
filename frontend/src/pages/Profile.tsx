import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as apiClient from "../api/api-client"
import { useAppContext } from "../contexts/AppContext";

export interface UserProfileResponse {
  firstname: string;
  lastname: string;
  email: string;
  productCount: number;
  bookingsCount: number;
}



const Profile = () => {
 

    const queryClient = useQueryClient();
    const { showToast }=useAppContext();

    const {data:user,isLoading}=useQuery({
      queryKey:["userprofile"],
      queryFn:()=> apiClient.userProfile(),
      staleTime: 1000 * 60 * 5,
    });
    
    
   const mutation=useMutation({
    mutationFn: apiClient.SignOut,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["validateToken"]});
      showToast({ message: "Signed Out!", type: "SUCCESS" });
    },
    onError: (error: Error) => {
      showToast({ message: error.message, type: "ERROR" });
    },

  });

  const handleLogout = () => {
    mutation.mutate();
    const keysToRemove = ["destination", "checkIn", "checkOut","adultCount","childCount"];
    keysToRemove.forEach((key) => sessionStorage.removeItem(key));
  };

  if(isLoading){
    return(
      <div className="text-gray-500">Loading...</div>
    )
  }


  return (
    <div className="flex items-center justify-center p-12">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full -mt-7">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Profile</h1>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <p className="mt-1 text-lg text-gray-900">{user?.firstname} {user?.lastname}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <p className="mt-1 text-lg text-gray-900">{user?.email}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">My Products</label>
            <p className="mt-1 text-lg text-gray-900">{user?.productCount}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">My Bookings</label>
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
    </div>
  );
};

export default Profile;