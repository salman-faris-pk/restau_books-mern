import { Link } from "react-router-dom";
import { HotelType } from "../../../backend/src/types/types";
import { AiFillStar } from "react-icons/ai";




type Props = {
    hotel: HotelType;
  };
  

const SearchResultsCard = ({ hotel}: Props) => {

  return (

    <div className="grid grid-cols-1 xl:grid-cols-[2fr_3fr] border border-slate-300 rounded-lg p-3 md:p-5 gap-4 md:gap-8">
    <div className="w-full h-[300px]">
      <img
        src={hotel.imageUrls[0]}
        className="w-full h-full object-cover object-center"
      />
    </div>
    <div className="grid grid-rows-[1fr_2fr_1fr]">
      <div>
        <div className="flex items-center">
          <span className="flex">
            {Array.from({ length: hotel.starRating }).map((_,index) => (
              <AiFillStar key={index} className="fill-yellow-400" />
            ))}
          </span>
          <span className="ml-1 text-sm">{hotel.type}</span>
        </div>
        <Link
          to={`/detail/${hotel._id}`}
          className="text-2xl font-bold cursor-pointer"
        >
          {hotel.name}
        </Link>
      </div>

      <div>
        <div className="line-clamp-5 text-sm">{hotel.description}</div>
      </div>

      <div className="grid grid-cols-2 items-end whitespace-nowrap">
        <div className="flex gap-1 items-center">
          {hotel.facilities.slice(0, 3).map((facility,i) => (
            <span className="bg-slate-300 p-1 md:p-2 rounded-lg font-bold text-xs whitespace-nowrap" key={i}>
              {facility}
            </span>
          ))}
          <span className="text-[10px] md:text-sm">
            {hotel.facilities.length > 3 &&
              `+${hotel.facilities.length - 3} more`}
          </span>
        </div>
        <div className="flex flex-col items-end gap-y-1">
          <span className="font-semibold md:font-bold">₹{hotel.pricePerNight} per night</span>
          <Link
            to={`/detail/${hotel._id}`}
            className="bg-blue-600 text-white h-full p-2 font-bold text-md md:text-xl max-w-fit hover:bg-blue-500"
          >
            View More
          </Link>
        </div>
      </div>
    </div>
  </div>

  )
}

export default SearchResultsCard