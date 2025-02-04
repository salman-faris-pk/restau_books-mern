import { useQuery } from "@tanstack/react-query"
import * as apiclient from "../api/api-client"
import BookingDetailSummary from "../components/BookingDetailSummary";
import { useSearchContext } from "../contexts/Searchcontext";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import BookingForm from "../forms/BookingForm/BookingForm";
import { Elements } from "@stripe/react-stripe-js";
import { useAppContext } from "../contexts/AppContext";



const Booking = () => {
  
  const { stripePromise }=useAppContext();
  const search=useSearchContext();
  const { hotelId } = useParams();
  const [numberOfNights, setNumberOfNights]=useState<number>(0)
  
  useEffect(()=>{
    if(search.checkIn && search.checkOut) {
      const nights= Math.abs(search.checkOut.getTime() - search.checkIn.getTime()) / (1000 * 60 * 60 * 24); //divided by miliseconds
      setNumberOfNights(Math.ceil(nights))
    }

  },[search.checkIn,search.checkOut])


  const {data: paymentIntentData }=useQuery({
    queryKey:[  "createPaymentIntent",hotelId, numberOfNights],
    queryFn: () => apiclient.createPaymentIntent(hotelId as string,numberOfNights.toString()),
    enabled: !!hotelId && numberOfNights > 0,
  });

  
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
    <div className="grid md:grid-cols-[1fr_2fr] gap-x-5">
      <BookingDetailSummary 
         checkIn={search.checkIn}
         checkOut={search.checkOut}
         adultCount={search.adultCount}
         childCount={search.childCount}
         numberOfNights={numberOfNights}
         hotel={hotel}
      />
      {currentUser && paymentIntentData && (
        <Elements 
          stripe={stripePromise}
          options={{clientSecret: paymentIntentData.clientSecret}}
          key={paymentIntentData.clientSecret}
        >
          <BookingForm currentUser={currentUser} paymentIntent={paymentIntentData}/>
        </Elements>
      )}
      
    </div>
  )
}

export default Booking