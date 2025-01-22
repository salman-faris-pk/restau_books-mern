import { useState } from "react";
import { useForm} from "react-hook-form"
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useMutation,useQueryClient } from '@tanstack/react-query';
import * as apiClient from "../api/api-client"
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";



export type RegisterFormData = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
};


const Register = () => {

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showToast } = useAppContext();

    const {
      register,
      watch,
      handleSubmit,
      reset,
      formState: {errors},
    }=useForm<RegisterFormData>();

  
    const mutation = useMutation({
      mutationFn: apiClient.register, 
      onSuccess: async () => {
        showToast({message:"Registration Success!", type: "SUCCESS"});
        await queryClient.invalidateQueries({ queryKey: ["validateToken"]})
        reset();
        navigate('/');
      },
      onError: (error: Error) => {
        if(error.message === "Request failed with status code 400"){
          showToast({message: "User already exists",type:"ERROR"})
        }else{
          showToast({message: error.message,type:"ERROR"})
        }
      },
    });
  
    const onSubmit = handleSubmit((data) => {
      mutation.mutate(data); 
    });

    
    
  return (
    <form className="flex flex-col gap-5" onSubmit={onSubmit}>
      <h2 className="text-3xl font-bold">Create an Account</h2>
      <div className="flex flex-col md:flex-row gap-5">
      <label className="text-gray-700 text-sm font-bold flex-1">
          First Name
          <input
            className="border rounded w-full p-2 font-normal"
            {...register("firstName", { required: "This field is required" })}
          />
          {errors.firstName && (
            <span className="text-red-500">{errors.firstName.message}</span>
          )}
        </label>
        <label className="text-gray-700 text-sm font-bold flex-1">
          Last Name
          <input
            className="border rounded w-full p-2  font-normal"
            {...register("lastName", { required: "This field is required" })}
          />
          {errors.lastName && (
            <span className="text-red-500">{errors.lastName.message}</span>
          )}
        </label>
      </div>

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
          className="border rounded w-full p-2 font-normal text-sm"
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

      <label className="text-gray-700 text-sm font-bold flex-1">
        Confirm Password
        <div className="relative">
        <input
          type={isConfirmPasswordVisible ? "text" : "password"}
          className="border rounded w-full p-2 font-normal"
          {...register("confirmPassword", {
            validate: (val) => {
              if (!val) {
                return "This field is required";
              } else if (watch("password") !== val) {
                return "Your passwords do no match";
              }
            },
          })}
        />
        <button
          type="button"
          onClick={()=> setIsConfirmPasswordVisible((prev) => !prev)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
        >
          {isConfirmPasswordVisible ? <FaEyeSlash /> : <FaEye />}
        </button>
        </div>
        {errors.confirmPassword && (
          <span className="text-red-500">{errors.confirmPassword.message}</span>
        )}
      </label>
      

      <span>
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 font-bold hover:bg-blue-500 text-xl rounded-sm"
          disabled={mutation.isPending}
        >
          {mutation.isPending ?  (
            <div className="w-5 h-5 border-2 flex items-center justify-center border-t-4 border-white border-solid rounded-full animate-spin"></div>
          ) : (
            "Submit"
          )}
        </button>
      </span>


    </form>
  )
}

export default Register