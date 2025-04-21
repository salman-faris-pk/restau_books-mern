import { useQuery } from "@tanstack/react-query";
import * as apiClient from "../api/api-client";
import LatestDestinationCard from "../components/LatestDestinationCard";
import { FiRefreshCw } from "react-icons/fi";


const Homepage = () => {
  const {
    data: hotels,
    isLoading,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["fetchlatest"],
    queryFn: () => apiClient.getLatestHotels(),
    staleTime: 10 * 60 * 1000,
  });

  const topRowHotels = hotels?.slice(0, 2) || []; // First 2 hotels,0th and 1th
  const bottomRowHotels = hotels?.slice(2) || []; //Extracts elements from index 2,means remaining all...

  const HotelCardSkeleton = () => (
    <div className="bg-gray-100 rounded-lg overflow-hidden animate-pulse">
      <div className="h-48 bg-gray-200"></div>
      <div className="p-4 space-y-3">
        <div className="h-5 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
      </div>
    </div>
  );

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-2 md:px-0">
        <h2 className="text-2xl md:text-3xl font-bold">Latest Destinations</h2>
        <button
          onClick={() => refetch()}
          className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 
             transition-colors duration-200 focus:outline-none focus:ring-2 
             focus:ring-blue-400/50 active:bg-blue-200"
          aria-label="Refresh"
        >
          <FiRefreshCw
            size={18}
            className={`${isFetching ? "animate-spin" : ""}`}
          />
        </button>
      </div>
      <p className="px-2 md:px-0">Most recent desinations added by our hosts</p>

      {isLoading ? (
         <>
         <HotelCardSkeleton />
         <HotelCardSkeleton />
         </>
      ) : (
        <div className="grid gap-4">
          <div className="grid md:grid-cols-2 grid-cols-1 gap-4 px-2 md:px-0">
            {topRowHotels.map((hotel) => (
              <LatestDestinationCard hotel={hotel} key={hotel._id} />
            ))}
          </div>
          <div className="grid md:grid-cols-3 gap-4 px-2 md:px-0">
            {bottomRowHotels.map((hotel, i) => (
              <LatestDestinationCard hotel={hotel} key={i} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Homepage;
