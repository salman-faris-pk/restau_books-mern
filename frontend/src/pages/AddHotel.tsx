import { useAppContext } from "../contexts/AppContext"
import * as apiClient from "../api/api-client"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import ManageHotelForm from "../forms/managehotelForm/ManageHotelForm";
import { useState } from "react";


const AddHotel = () => {

    const { showToast }=useAppContext();
    const queriClient=useQueryClient();
    const [resetForm, setResetform] = useState<(() => void) | null>(null);

    const { mutate,isPending}=useMutation({
        mutationFn: apiClient.addMyHotel,
        onSuccess: ()=> {
            queriClient.invalidateQueries({queryKey:["fetchlatest"]})
            showToast({ message: "Hotel Saved!", type: "SUCCESS" });
            resetForm?.();
        },
        onError: ()=>{
            showToast({ message: "Error Saving Hotel", type: "ERROR" });
        }
    });


    const handleSave=(hotelFormData: FormData)=> {
        mutate(hotelFormData)
    };
    

  return (
     <ManageHotelForm  onSave={handleSave} isLoading={isPending} setResetform={setResetform}/>
  )
}

export default AddHotel