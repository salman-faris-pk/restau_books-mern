import { useQuery } from "@tanstack/react-query"
import * as apiClient from "../api/api-client"


interface Booking {
    adultCount: number;
    checkIn: string;
    checkOut: string;
    childCount: number;
  }

export interface Hotel {
    _id: string;
    name: string;
    city: string;
    country: string;
    imageUrls: string[];
    bookings: Booking[];

  }
const MyBookings = () => {
 
    const {data:hotels,isLoading}=useQuery({
        queryKey:["fetchMyBookings"],
        queryFn:()=> apiClient.fetchmyBookings(),
    });
    
   
    if (isLoading) {
        return (
        <div className="flex justify-center items-center">
         <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
         </div>
        )
      };

  return (
    <>
     {!hotels || hotels.length === 0 ? (
        <span className="text-gray-500 font-semibold">No bookings found. Start planning your next stay today!😊</span>
     ): (
        
      <div className="space-y-5 px-2 md:px-0">
      <h1 className="text-2xl md:text-3xl font-bold">My Bookings</h1>
      {hotels.map((hotel) => (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_3fr] border border-slate-300 rounded-lg p-3 md:p-5 gap-5" key={hotel._id}>
          <div className="lg:w-full lg:h-[250px] rounded-md">
            <img
              src={hotel.imageUrls[0]}
              className="w-full h-full object-cover object-center rounded-md"
            />
          </div>
          <div className="flex flex-col gap-4 overflow-y-auto max-h-[260px]">
            <div className="text-2xl font-bold">
              {hotel.name}
              <div className="text-xs font-normal">
                {hotel.city}, {hotel.country}
              </div>
            </div>
            {hotel.bookings.map((booking,i) => (
              <div key={i}>
                <div>
                  <span className="font-bold mr-2">Dates: </span>
                  <span>
                    {new Date(booking.checkIn).toDateString()} -
                    {new Date(booking.checkOut).toDateString()}
                  </span>
                </div>
                <div>
                  <span className="font-bold mr-2">Guests:</span>
                  <span>
                    {booking.adultCount} adults, {booking.childCount} children
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  

     )}

  </>

  )
}

export default MyBookings