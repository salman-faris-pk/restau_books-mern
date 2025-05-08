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
import { MdFilterList } from "react-icons/md";
import SearchSkeleton from "../components/SearchSkeleton";
import { useFilterStore } from "../stores/filterStore";
import { RxCross2 } from 'react-icons/rx';

const Search = () => {
  const search = useSearchContext();
  const [showFilter, setShowFilter] = useState<boolean>(false);

  const {
    selectedStars,
    selectedHotelTypes,
    selectedFacilities,
    selectedPrice,
    sortOption,
    page,
    setSelectedStars,
    setSelectedHotelTypes,
    setSelectedFacilities,
    setSelectedPrice,
    setSortOption,
    setPage
  } = useFilterStore();

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

  const { data: hotelData, isLoading, error, isFetching } = useQuery({
    queryKey: ["searchHotels", searchParams],
    queryFn: () => apiClient.SearchHotels(searchParams),
    staleTime: 3 * 60 * 1000,
    placeholderData: keepPreviousData,
  });

  const handleStarsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const starRating = event.target.value;
    setSelectedStars((prevStars) =>
      event.target.checked
        ? [...prevStars, starRating]
        : prevStars.filter((star) => star !== starRating)
    );
    setPage(1);
  };

  const handleHotelTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const hotelType = event.target.value;
    setSelectedHotelTypes((prevHotelTypes) =>
      event.target.checked
        ? [...prevHotelTypes, hotelType]
        : prevHotelTypes.filter((hotel) => hotel !== hotelType)
    );
    setPage(1);
  };

  const handleFacilityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const facility = event.target.value;
    setSelectedFacilities((prevFacilities) =>
      event.target.checked
        ? [...prevFacilities, facility]
        : prevFacilities.filter((prevFacility) => prevFacility !== facility)
    );
    setPage(1);
  };

  const handleClearFilter = () => {
    setSelectedStars([]);
    setSelectedHotelTypes([]);
    setSelectedFacilities([]);
    setSelectedPrice(undefined);
    setSortOption("");
    setPage(1);
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
    <div className="relative min-h-full">
      {/* Mobile Filter Button */}
      <button
        onClick={() => setShowFilter(true)}
        className="lg:hidden fixed bottom-6 right-6 z-30 bg-blue-600 text-white p-3 rounded-full shadow-lg flex items-center gap-2"
      >
        <MdFilterList size={20} />
        <span>Filters</span>
      </button>

      {/* Filter Sidebar*/}
      <div
        className={`fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity duration-300 lg:hidden ${
          showFilter ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={() => setShowFilter(false)}
      ></div>

      <div
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:hidden ${
          showFilter ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 h-full overflow-y-auto">
          <div className="flex justify-between items-center pb-4 border-b">
            <h3 className="text-lg font-semibold">Filters</h3>
            <button
              onClick={() => setShowFilter(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <RxCross2 size={20} />
            </button>
          </div>
          
          <div className="space-y-5 mt-4">
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
          
          <div className="mt-6">
            <button
              onClick={handleClearFilter}
              className="w-full py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-700 font-medium"
            >
              Clear All Filters
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-5 px-2 md:px-0 pb-20 lg:pb-0">
        {/* Filters Column (Desktop) */}
        <div className="hidden lg:block rounded-lg border border-slate-300 p-5 h-fit sticky top-10">
          <div className="flex items-center justify-between pb-5">
            <h3 className="text-lg font-semibold border-b border-slate-300 pb-5">
              Filter by:
            </h3>
            <button
              onClick={handleClearFilter}
              className="ml-auto -mt-6 p-2 text-gray-500 hover:text-gray-700 bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-all"
              aria-label="Clear"
            >
              <RxCross2 className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-5">
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
            <div className="flex flex-col items-center justify-center py-10 min-h-[300px]">
              <p className="text-center font-medium text-gray-500 mb-6">
                No hotels found matching your criteria...
              </p>
            </div>
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
                  setTimeout(() => {
                    setPage(page);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }, 200);
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;