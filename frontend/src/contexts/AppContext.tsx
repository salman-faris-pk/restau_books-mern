import { createContext, useContext, useState} from "react"
import Toast from "../components/Toast";
import { useQuery } from "@tanstack/react-query";
import * as apiClient from "../api/api-client";
import {loadStripe,Stripe} from "@stripe/stripe-js";



const STRIPE_PUB_KEY = import.meta.env.VITE_STRIPE_PUB_KEY || "";


type ToastMessage={
    message: string;
    type: "SUCCESS" | "ERROR",
    duration? : number,
}

type AppContext={
    showToast: (toastMessag: ToastMessage) => void;
    isLoggedIn: boolean;
    stripePromise: Promise<Stripe | null>;
    loginuserId: string | null;
    isAuthLoading: boolean;
};

const AppContext=createContext<AppContext | undefined>(undefined)

const stripePromise= loadStripe(STRIPE_PUB_KEY)

export const AppContextProvider=({children}: {children: React.ReactNode})=>{

    const [toast, setToast]=useState<ToastMessage | undefined>(undefined)

     const { data,isError,isLoading} = useQuery({
        queryKey: ["validateToken"],
        queryFn: apiClient.validateToken,
        retry: false,
      });

      const loginuserId = data?.userId || null;
      const isLoggedInn = !isError && !!data;
      
    return(
        <AppContext.Provider value={{
            showToast: (toastMessage) => {
                setToast(toastMessage)
            },
            isLoggedIn: isLoggedInn,
            stripePromise,
            loginuserId:loginuserId,
            isAuthLoading:isLoading
          }}>
          
          {toast && (
            <Toast 
              message={toast.message}
              type={toast.type}
              onClose={()=> setToast(undefined)}
            />
          )}
          
            {children}
        </AppContext.Provider>
        
    )
};

export const useAppContext=()=>{
    const context=useContext(AppContext);
    return context as AppContext;
};