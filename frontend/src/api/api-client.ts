import { RegisterFormData } from "../pages/Register"
import axiosInstance from "./api-instance";




export const register = async (formData: RegisterFormData) => {
    const response = await axiosInstance.post('/user/register', formData);
     
    if (response.status !== 200) {
      throw new Error(response.data.message || 'Registration failed');
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


