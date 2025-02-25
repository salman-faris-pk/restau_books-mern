import { FormProvider, useForm } from "react-hook-form";
import { HotelType } from "../../../../backend/src/types/types"
import { useEffect } from "react";
import DetailsSection from "./DetailsSection";
import TypeSection from "./TypeSection";
import FacilitiesSection from "./FacilitiesSection";
import GuestsSection from "./GuestsSection";
import ImagesSection from "./ImagesSection";




export type HotelFormData = {
    name: string;
    city: string;
    country: string;
    description: string;
    type: string;
    pricePerNight: number;
    starRating: number;
    facilities: string[];
    imageFiles: File[];
    imageUrls: string[];
    adultCount: number;
    childCount: number;
  };


interface Props{
 hotel?: HotelType;  
 onSave: (hotelFormData: FormData)=> void;
 isLoading: boolean;
 setResetform: (resetFunc: () => void) => void;
};


const ManageHotelForm = ({ onSave, isLoading, hotel,setResetform}: Props) => {  //here hotel is optional

  const formMethods= useForm<HotelFormData>()
  const { handleSubmit, reset }=formMethods;

  useEffect(()=>{
    reset(hotel);
  },[hotel,reset]);

  useEffect(() => {
    setResetform(() => reset);
  }, [setResetform, reset]);


const onSubmit = handleSubmit((formDataJson: HotelFormData) => {
    const formData = new FormData();
    if (hotel) {
      formData.append("hotelId", hotel._id);
    }
  
    formData.append("name", formDataJson.name);
    formData.append("city", formDataJson.city);
    formData.append("country", formDataJson.country);
    formData.append("description", formDataJson.description);
    formData.append("type", formDataJson.type);
    formData.append("pricePerNight", formDataJson.pricePerNight.toString());
    formData.append("starRating", formDataJson.starRating.toString());
    formData.append("adultCount", formDataJson.adultCount.toString());
    formData.append("childCount", formDataJson.childCount.toString());
  
    formDataJson.facilities.forEach((facility, index) => {
      formData.append(`facilities[${index}]`, facility);
    });
  
    if (formDataJson.imageUrls) {
      formDataJson.imageUrls.forEach((url, index) => {
        formData.append(`imageUrls[${index}]`, url);
      });
    }
  
    if (formDataJson.imageFiles) {
        Array.from(formDataJson.imageFiles).forEach((imageFile) => {
          formData.append(`imageFiles`, imageFile);
        });
      };

    onSave(formData);

    
  });


  return (
    <FormProvider {...formMethods}>
        <form className="flex flex-col gap-10 px-2 md:px-0" onSubmit={onSubmit}>
         <DetailsSection />
         <TypeSection />
         <FacilitiesSection />
         <GuestsSection />
         <ImagesSection />
        <span className="flex justify-end">
          <button
            disabled={isLoading}
            type="submit"
            className="bg-blue-600 text-white py-2 px-6 rounded-sm font-bold hover:bg-blue-700 text-xl disabled:bg-gray-500"
          >
            {isLoading ? "Saving..." : "Save"}
          </button>
        </span>
      </form>


    </FormProvider>
  )
}

export default ManageHotelForm