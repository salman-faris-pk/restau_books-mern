import * as apiClient from "../api/api-client"
import { useQuery } from "@tanstack/react-query";
import { AiFillStar } from "react-icons/ai";
import { useParams } from "react-router-dom";
import GuestInfoForm from "../forms/GuestInfoForm/GuestInfoForm";
import { useState } from "react";


const Detail = () => {

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const openImage = (image:string) => {
    setSelectedImage(image);
  };

  const closeImage = () => {
    setSelectedImage(null);
  };

  const { hotelId }=useParams();
  const {data: hotel}=useQuery({
    queryKey:["fetchHotelById",hotelId],
    queryFn: () => apiClient.fetchHotelbyId(hotelId || ""),
    enabled: !!hotelId
  });

  if (!hotel) {
    return <></>;
  };


  return (
    <div className="space-y-6">
    <div>
      <span className="flex">
        {Array.from({ length: hotel.starRating }).map(() => (
          <AiFillStar className="fill-yellow-400" key={length}/>
        ))}
      </span>
      <h1 className="text-3xl font-bold">{hotel.name}</h1>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {hotel.imageUrls.map((image,i) => (
        <div className="h-[300px] relative group" key={i}>
          <img
            src={image}
            alt={hotel.name}
            className="rounded-md w-full h-full object-cover object-center"
          />
             <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 rounded-md flex items-center justify-center"
              onClick={() => openImage(image)}
            >
           <p className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer">
               View
          </p>
         </div>
      </div>
      ))}
    </div>

    {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 h-full flex items-center justify-center z-50 p-4"
          onClick={closeImage}
        >
          <div className="relative max-w-full max-h-full">
            <img
              src={selectedImage}
              alt={hotel.name}
              className="max-w-full max-h-screen object-contain rounded-lg"
            />
            <button
              className="absolute top-4 right-4 bg-white text-black rounded-full font-medium w-10 h-10 flex items-center justify-center hover:bg-gray-200 transition-colors duration-200"
              onClick={closeImage}
            >
              X
            </button>
          </div>
        </div>
      )}

    <div className="grid grid-cols-1 lg:grid-cols-4 gap-2">
      {hotel.facilities.map((facility,i) => (
        <div className="border border-slate-300 rounded-sm p-3" key={i}>
          {facility}
        </div>
      ))}
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr]">
      <div className="whitespace-pre-line">{hotel.description}</div>
      <div className="h-fit">
        <GuestInfoForm
          pricePerNight={hotel.pricePerNight}
          hotelId={hotel._id}
        />
      </div>
    </div>
  </div>
  )
}

export default Detail