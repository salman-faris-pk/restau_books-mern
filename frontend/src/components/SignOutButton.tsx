import { useMutation, useQueryClient } from "@tanstack/react-query"
import * as apiClient from "../api/api-client"
import { useAppContext } from "../contexts/AppContext";


const SignOutButton = () => {

  const queryClient = useQueryClient();
  const { showToast }=useAppContext();

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

    const handleClick = () => {
      mutation.mutate();
      const keysToRemove = ["destination", "checkIn", "checkOut","adultCount","childCount"];
      keysToRemove.forEach((key) => sessionStorage.removeItem(key));
    };


  return (
      <button className="text-blue-600 text-sm px-3 font-bold bg-white hover:bg-gray-100 rounded-sm"
      onClick={handleClick}
      >
      Sign Out
    </button>
  )
}

export default SignOutButton