import mongoose from "mongoose";
import { BookingType,HotelType } from "../types/types"



const bookingSchema = new mongoose.Schema<BookingType>({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    hotelId: {type: String, required: true},
    adultCount: { type: Number, required: true },
    childCount: { type: Number, required: true },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    userId: { type: String, required: true },
    totalCost: { type: Number, required: true },
    paymentIntentId: { type: String, required: true },
    isCancelled: { type: Boolean, default: false }
  },{
    timestamps:true
  });
  
  const hotelSchema = new mongoose.Schema<HotelType>({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, required: true },
    adultCount: { type: Number, required: true },
    childCount: { type: Number, required: true },
    facilities: [
        { type: String, required: true }
      ],
    pricePerNight: { type: Number, required: true },
    starRating: { type: Number, required: true, min: 1, max: 5 },
    imageUrls: [
        { type: String, required: true }
      ],
    bookings: [bookingSchema],
  },{
    timestamps: true
  });
  
  
  bookingSchema.index({ userId: 1 });
  bookingSchema.index({ hotelId: 1 });
  bookingSchema.index({ checkIn: 1, checkOut: 1 });

  hotelSchema.index({ userId: 1 }); 
  hotelSchema.index({ city: 1 });
  hotelSchema.index({ country: 1 });
  hotelSchema.index({ 
    city: 1,
    country: 1 
  });
  hotelSchema.index({ name: 'text', description: 'text' }); 

  const Hotel = mongoose.model<HotelType>("Hotel", hotelSchema);
  
  export default Hotel;