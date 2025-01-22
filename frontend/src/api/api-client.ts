import { RegisterFormData } from "../pages/Register"
import axiosInstance from "./api-instance";




export const register = async (formData: RegisterFormData) => {
    const response = await axiosInstance.post('/user/register', formData);
  
    if (response.status !== 200) {
      throw new Error(response.data.message || 'Registration failed');
    }
    return response.data;
  };




