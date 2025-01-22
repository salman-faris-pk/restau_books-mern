import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as apiClient from "../api/api-client"
import { useAppContext } from "../contexts/AppContext";


export type SignInFormData = {
  email: string;
  password: string;
};


const SignIn = () => {

    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
     const { showToast }=useAppContext();
     const queryClient = useQueryClient();
     const location = useLocation();
     const navigate = useNavigate();

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<SignInFormData>();

   const mutation = useMutation({
        mutationFn: apiClient.SignIn, 
        onSuccess: async () => {
          showToast({message:"Sign in Successful!", type: "SUCCESS"});
          await queryClient.invalidateQueries({ queryKey: ["validateToken"]})
          reset();
          navigate(location.state?.from?.pathname || '/');
        },
        onError: (error: Error) => {
          if(error.message === "Request failed with status code 400"){
            showToast({message: "Invalid login details. Please verify and try again",type:"ERROR"})
          }else{
            showToast({message: error.message,type:"ERROR"})
          }
        },
      });


  const onSubmit = handleSubmit((data) => {
    mutation.mutate(data)
  });

  return (
    <form className="flex flex-col gap-5" onSubmit={onSubmit}>
    <h2 className="text-3xl font-bold">Sign In</h2>
    <label className="text-gray-700 text-sm font-bold flex-1">
      Email
      <input
        type="email"
        className="border rounded w-full p-2 font-normal"
        {...register("email", { required: "This field is required" })}
      />
      {errors.email && (
        <span className="text-red-500">{errors.email.message}</span>
      )}
    </label>
    <label className="text-gray-700 text-sm font-bold flex-1">
      Password
      <div className="relative">
      <input
         type={isPasswordVisible ? "text" : "password"}
        className="border rounded w-full p-2 font-normal"
        {...register("password", {
          required: "This field is required",
          minLength: {
            value: 6,
            message: "Password must be at least 6 characters",
          },
        })}
      />
       <button
          type="button"
          onClick={()=> setIsPasswordVisible((prev) => !prev)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
        >
          {isPasswordVisible ? <FaEyeSlash /> : <FaEye />}
        </button>

      </div>
      {errors.password && (
        <span className="text-red-500">{errors.password.message}</span>
      )}
    </label>
    <span className="flex items-center justify-between">
      <span className="text-sm">
        Not Registered?{" "}
        <Link className="underline" to="/register">
          Create an account here
        </Link>
      </span>
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 font-bold hover:bg-blue-700 text-xl rounded-md"
        disabled={mutation.isPending}
      >
        {mutation.isPending ?  (
            <div className="w-5 h-5 border-2 flex items-center justify-center border-t-4 border-white border-solid rounded-full animate-spin"></div>
          ) : (
            "Login"
          )}
      </button>
    </span>
  </form>
  )
}

export default SignIn