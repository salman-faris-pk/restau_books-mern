import * as apiClient from "../api/api-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AiFillStar } from "react-icons/ai";
import { useParams } from "react-router-dom";
import GuestInfoForm from "../forms/GuestInfoForm/GuestInfoForm";
import { CiBookmark } from "react-icons/ci";
import { IoBookmark } from "react-icons/io5";
import { useEffect, useState } from "react";
import { useAppContext } from "../contexts/AppContext";
import Skeleton from "../components/Skeleton";

const Detail = () => {
  const queryClient = useQueryClient();
  const { hotelId } = useParams();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { showToast, isLoggedIn, loginuserId } = useAppContext();
  
  const { data: currentStatus } = useQuery({
    queryKey: ["fetchStatus", hotelId],
    queryFn: () => apiClient.WishListStatus(hotelId as string),
    enabled: !!hotelId,
    refetchOnWindowFocus: false,
  });

  const { data: hotel, isLoading } = useQuery({
    queryKey: ["fetchHotelById", hotelId],
    queryFn: () => apiClient.fetchHotelbyId(hotelId as string),
    enabled: !!hotelId,
    staleTime: 15 * 60 * 1000,
  });

  const trimmedLoginUserId = loginuserId?.trim(); 
  const trimmedHotelUserId = hotel?.userId?.trim();
  const isUserHotelOwner = trimmedLoginUserId === trimmedHotelUserId;

  const { mutate: toggleWishlist } = useMutation({
    mutationFn: async () => {
      if (currentStatus?.inWishlist) {
        return await apiClient.removeWishlist(hotelId as string);
      } else {
        return await apiClient.AddToWishlist(hotelId as string);
      }
    },
    onMutate: async () => {

      await queryClient.cancelQueries({ queryKey: ["fetchStatus", hotelId] });

      const previousStatus = queryClient.getQueryData(["fetchStatus", hotelId]);

      queryClient.setQueryData(["fetchStatus", hotelId], (old: any) => ({
        ...old,
        inWishlist: !old?.inWishlist,
      }));

      return { previousStatus };
    },
    onError: (err, _, context) => {
      queryClient.setQueryData(["fetchStatus", hotelId], context?.previousStatus);
      showToast({ 
        message: `Failed to ${currentStatus?.inWishlist ? "remove from" : "add to"} wishlist!`, 
        type: "ERROR" 
      });
      console.error(err);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["fetchStatus", hotelId] }); //Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });

  useEffect(() => {
    if (selectedImage) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [selectedImage]);

  if (isLoading) {
    return <Skeleton />;
  }

  if (!hotel) {
    return <></>;
  }

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
          {isLoggedIn && hotel?.userId && (
            <span className={`${isUserHotelOwner ? "hidden" : "block"}`}>
              {currentStatus?.inWishlist ? (
                <IoBookmark 
                  size={42} 
                  onClick={() => toggleWishlist()} 
                  className="text-blue-500 hover:text-blue-700 transition-colors"
                />
              ) : (
                <CiBookmark 
                  size={42} 
                  onClick={() => toggleWishlist()} 
                  className="hover:text-blue-500 transition-colors"
                />
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
          className="fixed -inset-6 bg-black/80 bg-opacity-90 h-full flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-full max-h-full" onClick={(e) => e.stopPropagation()}>
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