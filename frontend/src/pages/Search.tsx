import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useSearchContext } from "../contexts/Searchcontext"
import * as apiClient from "../api/api-client";
import { useState } from "react";
import StarRatingFilter from "../components/StarRatingFilter";
import HotelTypesFilter from "../components/HotelTypesFilter";
import FacilitiesFilter from "../components/FacilitiesFilter";
import PriceFilter from "../components/PriceFilter";
import SearchResultsCard from "../components/SearchResultsCard";
import Pagination from "../components/Pagination";
import { MdArrowForwardIos } from "react-icons/md";
import SearchSkeleton from "../components/SearchSkeleton";



const Search = () => {
  const search = useSearchContext();
  const [showFilter, setShowFilter] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [selectedStars, setSelectedStars] = useState<string[]>([]);
  const [selectedHotelTypes, setSelectedHotelTypes] = useState<string[]>([]);
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
  const [selectedPrice, setSelectedPrice] = useState<number | undefined>();
  const [sortOption, setSortOption] = useState<string>("");

  const searchParams = {
    destination: search.destination,
    checkIn: search.checkIn.toISOString(),
    checkOut: search.checkOut.toISOString(),
    adultCount: search.adultCount.toString(),
    childCount: search.childCount.toString(),
    page: page.toString(),
    stars: selectedStars,
    types: selectedHotelTypes,
    facilities: selectedFacilities,
    maxPrice: selectedPrice?.toString(),
    sortOption,
  };

  const { 
    data: hotelData, isLoading,error,isFetching} = useQuery({
    queryKey: ["searchHotels", searchParams],
    queryFn: () => apiClient.SearchHotels(searchParams),
    staleTime: 2 * 60 * 1000,
    placeholderData: keepPreviousData,
  });

  const handleStarsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const starRating = event.target.value;
    setSelectedStars((prevStars) =>
      event.target.checked
        ? [...prevStars, starRating]
        : prevStars.filter((star) => star !== starRating)
    );
  };

  const handleHotelTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const hotelType = event.target.value;
    setSelectedHotelTypes((prevHotelTypes) =>
      event.target.checked
        ? [...prevHotelTypes, hotelType]
        : prevHotelTypes.filter((hotel) => hotel !== hotelType)
    );
  };

  const handleFacilityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const facility = event.target.value;
    setSelectedFacilities((prevFacilities) =>
      event.target.checked
        ? [...prevFacilities, facility]
        : prevFacilities.filter((prevFacility) => prevFacility !== facility)
    );
  };

  if (isLoading) {
    return <SearchSkeleton />;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500 text-lg font-medium">
          Error loading hotels: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-5 px-2 md:px-0">
      {/* Filters Column */}
      <div className="rounded-lg border border-slate-300 p-5 h-fit lg:sticky lg:top-10">
        <h3 
          className="md:hidden text-xl flex items-center cursor-pointer gap-2 pb-5" 
          onClick={() => setShowFilter(!showFilter)}
        >
          FILTERS <MdArrowForwardIos size={16} className={`text-gray-300 ${showFilter ? "rotate-90" : ""}`}/>
        </h3>
        <h3 className="hidden md:block text-lg font-semibold border-b border-slate-300 pb-5">
          Filter by:
        </h3>

        <div className={`space-y-5 ${showFilter ? "block" : "hidden"} md:block`}>
          <StarRatingFilter
            selectedStars={selectedStars}
            onChange={handleStarsChange}
          />
          <HotelTypesFilter
            selectedHotelTypes={selectedHotelTypes}
            onChange={handleHotelTypeChange}
          />
          <FacilitiesFilter
            selectedFacilities={selectedFacilities}
            onChange={handleFacilityChange}
          />
          <PriceFilter
            selectedPrice={selectedPrice}
            onChange={(value?: number) => setSelectedPrice(value)}
          />
        </div>
      </div>
      
      {/* Results Column */}
      <div className="flex flex-col gap-5 relative">
        {isFetching && (
          <div className="absolute inset-0 bg-white bg-opacity-50 flex justify-center items-center z-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        <div className="flex justify-between items-center">
          <span className="text-md md:text-xl font-bold">
            {hotelData?.pagination?.total} Hotels found
            {search.destination ? ` in ${search.destination}` : ""}
          </span>
          <select
            value={sortOption}
            onChange={(event) => setSortOption(event.target.value)}
            className="p-2 border rounded-md"
          >
            <option value="">Sort By</option>
            <option value="starRating">Star Rating</option>
            <option value="pricePerNightAsc">
              Price Per Night (low to high)
            </option>
            <option value="pricePerNightDesc">
              Price Per Night (high to low)
            </option>
          </select>
        </div>

        {hotelData?.data?.length === 0 ? (
         <p className="text-center font-medium text-gray-500 py-10">
             No hotels found matching your criteria...
            </p>
              ) : (
          <>
           {hotelData?.data?.map((hotel) => (
            <SearchResultsCard key={hotel._id} hotel={hotel} />
          ))}
        </>
          )}


        {hotelData && hotelData.pagination.pages > 1 && (
          <div className="mt-4">
            <Pagination
              page={hotelData.pagination.page}
              pages={hotelData.pagination.pages}
              onPageChange={(page) => {
                setTimeout(()=>{
                  setPage(page);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                },200)
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;