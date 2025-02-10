import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { useSearchContext } from "../../contexts/Searchcontext";
import { useAppContext } from "../../contexts/AppContext";
import DatePicker from 'react-datepicker';
import { useQuery } from "@tanstack/react-query";
import * as apiClient from "../../api/api-client"
import { getDisabledDates } from "../../utils/DisableDates";


type Props = {
    hotelId: string;
    pricePerNight: number;
    hotelUserId: string;
  };
type GuestInfoFormData = {
    checkIn: Date;
    checkOut: Date;
    adultCount: number;
    childCount: number;
  };

const GuestInfoForm = ({ hotelId, pricePerNight,hotelUserId }: Props) => {

    const search=useSearchContext()
    const navigate = useNavigate();
    const location = useLocation();
    const { isLoggedIn,showToast} = useAppContext();

    const {data: dates}=useQuery({
      queryKey:["fetchDates",hotelId],
      queryFn: ()=> apiClient.getDates(hotelId),
      enabled: !!hotelId
    });


    const {register,watch,setValue,handleSubmit,formState: { errors }}=useForm<GuestInfoFormData>({
      defaultValues: {
        checkIn: search.checkIn,
        checkOut: search.checkOut,
        adultCount: search.adultCount,
        childCount: search.childCount,
      }
    });

    const checkIn = watch("checkIn");
    const checkOut = watch("checkOut");

    const onSignInClick = (data: GuestInfoFormData) => {
      search.saveSearchValues(
        "",
        data.checkIn,
        data.checkOut,
        data.adultCount,
        data.childCount
      );
      navigate("/sign-in", { state: { from: location } });
    };

    const onSubmit = (data: GuestInfoFormData) => {
      if (data.checkIn.toDateString() === data.checkOut.toDateString()) {
        showToast({message:"Check-in and Check-out cannot be the same date",type:"ERROR"});
        return;
      };
    
      search.saveSearchValues(
        "",
        data.checkIn,
        data.checkOut,
        data.adultCount,
        data.childCount
      );
      navigate(`/hotel/${hotelId}/booking`);
    };
  
    const minDate = new Date();
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() + 1);

    
      const {data:currentUser}=useQuery({
        queryKey:["fetchCurrentUser"],
        queryFn: () => apiClient.fetchcurrentUser()
      });
   
      const sameUser= currentUser?._id && currentUser._id === hotelUserId;
      const disabledDates = dates?.earliestCheckIn && dates?.latestCheckOut
       ? getDisabledDates(dates?.earliestCheckIn, dates?.latestCheckOut)
      : [];

  return (
    <div className="flex flex-col p-4 ml-2 bg-blue-200 rounded-sm gap-4">
    <h3 className="text-md font-bold">₹ {pricePerNight} <span className="text-sm font-normal text-gray-600">/ night</span></h3>
    <form
      onSubmit={
        isLoggedIn ? handleSubmit(onSubmit) : handleSubmit(onSignInClick)
      }
    >
      <div className="grid grid-cols-1 gap-4 items-center">
        <div>
          <DatePicker
            required
            selected={checkIn}
            onChange={(date) => setValue("checkIn", date as Date)}
            selectsStart
            startDate={checkIn}
            endDate={checkOut}
            minDate={checkIn ? new Date(checkIn.getTime() + 24 * 60 * 60 * 1000) : minDate}
            maxDate={maxDate}
            placeholderText="Check-in Date"
            className="min-w-full bg-white p-2 focus:outline-none"
            wrapperClassName="min-w-full"
            excludeDates={disabledDates}
            dayClassName={(date) => disabledDates.some(d => d.toDateString() === date.toDateString()) ? "bg-red-500 text-white disabled-day" : ""}
          />
        </div>
        <div>
          <DatePicker
            required
            selected={checkOut}
            onChange={(date) => setValue("checkOut", date as Date)}
            selectsStart
            startDate={checkIn}
            endDate={checkOut}
            minDate={minDate}
            maxDate={maxDate}
            placeholderText="Check-in Date"
            popperPlacement="top-start"
            className="min-w-full bg-white p-2 focus:outline-none"
            wrapperClassName="min-w-full"
            excludeDates={disabledDates}
            dayClassName={(date) => disabledDates.some(d => d.toDateString() === date.toDateString()) ? "bg-red-500 text-white disabled-day" : ""}  
          />
        </div>
        <div className="flex bg-white px-2 py-1 gap-2">
          <label className="items-center flex">
            Adults:
            <input
              className="w-full p-1 focus:outline-none font-bold"
              type="number"
              min={1}
              max={20}
              {...register("adultCount", {
                required: "This field is required",
                min: {
                  value: 1,
                  message: "There must be at least one adult",
                },
                valueAsNumber: true,
              })}
            />
          </label>
          <label className="items-center flex">
            Children:
            <input
              className="w-full p-1 focus:outline-none font-bold"
              type="number"
              min={0}
              max={20}
              {...register("childCount", {
                valueAsNumber: true,
              })}
            />
          </label>
          {errors.adultCount && (
            <span className="text-red-500 font-semibold text-sm">
              {errors.adultCount.message}
            </span>
          )}
        </div>
        {isLoggedIn ? (
    <div className="flex flex-col items-center w-full">
    <button
      disabled={sameUser as boolean}
      className={`${
        sameUser ? "cursor-not-allowed opacity-50" : "cursor-pointer"
      } bg-blue-600 text-white h-full p-2 font-bold hover:bg-blue-500 text-xl w-full rounded-sm`}
      >
      Book Now
    </button>
    {sameUser && (
      <p className="text-red-500 text-xs mt-2">You cannot book your own hotel.</p>
    )}
  </div>
  ) : (
  <div className="flex flex-col items-center">
    <button className="bg-blue-600 text-white h-full w-full rounded-sm p-2 font-bold hover:bg-blue-500 text-xl">
      Sign in to Book
    </button>
    <p className="text-gray-500 text-xs mt-2">Sign in to make a booking.</p>
  </div>
)}



      </div>
    </form>
  </div>
  )
}

export default GuestInfoForm

 