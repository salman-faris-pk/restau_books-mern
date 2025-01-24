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



export const addMyHote =async(hotelFormdata: FormData) => {

  const response=await  axiosInstance.post("/my-hotels", hotelFormdata);
    
  if (response.status !== 200) {
    throw new Error("Failed to add hotel");
  };

  return response.data;

};