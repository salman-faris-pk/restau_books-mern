import { useQuery } from "@tanstack/react-query"
import * as apiclient from "../api/api-client"
import BookingDetailSummary from "../components/BookingDetailSummary";
import { useSearchContext } from "../contexts/Searchcontext";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import BookingForm from "../forms/BookingForm/BookingForm";



const Booking = () => {

  const search=useSearchContext();
  const { hotelId } = useParams();
  const [numberOfNights, setNumberOfNights]=useState<number>(0)
  
  useEffect(()=>{
    if(search.checkIn && search.checkOut) {
      const nights= Math.abs(search.checkOut.getTime() - search.checkIn.getTime()) / (1000 * 60 * 60 * 24); //didvided by miliseconds
      setNumberOfNights(Math.ceil(nights))
    }

  },[search.checkIn,search.checkOut])

  
  const {data: hotel}=useQuery({
      queryKey:["fetchHotelById",hotelId],
      queryFn: () => apiclient.fetchHotelbyId(hotelId as string),
      enabled: !!hotelId
    });
  
   
  const {data:currentUser}=useQuery({
    queryKey:["fetchCurrentUser"],
    queryFn: () => apiclient.fetchcurrentUser()
  });


  if (!hotel) {
    return <></>;
  };

  
  return (
    <div className="grid md:grid-cols-[1fr_2fr]">
      <BookingDetailSummary 
         checkIn={search.checkIn}
         checkOut={search.checkOut}
         adultCount={search.adultCount}
         childCount={search.childCount}
         numberOfNights={numberOfNights}
         hotel={hotel}
      />
      {currentUser && 
      <BookingForm currentUser={currentUser}/>
       }

    </div>
  )
}

export default Booking