import { useQuery } from "@tanstack/react-query"
import * as apiClient from "../api/api-client"
import { Link, useNavigate } from "react-router-dom";
import { BsBuilding, BsMap } from "react-icons/bs";
import { BiHotel, BiMoney, BiStar } from "react-icons/bi";



const MyHotels = () => {

  const navigate=useNavigate();

  const {data: hotelData,isLoading}=useQuery({
    queryKey:["fetchMyHotels"],
    queryFn: apiClient.fetchMyHotels,
  });

  console.log("hotelDatas",hotelData);

  if (!hotelData) {
    return <span>No Hotels found</span>;
  };
  

  if(isLoading){
    return <span>Loading...</span>;
  }



  return (
   
    <div className="space-y-5">
    <span className="flex justify-between">
      <h1 className="text-3xl font-bold">My Hotels</h1>
      <Link
        to="/add-hotel"
        className="flex bg-blue-600 shadow-md text-white text-xl font-bold py-2 px-3 hover:bg-blue-700 rounded-sm"
      >
        Add Hotel
      </Link>
    </span>
    <div className="grid grid-cols-1 gap-8">
      {hotelData.map((hotel) => (
        <div
          data-testid="hotel-card"
          className="flex flex-col justify-between border border-slate-300 rounded-lg p-5 gap-5 cursor-pointer"
          onClick={()=> navigate(`/edit-hotel/${hotel._id}`)}
        >
          <h2 className="text-2xl font-bold">{hotel.name}</h2>
          <div className="whitespace-pre-line flex gap-x-5">
            <img src={hotel.imageUrls[0]} className="w-[100px] h-[90px]"/>
            <p className="text-ellipsis overflow-hidden md:line-clamp-none line-clamp-4 text-sm">
               {hotel.description}
            </p>
          </div>

          <div className="grid grid-cols-5 gap-2">
            <div className="border border-slate-300 rounded-sm p-3 flex items-center">
              <BsMap className="mr-1" />
              {hotel.city}, {hotel.country}
            </div>
            <div className="border border-slate-300 rounded-sm p-3 flex items-center">
              <BsBuilding className="mr-1" />
              {hotel.type}
            </div>
            <div className="border border-slate-300 rounded-sm p-3 flex items-center">
              <BiMoney className="mr-1" /> ₹ {hotel.pricePerNight} per night
            </div>
            <div className="border border-slate-300 rounded-sm p-2 flex items-center">
              <BiHotel className="mr-1" />
              {hotel.adultCount} adults, {hotel.childCount} children
            </div>
            <div className="border border-slate-300 rounded-sm p-3 flex items-center">
              <BiStar className="mr-1" />
              {hotel.starRating} Star Rating
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
  )
}

export default MyHotels