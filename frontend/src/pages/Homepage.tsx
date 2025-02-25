import { useQuery } from "@tanstack/react-query"
import * as apiClient from "../api/api-client"
import LatestDestinationCard from "../components/LatestDestinationCard";
import { FcRefresh } from "react-icons/fc";



const Homepage = () => {

  const {data: hotels,isLoading,refetch,isFetching}=useQuery({
    queryKey:["fetchlatest"],
    queryFn: ()=> apiClient.getLatestHotels(),
  });
   
      const topRowHotels = hotels?.slice(0, 2) || [];  // First 2 hotels,0th and 1th 
      const bottomRowHotels = hotels?.slice(2) || [];  //Extracts elements from index 2,means remaining all...

  return (
    <div className="space-y-3">
       <div className="flex items-center justify-between px-2 md:px-0">
        <h2 className="text-2xl md:text-3xl font-bold">Latest Destinations</h2>
        <span className="cursor-pointer hover:border hover:bg-slate-100 p-1 transition-transform rounded-full hover:scale-105" onClick={()=> refetch()}><FcRefresh size={22} className={`${isFetching ? "text-blue-300" : ""}`}/></span>
        </div>
       <p className="px-2 md:px-0">Most recent desinations added by our hosts</p>

    {isLoading ? (
        <div className="flex justify-center items-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ): (
      <div className="grid gap-4">
      <div className="grid md:grid-cols-2 grid-cols-1 gap-4 px-2 md:px-0">
        {topRowHotels.map((hotel) => (
          <LatestDestinationCard hotel={hotel} key={hotel._id}/>
        ))}
      </div>
      <div className="grid md:grid-cols-3 gap-4 px-2 md:px-0">
        {bottomRowHotels.map((hotel,i) => (
          <LatestDestinationCard hotel={hotel} key={i}/>
        ))}
      </div>
    </div>
    )}
   
  </div>
  )
}

export default Homepage