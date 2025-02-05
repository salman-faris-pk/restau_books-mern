import { useQuery } from "@tanstack/react-query"
import * as apiClient from "../api/api-client"
import { Link, useNavigate } from "react-router-dom";
import { BsBuilding, BsMap } from "react-icons/bs";
import { BiHotel, BiMoney, BiStar } from "react-icons/bi";
import { MdEditNote } from "react-icons/md";


const MyHotels = () => {

  const navigate=useNavigate();

  const {data: hotelData,isLoading}=useQuery({
    queryKey:["fetchMyHotels"],
    queryFn: apiClient.fetchMyHotels,
  });

  if(isLoading){
    return <div className="flex items-center justify-center">
       <div className="border-t-4 border-blue-600 border-solid w-16 h-16 rounded-full animate-spin"></div>
    </div>;
  };


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

    {hotelData && hotelData.length === 0 &&
     <span className="text-gray-400"> Start adding rooms to manage your listings efficiently. Click the button above to add!</span>
    }

      {hotelData && hotelData.map((hotel,i) => (
        <div key={i}
          data-testid="hotel-card"
          className="flex flex-col justify-between border border-slate-300 rounded-lg p-5 gap-5 cursor-pointer"
        >
          <div className="flex items-center justify-between">
           <h2 className="text-2xl font-bold">{hotel.name}</h2>
           <span className="rounded-md bg-slate-50" onClick={()=> navigate(`/edit-hotel/${hotel._id}`)}>
              <MdEditNote size={36} className="text-gray-600 hover:scale-105"/></span>
          </div>
          <div className="whitespace-pre-line">{hotel.description}</div>

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
              <BiMoney className="mr-1" />₹ {hotel.pricePerNight} per night
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