import { useAppContext } from "../contexts/AppContext"
import * as apiClient from "../api/api-client"
import { useMutation } from "@tanstack/react-query";
import ManageHotelForm from "../forms/managehotelForm/ManageHotelForm";


const AddHotel = () => {

    const { showToast }=useAppContext();

    const { mutate,isPending}=useMutation({
        mutationFn: apiClient.addMyHote,
        onSuccess: ()=> {
            showToast({ message: "Hotel Saved!", type: "SUCCESS" });
        },
        onError: ()=>{
            showToast({ message: "Error Saving Hotel", type: "ERROR" });
        }
    });


    const handleSave=(hotelFormData: FormData)=> {
        mutate(hotelFormData)
    };
    

  return (
     <ManageHotelForm  onSave={handleSave} isLoading={isPending}/>
  )
}

export default AddHotel