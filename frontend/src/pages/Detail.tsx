import * as apiClient from "../api/api-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AiFillStar } from "react-icons/ai";
import { useParams } from "react-router-dom";
import GuestInfoForm from "../forms/GuestInfoForm/GuestInfoForm";
import { CiBookmark } from "react-icons/ci";
import { IoBookmark } from "react-icons/io5";
import { useState } from "react";
import { useAppContext } from "../contexts/AppContext";
import { useOptimistic } from 'react';


const Detail = () => {
  const queryClient = useQueryClient();
  const { hotelId } = useParams();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { showToast, isLoggedIn,loginuserId } = useAppContext();
  


  const { data: CurrentStatus} = useQuery({
    queryKey: ["fetchStatus", hotelId],
    queryFn: () => apiClient.WishListStatus(hotelId as string),
    enabled: !!hotelId,
    refetchOnWindowFocus: false,
  });

  const { data: hotel } = useQuery({
    queryKey: ["fetchHotelById", hotelId],
    queryFn: () => apiClient.fetchHotelbyId(hotelId as string),
    enabled: !!hotelId,
  });

const trimmedLoginUserId = loginuserId?.trim();
const trimmedHotelUserId = hotel?.userId?.trim();

const isUserHotelOwner = trimmedLoginUserId === trimmedHotelUserId;

  const [optimisticStatus, setOptimisticStatus] = useOptimistic(
    CurrentStatus?.inWishlist || false,
    (_, newStatus) => newStatus
  );

  const { mutate: addToWishlist } = useMutation({
    mutationFn: () => apiClient.AddToWishlist(hotelId as string),
    onMutate: () => {
      setOptimisticStatus(true);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fetchStatus"] });
    },
    onError: () => {
      setOptimisticStatus(false);
      showToast({ message: "Failed to add to wishlist!", type: "ERROR" });
    },
  });

  const { mutate: removeFromWishlist } = useMutation({
    mutationFn: () => apiClient.removeWishlist(hotelId as string),
    onMutate: () => {
      setOptimisticStatus(false);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fetchStatus"] });
    },
    onError: () => {
      setOptimisticStatus(true);
      showToast({ message: "Failed to remove from wishlist!", type: "ERROR" });
    },
  });

  if (!hotel) {
    return <></>;
  };

  return (
    <div className="space-y-6 px-2 md:px-0">
      <div>
        <span className="flex">
          {Array.from({ length: hotel.starRating }).map((_, index) => (
            <AiFillStar className="fill-yellow-400" key={index} />
          ))}
        </span>
        <div className="flex justify-between cursor-pointer">
          <h1 className="text-3xl font-bold">{hotel.name}</h1>
          {isLoggedIn && hotel?.userId &&  (
            <span  className={`${isUserHotelOwner ? "hidden" : "block"}`}>
              {optimisticStatus ? (
                <IoBookmark size={42} onClick={() => removeFromWishlist()} />
              ) : (
                <CiBookmark size={42} onClick={() => addToWishlist()} />
              )}
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {hotel.imageUrls.map((image, i) => (
          <div className="h-[300px] relative group" key={i}>
            <img
              src={image}
              alt={hotel.name}
              className="rounded-md w-full h-full object-cover object-center"
            />
            <div
              className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 rounded-md flex items-center justify-center"
              onClick={() => setSelectedImage(image)}
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
        >
          <div className="relative max-w-full max-h-full">
            <img
              src={selectedImage}
              alt={hotel.name}
              className="max-w-full max-h-screen object-contain rounded-lg"
            />
            <button
              className="absolute top-4 right-4 bg-white text-black rounded-full font-medium w-10 h-10 flex items-center justify-center hover:bg-gray-200 transition-colors duration-200"
              onClick={() => setSelectedImage(null)}
            >
              X
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-2">
        {hotel.facilities.map((facility, i) => (
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
            hotelUserId={hotel.userId}
          />
        </div>
      </div>
    </div>
  );
};

export default Detail;



