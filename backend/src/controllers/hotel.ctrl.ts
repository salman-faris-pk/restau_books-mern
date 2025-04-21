import {Response,Request} from "express"
import Hotel from "../models/hotel";
import { BookingType, HotelSearchResponse } from "../types/types";
import Stripe from "stripe"
import mongoose from "mongoose";
import User from "../models/user";
import Wishlist from "../models/wishlist";
import { generateFakeAddress } from "../helpers/fakeruserdatas";
import { createAndSendInvoice } from "../helpers/PaymenyInvoice";
import { CancellationInvoice } from "../helpers/cancelInvoice"
import calculateNights from "../helpers/calculateNights"

export const stripe=new Stripe(process.env.STRIPE_API_KEY as string)

const GetSinglHotel = async(req:Request,res:Response) => {

  const id = req.params.id.toString();

  try {

    const hotel = await Hotel.findById(id);
    res.status(200).json(hotel);
    
  } catch (error) {
    res.status(500).json({ message: "Error fetching hotel" });
  }
};

const getLatesthotels = async(req:Request,res:Response) => {
  try {
    const hotels=await Hotel.find().sort({ updatedAt: -1 }).limit(8);
    res.status(200).json(hotels);
    
  } catch (error) {
    res.status(500).json({ message: "Error fetching hotels" });
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

     const {addresscity,addressline1,addressline2,addresspostcode,addresstate}=generateFakeAddress()

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
      const {paymentIntentId,numberOfNights}= req.body;
      const hotelId=req.params.hotelId;
          
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
      
      const newBookingId = new mongoose.Types.ObjectId();
      const newBooking:BookingType = {
        ...req.body,
        userId: req.userId,
        _id:newBookingId,
        hotelId,
      };

      const hotel = await Hotel.findOneAndUpdate(
        { _id: hotelId },
        {
          $push: { bookings: newBooking },
        },
        { session, new:true }
      );

      if (!hotel) {
        await session.abortTransaction();
        session.endSession();
        res.status(400).json({ message: "hotel not found" })
        return;
      };

      const totalCost = paymentIntent.amount / 100;
      const hotelOwner = await User.findOneAndUpdate(
        { _id: hotel.userId },
        { $inc: { earned: totalCost } },
        { session, new: true }
      );
  
      if (!hotelOwner) {
        await session.abortTransaction();
        session.endSession();
        res.status(400).json({ message: "Hotel owner not found" });
        return;
      }

      const user = await User.findById(req.userId).session(session);
      if (!user) {
        await session.abortTransaction();
        session.endSession();
        res.status(400).json({ message: "User not found" });
        return;
      };
             
      try {
         await createAndSendInvoice({
        user,
        hotel,
        bookingId: newBooking._id,
        paymentintentId:paymentIntentId,
        amount: totalCost,
        numberOfNights
      });
        
        await hotel.save({ session });
    
    } catch (invoiceError) {
      console.error("Invoice creation failed:", invoiceError);
    }

      await session.commitTransaction();
      session.endSession(); 

      res.status(200).send();

      
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      res.status(500).json({ message: "something went wrong" });
    }
  };


  const CancelBooking = async (req: Request, res: Response): Promise<void> => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { paymentIntentId } = req.body;
        const hotelId = req.params.hotelId;
        const userId = req.userId;

        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId as string);
        
        if (!paymentIntent) {
            await session.abortTransaction(); 
            session.endSession();
            res.status(400).json({ message: "Payment intent not found" });
            return;
        }

        if (paymentIntent.metadata.hotelId !== hotelId || paymentIntent.metadata.userId !== userId) {
            await session.abortTransaction();
            session.endSession();
            res.status(400).json({ message: "Payment intent mismatch" });
            return;
        }

        if (paymentIntent.status === "succeeded") {
            await stripe.refunds.create({
                payment_intent: paymentIntentId as string,
            });
        }

        const hotel = await Hotel.findById(hotelId).session(session);
        if (!hotel) {
            await session.abortTransaction();
            session.endSession();
            res.status(400).json({ message: "Hotel not found" });
            return;
        }

        const bookingIndex = hotel.bookings.findIndex(
            (booking) => booking.paymentIntentId === paymentIntentId
        );

        if (bookingIndex === -1) {
            await session.abortTransaction();
            session.endSession();
            res.status(400).json({ message: "Booking not found" });
            return;
        }

        hotel.bookings[bookingIndex].isCancelled = true;
        
        await hotel.save({ session });

        const booking = hotel.bookings[bookingIndex];
        const totalCost = booking.totalCost;

        await User.findOneAndUpdate(
            { _id: hotel.userId },
            { $inc: { earned: -totalCost } },
            { session }
        );

        const user = await User.findById(userId).session(session);
        if (!user) {
            await session.abortTransaction();
            session.endSession();
            res.status(400).json({ message: "User not found" });
            return;
        }
        
        try {
            await CancellationInvoice({
                user,
                hotel: {
                    _id: hotel._id,
                    name: hotel.name
                },
                bookingId: booking._id.toString(),
                paymentintentId: paymentIntentId,
                amount: totalCost,
                numberOfNights: calculateNights(booking.checkIn, booking.checkOut)
            });
        } catch (invoiceError) {
            console.error("Cancellation invoice failed:", invoiceError);
        }

        await session.commitTransaction();
        session.endSession();

        res.status(200).json({ 
            message: "Booking cancelled and check gmail for more details",
            isCancelled: true
        });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error("Error cancelling booking:", error);
        res.status(500).json({ message: "Something went wrong" });
    }
};



const constructSearchQuery= (queryParams:any) => {
    
    let constructedQuery: any = {};

    if(queryParams.destination) {        
       constructedQuery.$or = [
        { city: { $regex: queryParams.destination, $options: 'i' } },
        { country: { $regex: queryParams.destination, $options: 'i' } }
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


  
const AddToWishlist =async(req:Request,res:Response) : Promise<void>=>{
  
  try {
    
    const userId = req.userId;
    const { hotelId } = req.params;

    await Wishlist.updateOne(
      { userId, hotelId },
      { $set: { status: true } },
      { upsert: true }
    );

    res.status(200).json({ message: "Added to wishlist successfully!" });
      
  } catch (error) {
   res.status(500).json({ message: "Something went throw" });
  };
};


const isHotelInWishlist = async (req: Request, res: Response):Promise<void> => {

  try {

    const userId = req.userId;
    const { hotelId } = req.params;

    const wishlistItem = await Wishlist.findOne({ userId, hotelId }).select("status").lean();

    res.status(200).json({ 
      inWishlist: wishlistItem ? wishlistItem.status : false 
    });
    
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};


const removeFromWishlist = async (req: Request, res: Response):Promise<void> => {
const userId = req.userId; 
const { hotelId } = req.params; 

try {
  const deleted = await Wishlist.deleteOne({ userId, hotelId });

  if (deleted.deletedCount === 0) {
    res.status(404).json({ message: "Hotel not found in wishlist" });
    return;
  }

  res.status(200).json({ message: "Removed from wishlist successfully" });
} catch (error) {
  res.status(500).json({ message: "Something went wrong" });
}
};

const fetchAllWishlistByUser = async(req:Request,res:Response)=>{
    const userId=req.userId;
 try {

  const wishlist=await Wishlist.find({ userId })
     .populate({
      path:"hotelId",
        select: "_id name starRating type imageUrls",
     })
     .sort({ updatedAt: -1 });

  res.status(200).json(wishlist);
  
 } catch (error) {
  res.status(500).json({ message: "Something went wrong" });
 }

};


const checkDateAvailability = async (req: Request, res: Response): Promise<void> => {
  const { hotelId, checkIn, checkOut } = req.body;

  if (!hotelId || !checkIn || !checkOut) {
    res.status(400).json({
      success: false,
      message: "hotelId, checkIn, and checkOut are required"
    });
    return;
  }

  try {
    const newCheckIn = new Date(checkIn);
    const newCheckOut = new Date(checkOut);

    if (newCheckIn >= newCheckOut) {
      res.status(400).json({
        success: false,
        message: "Check-out date must be after check-in date"
      });
      return;
    }

    const hotel = await Hotel.findById(hotelId).select("bookings");
    if (!hotel) {
      res.status(404).json({
        success: false,
        message: "Hotel not found"
      });
      return;
    }

    let conflictMessage = "";
    const hasConflict = hotel.bookings.some(booking => {
      const existingCheckIn = new Date(booking.checkIn);
      const existingCheckOut = new Date(booking.checkOut);

      if (newCheckIn >= existingCheckIn && newCheckIn < existingCheckOut) {
        conflictMessage = `Check-in date conflicts with an existing booking (${existingCheckIn.toDateString()} to ${existingCheckOut.toDateString()})`;
        return true;
      }

      if (newCheckOut > existingCheckIn && newCheckOut <= existingCheckOut) {
        conflictMessage = `Check-out date conflicts with an existing booking (${existingCheckIn.toDateString()} to ${existingCheckOut.toDateString()})`;
        return true;
      }

      if (newCheckIn <= existingCheckIn && newCheckOut >= existingCheckOut) {
        conflictMessage = `Selected dates include already booked period (${existingCheckIn.toDateString()} to ${existingCheckOut.toDateString()})`;
        return true;
      }

      return false;
    });

    if (hasConflict) {
      res.status(200).json({
        success: false,
        message: conflictMessage
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Dates are available for booking"
    });

  } catch (error) {
    console.error("Date availability check failed:", error);
    res.status(500).json({
      success: false,
      message: "Failed to check date availability"
    });
  }
};


export {
    Searchhotel,
    GetSinglHotel,
    StripePaymentIntent,
    BookTheHotel,
    getLatesthotels,
    isHotelInWishlist,
    AddToWishlist,
    removeFromWishlist,
    fetchAllWishlistByUser,
    checkDateAvailability,
    CancelBooking
}