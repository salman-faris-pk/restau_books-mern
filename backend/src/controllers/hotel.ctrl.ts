import {Response,Request} from "express"
import Hotel from "../models/hotel";
import { BookingType, HotelSearchResponse, UserType } from "../types/types";
import Stripe from "stripe"
import mongoose from "mongoose";
import User from "../models/user";



const stripe=new Stripe(process.env.STRIPE_API_KEY as string)


const GetSinglHotel = async(req:Request,res:Response) => {

  const id = req.params.id.toString();

  try {

    const hotel = await Hotel.findById(id);
    res.status(200).json(hotel);
    
  } catch (error) {
    res.status(500).json({ message: "Error fetching hotel" });
  }
};




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
      const pageNumber = parseInt(req.query.page ? req.query.page.toString() : "1");
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

     res.status(200).json(response);
    
   } catch (error) {
    console.error("Error searching hotels:", error);
    res.status(500).json({ message: "Something went wrong" });
   }
  };



  const StripePaymentIntent =async(req:Request,res:Response): Promise<void> => {
    const { numberOfNights } = req.body;
    
    const hotelId = req.params.hotelId;
    const user=await User.findById(req.userId);
    if (!user) {
      res.status(400).json({ message: "User not found" });
      return;
  }

    const hotel= await Hotel.findById(hotelId);
    if(!hotel) {
      res.status(400).json({ message: "Hotel not found" })
      return;
    };

    const totalCost= hotel.pricePerNight * numberOfNights;

    const addressline1:string="palathingal";
    const addressline2:string="malappuram";
    const addresscity:string="paarappanagadi";
    const addresstate:string="kerala";
    const addresspostcode:string="672547";






    const paymentIntent= await stripe.paymentIntents.create({
      amount: totalCost * 100,
      currency: "inr",
      description: `Booking for ${hotel.name} - ${numberOfNights} nights`,
      metadata: {
        hotelId,
        userId: req.userId,
      },
      shipping: { 
        name: user.firstName + " " + user.lastName,
        address: {
                line1: addressline1 || "N/A",
                line2: addressline2 || "N/A",
                city: addresscity || "N/A",
                state: addresstate || "N/A",
                postal_code: addresspostcode || "N/A",
                country: "IN",
        },
      }
    });
      
    if(!paymentIntent.client_secret) {
      res.status(500).json({ message: "Error creating payment intent" })
      return;
    };

    const response={
      paymentIntent: paymentIntent.id,
      clientSecret: paymentIntent.client_secret.toString(),
      totalCost
    };

    res.send(response);

  };




  const BookTheHotel = async(req:Request,res:Response):Promise<void> => {
     
    const session= await mongoose.startSession();
    session.startTransaction();

    try {
      const paymentIntentId = req.body.paymentIntentId;
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId as string);

      if (!paymentIntent) {
        await session.abortTransaction();
        session.endSession();
        res.status(400).json({ message: "payment intent not found" })
        return;
      };
    

      if (paymentIntent.metadata.hotelId !== req.params.hotelId || paymentIntent.metadata.userId !== req.userId) {
         await session.abortTransaction();
        session.endSession();
        res.status(400).json({ message: "payment intent mismatch" })
        return;
      };

      if (paymentIntent.status !== "succeeded") {
        await session.abortTransaction();
        session.endSession();
        res.status(400).json({message: `payment intent not succeeded. Status: ${paymentIntent.status}`})
        return;
      };

      const newBooking:BookingType = {
        ...req.body,
        userId: req.userId,
      };

      const hotel = await Hotel.findOneAndUpdate(
        { _id: req.params.hotelId },
        {
          $push: { bookings: newBooking },
        },
        { session }
      );

      if (!hotel) {
        await session.abortTransaction();
        session.endSession();
        res.status(400).json({ message: "hotel not found" })
        return;
      };

      await session.commitTransaction();
      session.endSession();
      res.status(200).send();

      
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      res.status(500).json({ message: "something went wrong" });
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
    GetSinglHotel,
    StripePaymentIntent,
    BookTheHotel,
}