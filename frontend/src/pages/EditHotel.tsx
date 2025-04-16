import { useParams } from "react-router-dom"
import { useAppContext } from "../contexts/AppContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as apiClient from "../api/api-client"
import ManageHotelForm from "../forms/managehotelForm/ManageHotelForm";


const EditHotel = () => {

    const { hotelId }=useParams();
    const { showToast }=useAppContext();
    const queriClient=useQueryClient();

    const {data: hotel}=useQuery({
        queryKey:["fetchMyHotelById"],
        queryFn:  () => apiClient.fetchMyHotelById(hotelId || ""),
         enabled: !!hotelId
    });


    const { mutate,isPending }=useMutation({
        mutationFn: apiClient.updateMyHotelById,
        onSuccess: () => {
            queriClient.invalidateQueries({queryKey:["fetchMyHotelById"]})
            queriClient.invalidateQueries({queryKey:["fetchlatest"]})
            queriClient.invalidateQueries({queryKey:["fetchHotelById"]})
            showToast({ message: "Hotel Saved!", type: "SUCCESS" })
        },
        onError: () => {
            showToast({ message: "Error Saving Hotel", type: "ERROR" });
        },
    });

    const handleSave =(hotelFormData: FormData) => {
        mutate(hotelFormData);
    }; 

  return (
    <ManageHotelForm hotel={hotel} onSave={handleSave} isLoading={isPending} setResetform={()=> {}}/>
  )
}

export default EditHotel