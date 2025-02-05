import { HotelSearchResponse, HotelType, PaymentIntentResponse, UserType } from "../../../backend/src/types/types";
import { BookingFormData } from "../forms/BookingForm/BookingForm";
import { Hotel } from "../pages/MyBookings";
import { RegisterFormData } from "../pages/Register"
import { SignInFormData } from "../pages/SignIn";
import axiosInstance from "./api-instance";




export const register = async (formData: RegisterFormData) => {
    const response = await axiosInstance.post('/user/register', formData);
     
    if (response.status !== 200) {
      throw new Error(response.data.message);
    };

    return response.data;
  };


  export const validateToken= async()=>{

    const response= await axiosInstance.get("/user/validate-token");

    if (response.status !== 200) {
      throw new Error("Token invalid");
    };

    return response.data;

  };


  export const SignIn =async(formData: SignInFormData)=>{

    const response= await axiosInstance.post("/user/login", formData);

    if (response.status !== 200) {
      throw new Error(response.data.message);
    };

    return response.data;

  };

export const SignOut= async()=>{
   const response= await axiosInstance.post("/user/logout");
    
   if (response.status !== 200) {
    throw new Error("Error during sign out");
  };

};

export const fetchcurrentUser= async() : Promise<UserType> => {
  const response = await axiosInstance.get("/user/me");
  if (response.status !== 200) {
    throw new Error("Error fetching user!");
  };

  return response.data;

};



export const addMyHotel =async(hotelFormdata: FormData) => {

  const response=await  axiosInstance.post("/my-hotels", hotelFormdata);
    
  if (response.status !== 201) {
    throw new Error("Failed to add hotel");
  };

  return response.data;

};


export const fetchMyHotels= async() : Promise<HotelType[]> => {
    const response = await axiosInstance.get("/my-hotels");

    if (response.status !== 200) {
      throw new Error("Error fetching hotels");
    };
  
    return response.data;

};


export const fetchMyHotelById = async(hotelId:string) : Promise<HotelType> =>{
      const response =  await axiosInstance.get(`/my-hotels/${hotelId}`);
      if (response.status !== 200) {
        throw new Error("Error fetching hotels");
      };

      return response.data;
};


export const updateMyHotelById = async(hotelFormdata: FormData) =>{
    
  const hotelId = hotelFormdata.get("hotelId");
  const response = await axiosInstance.put(`/my-hotels/${hotelId}`, hotelFormdata);
  if (response.status !== 201) {
    throw new Error("Failed to update Hotel");
  };

  return response.data;

};


export const DeleteImages =async(hotelId:string,imageUrl:string)=>{
  
  const response = await axiosInstance.delete(`my-hotels/images/${hotelId}`,{
    data: { imageUrl }
  })
  if (response.status !== 200) {
    throw new Error("Failed to delete image");
  };

  return response.data;

};


export type SearchParams = {
  destination?: string;
  checkIn?: string;
  checkOut?: string;
  adultCount?: string;
  childCount?: string;
  page?: string;
  facilities?: string[];
  types?: string[];
  stars?: string[];
  maxPrice?: string;
  sortOption?: string;
};


export const SearchHotels =async(searchParams: SearchParams) : Promise<HotelSearchResponse> => {
  
   const queryParams= new URLSearchParams();

   queryParams.append("destination", searchParams.destination || "");
   queryParams.append("checkIn", searchParams.checkIn || "");
   queryParams.append("checkOut", searchParams.checkOut || "");
   queryParams.append("adultCount", searchParams.adultCount || "");
   queryParams.append("childCount", searchParams.childCount || "");
   queryParams.append("page", searchParams.page || "");
   queryParams.append("maxPrice", searchParams.maxPrice || "");
   queryParams.append("sortOption", searchParams.sortOption || "");

   searchParams.facilities?.forEach((facility) =>
    queryParams.append("facilities", facility)
   );

   searchParams.types?.forEach((type) => queryParams.append("types", type));
   searchParams.stars?.forEach((star) => queryParams.append("stars", star));

   const response= await axiosInstance.get(`/hotels/search?${queryParams}`);

   if(response.status !== 200) {
    throw new Error("Error fetching search hotels");
   };
  
   return response.data;
};


export const fetchHotelbyId = async(hotelId:string): Promise<HotelType> => {
  const response = await  axiosInstance.get(`/hotels/${hotelId}`);
  if(response.status !== 200) {
    throw new Error("Error fetching Hotels");
  }

  return response.data;

};


export const createPaymentIntent = async(hotelId:string,numberOfNights:string): Promise<PaymentIntentResponse> => {

     const response=await axiosInstance.post(`/hotels/${hotelId}/bookings/payment-intent`,{numberOfNights});

     if(response.status !== 200){
      throw new Error("Error fetching payment intent");
     };

     return response.data;
};


export const createRoomBooking = async(formData: BookingFormData)=> {
    const response= await axiosInstance.post(`/hotels/${formData.hotelId}/bookings`,formData);
    if(response.status !==200){
      throw new Error("Error booking room");
    }; 
};


export const fetchmyBookings = async() : Promise<Hotel[]>=>{
  const response=await axiosInstance.get("/my-bookings");
  if(response.status !== 200) {
    throw new Error("Unables to fetch bookings");
  };
  return response.data;
};
