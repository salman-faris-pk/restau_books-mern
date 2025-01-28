import React, { createContext, useContext, useState } from "react";


type SearchContext = {
    destination: string;
    checkIn: Date;
    checkOut: Date;
    adultCount: number;
    childCount: number;
    hotelId: string;
    saveSearchValues: (
        destination: string,
        checkIn: Date,
        checkOut: Date,
        adultCount: number,
        childCount: number
      ) => void;
};


const SearchContext =createContext<SearchContext | undefined>(undefined);

type ChildrenProp ={
    children: React.ReactNode;
}

export const SearchContextprovider = ({children}: ChildrenProp)=>{

   const [destination,setDestination]=useState<string>("")
   const [checkIn,setCheckIn]=useState<Date>(new Date())
   const [checkOut,setcheckOut]=useState<Date>(new Date())
   const [childCount,setChildCount]=useState<number>(0)
   const [adultCount,setAdultCount]=useState<number>(1)
   const [hotelId,setHotelId]=useState<string>("")

   const saveSearchValues =(destination:string,checkIn:Date,checkOut:Date,childCount:number,adultCount:number,hotelId?:string) => {
        setDestination(destination)
        setCheckIn(checkIn)
        setcheckOut(checkOut)
        setAdultCount(adultCount)
        setChildCount(childCount)
        if(hotelId) {
            setHotelId(hotelId)
        }

   };


    return (
        <SearchContext.Provider value={{destination,checkIn,checkOut,childCount,adultCount,hotelId,saveSearchValues}}>
             {children}
        </SearchContext.Provider>

    )
};


export const useSearchContext =()=>{
    const context=useContext(SearchContext)
    return context as SearchContext
};