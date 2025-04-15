import { useForm } from "react-hook-form";
import { PaymentIntentResponse, UserType } from "../../../../backend/src/types/types"
import { useSearchContext } from "../../contexts/Searchcontext";
import { useNavigate, useParams } from "react-router-dom";
import { useAppContext } from "../../contexts/AppContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as apiClient from "../../api/api-client"
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { StripeCardElement } from "@stripe/stripe-js";
import { useState } from "react";




type Props = {
  currentUser: UserType;
  paymentIntent: PaymentIntentResponse;
  numberOfNights: number | string;
};


export type BookingFormData = {
  firstName: string;
  lastName: string;
  email: string;
  adultCount: number;
  childCount: number;
  checkIn: string;
  checkOut: string;
  hotelId: string;
  paymentIntentId: string;
  totalCost: number;
  numberOfNights?:number | string;
};

const BookingForm = ({currentUser,paymentIntent,numberOfNights}:Props) => {
 
  const stripe=useStripe();
  const elements=useElements();
  const search = useSearchContext();
  const { hotelId } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
 const [loading,setLoading]=useState(false)
 const navigate=useNavigate()
 const queryClient = useQueryClient();


  const { showToast }=useAppContext();

  const {mutate: bookRoom}=useMutation({
   mutationFn: apiClient.createRoomBooking,
   onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["fetchMyBookings"] });
     showToast({message:"Booking Saved!", type: "SUCCESS",duration:4000});
     setIsModalOpen(true);
     setTimeout(() => {
      setIsModalOpen(false);
      navigate("/", { replace: true });
      navigate("/my-bookings");
    }, 3000);
   },
   onError: () => {
    showToast({ message: "Error saving booking", type: "ERROR" });
   },
  });

  const { handleSubmit, register} = useForm<BookingFormData>({
    defaultValues: {
      firstName: currentUser.firstName,
      lastName: currentUser.lastName,
      email: currentUser.email,
      adultCount: search.adultCount,
      childCount: search.childCount,
      checkIn: search.checkIn.toISOString(),
      checkOut: search.checkOut.toISOString(),
      hotelId: hotelId,
      totalCost: paymentIntent.totalCost,
      paymentIntentId: paymentIntent.paymentIntentId,
      numberOfNights: numberOfNights
    },
  });

  const onSubmit = async(formData: BookingFormData)=> {    
      setLoading(true)
     if(!stripe || !elements) {
       return;
     };

     if (!paymentIntent?.clientSecret) {
      showToast({ message: "Payment not initialized", type: "ERROR" });
      return;
    }

     const result = await stripe.confirmCardPayment(paymentIntent.clientSecret,{
       payment_method: {
        card: elements.getElement(CardElement) as StripeCardElement,
       },
     });
     
     if (result.error) {
      showToast({ message: result.error.message || "Payment failed", type: "ERROR" });
      return;
     };

     if(result.paymentIntent?.status === "succeeded") {
       bookRoom({...formData, paymentIntentId: result.paymentIntent.id});
     };

  };
  

  return (
    <>
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 gap-5 rounded-lg border border-slate-300 p-5">
       
       <span className="text-3xl font-bold">Confirm Your Details</span>
      <div className="grid grid-cols-2 gap-6">
        <label className="text-gray-700 text-sm font-bold flex-1">
          First Name
          <input
            className="mt-1 border rounded w-full py-2 px-3 text-gray-700 bg-gray-200 font-normal"
            type="text"
            readOnly
            disabled
            {...register("firstName")}
          />
        </label>
        <label className="text-gray-700 text-sm font-bold flex-1">
          Last Name
          <input
            className="mt-1 border rounded w-full py-2 px-3 text-gray-700 bg-gray-200 font-normal"
            type="text"
            readOnly
            disabled
            {...register("lastName")}
          />
        </label>
        <label className="text-gray-700 text-sm font-bold flex-1">
          Email
          <input
            className="mt-1 border rounded w-full py-2 px-3 text-gray-700 bg-gray-200 font-normal"
            type="text"
            readOnly
            disabled
            {...register("email")}
          />
        </label>
      </div>

      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Your Price Summary</h2>

        <div className="bg-blue-200 p-4 rounded-md">
          <div className="font-semibold text-lg">
            Total Cost: ₹{paymentIntent.totalCost.toFixed(2)}
          </div>
          <div className="text-xs">Includes taxes and charges</div>
        </div>
      </div>
      

      <div className="space-y-2">
        <h3 className="text-xl font-semibold"> Payment Details</h3>
        <CardElement
          id="payment-element"
          className="border rounded-md p-3 text-sm"
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white p-3 rounded-sm font-bold hover:bg-blue-500 text-md disabled:bg-gray-500"
        >
          {loading ? "Processing..." : "Confirm Booking"}
        </button>
      </div>
      
    </form>

    {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-slate-300 opacity-50"></div>

          <div className="flex items-center justify-center bg-white p-8 rounded-lg shadow-lg z-50 relative">
            <span className="text-green-500 text-6xl">✔</span>
            <p className="mt-4 text-xl font-semibold">Payment Successful!</p>
          </div>
        </div>
      )}
    </>
  )
}

export default BookingForm