import { useFormContext } from "react-hook-form";
import { HotelFormData } from "./ManageHotelForm";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as apiClient from "../../api/api-client"


const ImagesSection = () => {
  const {
    formState: { errors },
    watch,
    setValue,
    setError,
    clearErrors,
    getValues,
  } = useFormContext<HotelFormData>();

  const [isTouched, setIsTouched] = useState(false); 
  const location=useLocation();

  const { hotelId } = useParams<{ hotelId: string }>();
  const queriClient=useQueryClient();
 
  const existingImageUrls = watch("imageUrls");
  const existingImageFiles = watch("imageFiles") || [];


  const handleDelete = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    file: File 
  ) => {
    event.preventDefault();
    setValue(
      "imageFiles",
      existingImageFiles.filter((existingFile) => existingFile.name !== file.name) 
    );
    setIsTouched(true);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files);
      const existingFileNames = existingImageFiles.map((file) => file.name);

      const uniqueNewFiles = newFiles.filter(
        (file) => !existingFileNames.includes(file.name)
      );

      const updatedImageFiles = [...existingImageFiles, ...uniqueNewFiles];
      if (updatedImageFiles.length > 6) {
        setValue("imageFiles", updatedImageFiles.slice(0, 6));
      } else {
        setValue("imageFiles", updatedImageFiles);
      }
      
      setIsTouched(true)
    }
  };
  

  useEffect(() => {

    if (!isTouched) return;

    const totalLength = existingImageFiles.length + (existingImageUrls?.length || 0);

    if (isTouched) {
      if (totalLength === 0) {
        setError("imageFiles", {
          type: "manual",
          message: "At least one image should be added",
        });
      } else if (totalLength > 6) {
        setError("imageFiles", {
          type: "manual",
          message: "Total number of images cannot be more than 6",
        });
      } else {
        clearErrors("imageFiles");
      }
    }

    setIsTouched(false)
    
  }, [existingImageFiles, existingImageUrls, errors.imageFiles, setError, clearErrors,isTouched]);

  const imageFiles = getValues("imageFiles");
  const imageUrls = getValues("imageUrls");

  const EditpageLoc = location.pathname !== "/add-hotel" ;


  const { mutate, isPending} = useMutation({
    mutationFn: ({ hotelId, imageUrl }: { hotelId: string; imageUrl: string }) =>
      apiClient.DeleteImages(hotelId, imageUrl),
    onSuccess: ()=>{
      queriClient.invalidateQueries({queryKey:["fetchMyHotelById"]})
    }
  });
  
  const handleImgDelete = (imageUrl: string) => {
    if (!hotelId) {
      console.error("Hotel ID is missing!");
      return;
    }
    mutate({ hotelId, imageUrl });
  };
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-3">Images</h2>
       
       {EditpageLoc && imageUrls && (
         <div className="grid grid-cols-6 mb-6 gap-4">
            {imageUrls.map((url:string,i)=> (
             <div className="relative group" key={i}>
                <img src={url} alt={`img ${i}`} className="min-h-full object-cover" />
                <button
                  onClick={() => handleImgDelete(url)}
                   disabled={isPending}
                   className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                   >
            {isPending ? "..." : "Delete"}
           </button>
              </div>
            ))}
          </div>
       )}


      <div className="border rounded p-4 flex flex-col gap-4">
        {imageFiles && imageFiles.length > 0 && (
          <div className="grid grid-cols-6 gap-4">
            {imageFiles.map((file) => {
              const objectURL = URL.createObjectURL(file);
              return (
                <div className="relative group" key={file.name}>
                  <img src={objectURL} alt={file.name} className="min-h-full object-cover" />
                  <button
                    onClick={(event) => handleDelete(event, file)} 
                    className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 text-white"
                  >
                    Delete
                  </button>
                </div>
              );
            })}
          </div>
        )}

        <input
          type="file"
          multiple
          accept="image/*"
          className="w-full text-gray-700 font-normal"
          onChange={handleFileChange}
          required={!EditpageLoc}
        />
      </div>
      {errors.imageFiles && (
        <span className="text-red-500 text-sm font-bold">
          {errors.imageFiles.message}
        </span>
      )}
    </div>
  );
};

export default ImagesSection;