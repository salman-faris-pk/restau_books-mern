import { createContext, useContext, useState} from "react"
import Toast from "../components/Toast";
import { useQuery } from "@tanstack/react-query";
import * as apiClient from "../api/api-client";


type ToastMessage={
    message: string;
    type: "SUCCESS" | "ERROR"
}

type AppContext={
    showToast: (toastMessag: ToastMessage) => void;
    isLoggedIn: boolean;
};

const AppContext=createContext<AppContext | undefined>(undefined)


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