

export type UserType = {
    _id: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    earned?: number;
};

  export type HotelType = {
    _id: string;
    userId: string;
    name: string;
    city: string;
    country: string;
    description: string;
    type: string;
    adultCount: number;
    childCount: number;
    facilities: string[];
    pricePerNight: number;
    starRating: number;
    imageUrls: string[];
    bookings: BookingType[];
  };
  
  export type BookingType = {
    _id: string | number;
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    adultCount: number;
    childCount: number;
    checkIn: Date;
    hotelId:string;
    checkOut: Date;
    totalCost: number;
    paymentIntentId: string;
    isCancelled: boolean;
  };


  export type HotelSearchResponse = {
    data: HotelType[];
    pagination: {
      total: number;
      page: number;
      pages: number;
    };
  };
  

  export type PaymentIntentResponse = {
    paymentIntentId: string;
    clientSecret: string;
    totalCost: number;
  };


  

