import * as apiClient from "../api/api-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AiFillStar } from "react-icons/ai";
import { useParams } from "react-router-dom";
import GuestInfoForm from "../forms/GuestInfoForm/GuestInfoForm";
import { useCallback, useEffect, useState } from "react";
import { useAppContext } from "../contexts/AppContext";
import Skeleton from "../components/Skeleton";
import WishlistButton from "../components/WishlistButton";
import HotelImageGrid from "../components/HotelImageGrid";


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

  const { mutate: toggleWishlist, isPending: isWishlistUpdating } = useMutation({
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
      queryClient.invalidateQueries({ queryKey: ["fetchStatus", hotelId] }); // //Always refetch after even its  error or success
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });

  const handleImageClick = useCallback((image: string) => {
    setSelectedImage(image);
  }, []);

  const handleCloseImage = useCallback(() => {
    setSelectedImage(null);
  }, []);

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
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">{hotel.name}</h1>
          {isLoggedIn && hotel?.userId && !isUserHotelOwner && (
            <div className="w-10 h-10 flex items-center justify-center">
              <WishlistButton
                isUpdating={isWishlistUpdating}
                isInWishlist={currentStatus?.inWishlist || false}
                onClick={toggleWishlist}
              />
            </div>
          )}
        </div>
      </div>
       
      <HotelImageGrid images={hotel.imageUrls} onImageClick={handleImageClick} />

      {selectedImage && (
        <div
          className="fixed -inset-6 bg-black/80 bg-opacity-90 flex items-center justify-center z-50 p-4"
          onClick={handleCloseImage}
        >
          <div className="relative max-w-full max-h-full" onClick={(e) => e.stopPropagation()}>
            <img
              src={selectedImage}
              alt={hotel.name}
              className="max-w-full max-h-screen object-contain rounded-lg"
            />
            <button
              className="absolute top-4 right-4 bg-white text-black rounded-full font-medium w-10 h-10 flex items-center justify-center hover:bg-gray-200 transition-colors duration-200"
              onClick={handleCloseImage}
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
        <div className="h-fit mt-7 md:mt-2">
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