import { createContext, useContext, useState} from "react"
import Toast from "../components/Toast";
import { useQuery } from "@tanstack/react-query";
import * as apiClient from "../api/api-client";
import {loadStripe,Stripe} from "@stripe/stripe-js";



const STRIPE_PUB_KEY = import.meta.env.VITE_STRIPE_PUB_KEY || "";


type ToastMessage={
    message: string;
    type: "SUCCESS" | "ERROR",
}

type AppContext={
    showToast: (toastMessag: ToastMessage) => void;
    isLoggedIn: boolean;
    stripePromise: Promise<Stripe | null>;
};

const AppContext=createContext<AppContext | undefined>(undefined)

const stripePromise= loadStripe(STRIPE_PUB_KEY)

export const AppContextProvider=({children}: {children: React.ReactNode})=>{

    const [toast, setToast]=useState<ToastMessage | undefined>(undefined)

     const { isError } = useQuery({
        queryKey: ["validateToken"],
        queryFn: apiClient.validateToken,
        retry: false,
      });


    return(
        <AppContext.Provider value={{
            showToast: (toastMessage) => {
                setToast(toastMessage)
            },
            isLoggedIn: !isError,  //if not error means logedin true
            stripePromise
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