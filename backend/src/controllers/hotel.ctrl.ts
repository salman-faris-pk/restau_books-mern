import {Response,Request} from "express"
import Hotel from "../models/hotel";
import { HotelSearchResponse } from "../types/types";




const Searchhotel = async (req: Request, res: Response): Promise<void> => {
   try {

    const query= constructSearchQuery(req.query);

    let sortOptions = {};
    switch (req.query.sortOption) {
        case "starRating":
          sortOptions = { starRating: -1 };
          break;
        case "pricePerNightAsc":
          sortOptions = { pricePerNight: 1 };
          break;
        case "pricePerNightDesc":
          sortOptions = { pricePerNight: -1 };
          break;
      };

      const pageSize = 5;
      const pageNumber = parseInt(
        req.query.page ? req.query.page.toString() : "1"
      );

      const skip = (pageNumber - 1) * pageSize;  // if you're on page 4 and the page size is 6, you will skip the first 18 items and start displaying the 19th item on page 4.
  
     const hotels= await Hotel.find(query)
     .sort(sortOptions)
     .skip(skip)
     .limit(pageSize)

     const total= await Hotel.countDocuments(query);

     const response: HotelSearchResponse={
         data: hotels,
         pagination : {
            total,
            page: pageNumber,
            pages: Math.ceil(total / pageSize),
         },
     };

     res.json(response);
    
   } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
   }
  };




  const constructSearchQuery= (queryParams:any) => {
    
    let constructedQuery: any = {};

    if(queryParams.destination) {            //it query the data of city or country which is true
       constructedQuery.$or = [
        {city: new RegExp(queryParams.destination, "i")},
        {country: new RegExp(queryParams.destination, "i")}
       ]
    };

    if(queryParams.adultCount) {       
        constructedQuery.adultCount = {
            $gte: parseInt(queryParams.adultCount),
        }
    };

    if (queryParams.childCount) {
        constructedQuery.childCount = {
          $gte: parseInt(queryParams.childCount),
        };
     };

    
  if (queryParams.facilities) {
    constructedQuery.facilities = {
      $all: Array.isArray(queryParams.facilities)
        ? queryParams.facilities
        : [queryParams.facilities],
    };
  };

  if (queryParams.types) {       
    constructedQuery.type = {
      $in: Array.isArray(queryParams.types)    ////Matches any one value in the array.
        ? queryParams.types
        : [queryParams.types],
    };
  };

  if (queryParams.stars) {
    const starRatings = Array.isArray(queryParams.stars)
      ? queryParams.stars.map((star: string) => parseInt(star))
      : parseInt(queryParams.stars);

     constructedQuery.starRating = { $in: starRatings };
  };

  if (queryParams.maxPrice) {
    constructedQuery.pricePerNight = {
      $lte: parseInt(queryParams.maxPrice).toString(),
    };
  };

  return constructedQuery;

  };




export {
    Searchhotel,
}