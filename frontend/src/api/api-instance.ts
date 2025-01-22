import axios from "axios"



const API_BASE_URL=import.meta.env.VITE_API_BASE_URL || "";

const axiosInstance= axios.create({
   baseURL: `${API_BASE_URL}/api`,
   headers: {
    "Content-Type": "application/json",
   },
   withCredentials: true,
});


export default axiosInstance;